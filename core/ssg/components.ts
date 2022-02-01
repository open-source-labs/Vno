import Vue from "https://deno.land/x/vue_js@0.0.5/mod.js";
import * as fs from "https://deno.land/std@0.123.0/fs/mod.ts";
import * as vueCompiler from "https://denopkg.com/crewdevio/vue-deno-compiler/mod.ts";
import * as path from "https://deno.land/std@0.99.0/path/mod.ts";
import { getExport, getTags, Mapped, VueExport } from "./utils.ts";

export interface Component {
  name: string;
  path: string;
  raw: string;
  source: any;
  dependencies: Set<string>;
  dependants: Set<string>;
  exports: VueExport["default"];
  css: string[];
  styles: string[];
  vueCmp: any;
  components: Mapped<Component>;
}

/**
 * Detect if there are any circular dependencies within components.
 */
const checkDepsCycle = (cmps: Mapped<Component>) => {
  const seen = new Set<string>();
  const completed = new Set<string>();

  const dfs = (cmp: Component) => {
    for (const depName of cmp.dependencies) {
      // if a component is seen but not completed, then that means the component has remaining dependencies that have not been completed
      if (seen.has(depName) && !completed.has(depName)) {
        return true;
      }

      if (!seen.has(depName)) {
        seen.add(depName);
        if (dfs(cmps[depName])) return true;
      }
    }

    completed.add(cmp.name);
    return false;
  };

  for (const cmp of Object.values(cmps)) {
    if (!seen.has(cmp.name)) {
      seen.add(cmp.name);
      if (dfs(cmp)) return true;
    }
  }
  return false;
};

/**
 * Add dependency info to a component.
 */
export const addComponentDeps = (cmp: Component, cmps: Mapped<Component>) => {
  const deps = new Set<string>();

  const tags = getTags(cmp.source.descriptor.template.content as string);

  for (const tag of tags) {
    if (tag in cmps) {
      deps.add(tag);
    }
  }

  return deps;
};

/**
 * Add dependency info to all components.
 */
const addComponentsDeps = (cmps: Mapped<Component>) => {
  for (const cmp of Object.values(cmps)) {
    cmp.dependencies = addComponentDeps(cmp, cmps);
  }
};

/**
 * Add css info to all components, a component should have css for itself and all of its dependent components.
 */
const addCssDeps = (cmps: Mapped<Component>) => {
  const seen = new Set<string>();

  const dfs = (cmp: Component) => {
    const seenCss = new Set(cmp.css);
    const seenStyles = new Set(cmp.styles);

    for (const depName of cmp.dependencies) {
      if (!seen.has(depName)) {
        seen.add(depName);
        dfs(cmps[depName]);
      }

      // add unique css from dependency
      for (const css of cmps[depName].css) {
        if (!seenCss.has(css)) {
          seenCss.add(css);
          cmp.css.push(css);
        }
      }

      // add unique styles
      for (const style of cmps[depName].styles) {
        if (!seenStyles.has(style)) {
          seenStyles.add(style);
          cmp.styles.push(style);
        }
      }
    }
  };

  for (const cmp of Object.values(cmps)) {
    if (!seen.has(cmp.name)) {
      seen.add(cmp.name);
      dfs(cmp);
    }
  }
};

/**
 * Add vue component to all components.
 */
const makeVue = (
  cmps: Mapped<Component>,
) => {
  const seen = new Set<string>();

  const dfs = (cmp: Component) => {
    const components: { [name: string]: any } = {};

    // need to complete this component's dependencies first
    for (const depName of cmp.dependencies) {
      if (!seen.has(depName)) {
        seen.add(depName);
        dfs(cmps[depName]);
        cmps[depName].dependants.add(cmp.name);
      }

      components[depName] = cmps[depName].vueCmp;
    }

    const vueCmp = (Vue as any).component(cmp.name, {
      ...cmp.exports,
      name: cmp.name,
      template: cmp.source.descriptor.template.content as string,
      components,
    });

    cmp.vueCmp = vueCmp;
    cmp.components = components;
  };

  for (const cmp of Object.values(cmps)) {
    seen.add(cmp.name);
    dfs(cmp);
  }
};

/**
 * Converting the component config to a string.
*/
export const serializeComponentConfig = (
  input: any,
  short = false,
  skip = <string[]> ["getStaticProps", "getStaticPaths"], // exclude these from the client js
): string => {
  if (typeof input === "string") {
    return `\`${input}\``;
  }

  if (typeof input !== "object") {
    return input.toString();
  }

  if (Array.isArray(input)) {
    let res = "[";
    for (const el of input) {
      res += serializeComponentConfig(el) + ",";
    }
    res += "]";
    return res;
  }

  let res = "{";
  for (const key in input) {
    if (short) {
      res += key + ",";
      continue;
    }

    if (skip.includes(key)) {
      continue;
    }

    const val = serializeComponentConfig(
      input[key],
      ["components"].includes(key), // components will use shorthand syntax b/c it's values will be imported in as the component name
      skip,
    );

    if (val.match(/^\w+\(\)/)) {
      res += val + ",";
    } else {
      res += key + ":" + val + ",";
    }
  }
  res += "}";
  return res;
};

/**
 * Write the client side js for every component. This is needed for client side 'hydration'.
*/
const writeClientJs = async (
  cmps: Component[],
  mode: "development" | "production" = "development",
) => {
  let jsPath: string;
  if (mode === "development") {
    jsPath = path.join(Deno.cwd(), ".vno", "dist", "__vno", "static", "js");
  } else {
    jsPath = path.join(Deno.cwd(), "dist", "__vno", "static", "js");
  }
  await fs.ensureDir(jsPath);

  const promises: Promise<any>[] = [];

  for (const cmp of cmps) {
    let js = `import exports from './${cmp.name}.script.js';\n`;
    for (const dep of cmp.dependencies) {
      js += `import ${dep} from '${"./" + dep + ".js"}';\n`;
    }
    js += `const {getStaticProps, getStaticPaths, ...restExports} = exports;\n`;
    js += `const cmp = Vue.component('${cmp.name}',{...restExports, ...${
      serializeComponentConfig({
        name: cmp.name,
        template: cmp.source.descriptor.template.content as string,
        components: cmp.components,
      })
    }});\nexport default cmp;`;

    promises.push(Deno.writeTextFile(
      path.join(
        jsPath,
        cmp.name + ".js",
      ),
      js,
    ));
    promises.push(Deno.writeTextFile(
      path.join(jsPath, cmp.name + ".script.js"),
      cmp.source.descriptor.script.content,
    ));
  }

  await Promise.all(promises);
};

/**
 * Get the info for a vue component.
 */
export const getComponent = async (filePath: string): Promise<Component> => {
  const name = path.parse(filePath).name;

  const raw = await Deno.readTextFile(filePath);

  const source = vueCompiler.parse(raw);

  const obj = await getExport(source.descriptor.script.content as string);
  const styles = source.descriptor.styles
    .map((style: any) => style.content)
    .filter((style: string) => style != "\n");

  return {
    name,
    path: filePath,
    raw,
    source,
    dependencies: new Set(),
    dependants: new Set(),
    exports: obj.default,
    css: obj.default.css || [],
    styles,
    vueCmp: null,
    components: {},
  };
};

/**
 * Get all project vue components.
 */
export const getComponents = async (
  mode: "development" | "production" = "development",
) => {
  const cmps: Mapped<Component> = {};

  // get components from components folder
  for await (
    const file of fs.walk(path.join(Deno.cwd(), "components"), {
      exts: ["vue"],
    })
  ) {
    const cmp = await getComponent(file.path);
    cmps[cmp.name] = cmp;
  }

  addComponentsDeps(cmps);
  if (checkDepsCycle(cmps)) {
    throw Error("cycle exists");
  }

  addCssDeps(cmps);
  makeVue(cmps);
  await writeClientJs(Object.values(cmps), mode);

  return cmps;
};

// DEVELOPMENT ONLY
if (import.meta.main) {
  const jsPath = path.join(Deno.cwd(), ".vno", "dist", "__vno", "static", "js");
  await fs.emptyDir(jsPath);
  const cmps = await getComponents();
  console.log(cmps);
}
