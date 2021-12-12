import { Component, ComponentList, Resolve } from "../dts/factory.d.ts";
import { typescriptCompile } from "./ts_compile.ts";
import { preorderScrub } from "./scrub.ts";
import { patterns } from "../utils/constants.ts";
import * as utils from "../utils/utils.ts";
import { _, colors } from "../utils/deps.ts";

export const _script: Resolve.Source = async function (data, path, tsCheck) {
  if (typeof data === "string") {
    throw new TypeError("invalid arguments");
  }
  //"^" beginning of line
  //"\s" looks for whitespace
  //looking for export
  //"*" 0 or more
  //() capture group: please find any in capture group and also allow you to remember it refer
  //to it by $1,2,3 etc.. like postgres $1, $2 for points you want to make dynamic.
  //so later you can change the $1 that you can find and replace
  const start = utils.indexOfRegExp(/^\s*(export)/, data);
  const end = data.lastIndexOf("}");

  const trimmed = data.slice(start + 1, end).join("\n");
  //grabed trim a string of key:value pairs and putting it inside object
  let script = tsCheck
    ? await typescriptCompile(`({ ${trimmed} })`, path)
    : trimmed as string;

  script = script
    .replace(patterns.multilineComment, "")
    .slice(0, script.lastIndexOf(";"));

  return script as string;
};

//locates component property in string - locates references to children saved as string - checks storage tries to retreive object
export const _dependants: Resolve.Attrs = function (curr, arr, storage, queue) {
  if (!Array.isArray(arr) || !storage || !queue) {
    throw new TypeError("invalid arguments");
  }

  // locate if this component has any children
  const start = utils.indexOfRegExp(/^\s*(components\s*:)/gm, arr);
  // if the current component has no identified dependants, break from function
  if (start < 0) return;
  const children = arr.slice(start);
  const end = children.findIndex((el) => el.includes("}")) + 1;

  const componentsStr = utils.sliceAndTrim(children, 0, end);

  const iter: string[] = _.compact(
    utils.trimAndSplit(
      componentsStr,
      componentsStr.indexOf("{") + 1,
      componentsStr.indexOf("}"),
    ),
  );
  // uses the found reference to retrieve the child component in storage
  const dependants: ComponentList = iter.map(
    (child: string) => storage.get(child) as Component,
  );

  curr.isComposite();

  while (dependants.length) {
    const component = dependants.pop();
    if (component) {
      // add unparsed components to the queue
      if (!component.is_parsed) queue.enqueue(component);
      // reposition children higher on dependency graph
      preorderScrub(component.label, curr, storage);
      //basically preorder traversal  -  in order to write bundle in correct order, never reference dependancy before its defined, parent never written above child
      //wants to do bottom most children first - most primitive at top all the way down to app.ts
      //scrub traverses through application tree, finds out if current comp has already been referenced, if so removes from tree and puts it on current location
      //
      // link the child component as a dependant
      curr.dependants?.add(component);
      //dependant property on curr is essentially a linked list helps us traverse the component tree
    }
  }
};

//vno struggles with third party imports in component file.
//this collects all potential imports.  inserts them at the top of the bundle - not working perfectly
//
export const _middlecode: Resolve.Attrs = async function (curr, script) {
  const data = curr.script_data.content.split("\n");
  let endLine = false;

  const tagPattern = /<script.*>/gim;
  const chunks: string[] = [];
  const imports: string[] = [];

  for (const chunk of data) {
    if ((/export default/gm).test(chunk)) {
      endLine = true;
    }

    if (
      !endLine &&
      !tagPattern.test(chunk) &&
      !chunk.includes(".vue")
    ) {
      if (patterns.import.test(chunk)) {
        imports.push(chunk);
        // TODO: resolve and inject all imports not .vue or is a import_map.json call
      } else {
        chunks.push(chunk);
      }
    }
  }

  const compilerOutPut = await typescriptCompile(
    chunks.join("\n"),
    curr.path,
    false,
  );

  const output = await _imports(
    `${imports.join("\n")}\n${compilerOutPut}`,
    curr.path,
    script as string,
  );

  return output;
};

export const _imports: Resolve.Source = async function (source, path, script) {
  if (typeof source !== "string") {
    throw new TypeError("invalid arguments");
  }

  const temp = `./${Math.random().toString().replace(".", "")}.ts`;

  try {
    // saves import statements from external sources
    if (
      source.trim() !== "" &&
      patterns.import.test(source.trim())
    ) {
      const file = await Deno.create(temp);
      const encoder = new TextEncoder();

      await file.write(encoder.encode(`${source} ({ ${script} })`));

      const { files, diagnostics } = await Deno.emit(temp, {
        bundle: "module",
        check: true,
        compilerOptions: { strict: false },
      });

      // show bundler diagnostic
      if (diagnostics?.length) {
        diagnostics.forEach((file) => {
          console.log(
            colors.yellow("[vno warn] => "),
            colors.green(file.messageText ?? ""),
          );
        });
      }

      let out = "";
      for (const script in files) {
        out += files[script];
      }
      // remove temp file
      await Deno.remove(temp, { recursive: true });

      // remove component object
      return out.replace(/\(\{((?:.|\r?\n)+?)\}\);/gm, "");
    }

    // ignore if import statement is not from external source
    return source;
  } catch (e) {
    await Deno.remove(temp, { recursive: true });
    throw new Error(
      colors.red(
        `Resolve bundler Error in ${colors.yellow(path)}`,
      ),
    );
  }
};
