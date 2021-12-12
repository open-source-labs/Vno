import Vue from "https://deno.land/x/vue_js@0.0.5/mod.js";
import { fs, path } from "../utils/deps.ts";
import renderer from "https://deno.land/x/vue_server_renderer@0.0.4/mod.js";
import { Language, minify } from "https://deno.land/x/minifier@v1.1.1/mod.ts";
import {
  Component,
  getComponent,
  getComponents,
  serializeComponentConfig,
} from "./components.ts";
import { getTags, Mapped, PathData } from "./utils.ts";
import { getAssets } from "./assets.ts";
import * as CONSTANTS from "./constants.ts";

const __dirname = new URL(".", import.meta.url).pathname;
(Vue.config as any).devtools = false;
(Vue.config as any).productionTip = false;

/**
 * Creates the client side javascript for a page level component.
 */
const getPageJs = (config: any, fileName: string) => {
  let js = "Vue.config.productionTip = false;\n";
  for (const dep in config.components) {
    js += `import ${dep} from '${"./" + dep + ".js"}';\n`;
  }
  js += `import exports from './${fileName}.script.js';\n`;
  js +=
    `const data=JSON.parse(document.querySelector("#__VNO_DATA__").textContent);\n`;
  js += `const {getStaticProps, getStaticPaths, ...restExports} = exports;\n`;
  js += `const cmp=new Vue({...restExports, ...${
    serializeComponentConfig(config)
  }}); cmp.$mount('#__vno');`;

  return js;
};

export interface GenHtmlParams {
  entry: string;
  output: string;
  pathData?: PathData;
  cmps?: Mapped<Component>;
  assets?: Mapped<string>;
  reload?: boolean;
  reloadPort?: number;
  clientJsFileName?: string;
  mode: "production" | "development";
}

/**
 * Generate a vue page component to html.
 */
export const genHtml = async (params: GenHtmlParams) => {
  const { entry, output } = params;

  // destructure these params and load them if needed
  let { cmps, pathData, assets } = params;
  pathData = pathData || { params: {} };
  cmps = cmps || (await getComponents());
  assets = assets || (await getAssets([/\.css$/i]));

  const cmp = await getComponent(entry);
  const template = `<div id="__vno">${cmp.source.descriptor.template
    .content as string}</div>`;
  const styles = cmp.source.descriptor.styles;

  let cmpStyles = "\n";
  const seenCss = new Set(cmp.css); // only need one of each css file
  const seenStyles = new Set<string>();
  const components: Mapped<any> = {};
  const tags = getTags(template);
  for (const tag of tags) {
    // only add if is a custom component i.e. in cmps
    if (tag in cmps) {
      components[tag] = cmps[tag].vueCmp;

      for (const css of cmps[tag].css) {
        if (!seenCss.has(css)) {
          seenCss.add(css);
          cmp.css.push(css);
        }
      }

      for (const style of cmps[tag].styles) {
        if (!seenStyles.has(style)) {
          seenStyles.add(style);
          cmpStyles += style + "\n";
        }
      }
    }
  }

  // get needed css
  let rawCss = "\n";
  // loop through css dependency array, performed in reverse because component level css were added last
  for (const css of [...cmp.css].reverse()) {
    const cssFile = path.join(Deno.cwd(), css);

    if (!assets[cssFile]) {
      throw Error("invalid css");
    }

    rawCss += `${assets[cssFile]}\n`;
  }

  // we need to get data from functions exported from the component
  let data = cmp.exports.data ? cmp.exports.data() : {};
  const getStaticPropsData = await Promise.resolve(
    cmp.exports.getStaticProps
      ? cmp.exports.getStaticProps({
        ...pathData,
        fetch,
      })
      : {},
  );
  data = { ...data, ...getStaticPropsData };
  const dataHtml = `<script id="__VNO_DATA__" type="application/json">${
    JSON.stringify(data)
  }</script>`;

  // writing the client side javascript
  const jsFileName = params.clientJsFileName ||
    Math.random().toString(36).substring(2, 15);
  let jsPath: string;
  if (params.mode === "development") {
    jsPath = path.join(Deno.cwd(), ".vno", "dist", "__vno", "static", "js");
  } else {
    jsPath = path.join(Deno.cwd(), "dist", "__vno", "static", "js");
  }
  const jsFilePath = path.join(
    jsPath,
    jsFileName + ".js",
  );
  if (!(await fs.exists(jsFilePath))) {
    await fs.ensureDir(jsPath);
    const clientJs = getPageJs(
      {
        template,
        data() {
          return data;
        },
        components,
      },
      jsFileName,
    );
    await Deno.writeTextFile(
      path.join(
        jsPath,
        jsFileName + ".js",
      ),
      clientJs,
    );
    await Deno.writeTextFile(
      path.join(jsPath, jsFileName + ".script.js"),
      cmp.source.descriptor.script.content,
    );
  }

  // creating the root Vue component
  const App = new Vue({
    ...cmp.exports,
    template,
    data() {
      return data;
    },
    components,
  });

  // render the page component to html
  const bodyHtml = await new Promise<string>((resolve, reject) => {
    renderer(App, (err: any, html: string) => {
      if (err) {
        return reject(err);
      }
      return resolve(html);
    });
  });

  // combine all styles
  const rawStyles = minify(
    Language.CSS,
    cmpStyles + rawCss + styles.map((style: any) => style.content).join("\n"),
  );

  // read the html template
  const htmlTemplate = await Deno.readTextFile(
    path.join(Deno.cwd(), "public", "index.html"),
  );

  // insert styles and body
  let html = htmlTemplate
    .replace(/<\/head>/, `<style>${rawStyles}</style>$&`)
    .replace(/<body>/, `$&${bodyHtml}`);

  // add reload
  if (params.reload) {
    let reloadScript = CONSTANTS.reloadScript;
    if (params.reloadPort) {
      reloadScript = reloadScript.replace(/8080/, params.reloadPort.toString());
    }
    reloadScript = minify(Language.JS, reloadScript);

    html = html.replace(/<\/body>/, `<script>${reloadScript}</script>$&`);
  }

  // add js scripts and data
  html = html.replace(
    /<\/body>/,
    `<script src="/__vno/static/js/${jsFileName}.js" type="module"></script>$&`,
  );
  html = html.replace(/<\/body>/, `${dataHtml}$&`);

  // minify
  // const final = minifyHTML(html, { minifyCSS: true, minifyJS: true });
  const final = html; //not currently minifying b/c issues with the minify pkg

  // write the html file
  await fs.ensureDir(path.parse(output).dir);
  return Deno.writeTextFile(output, final);
};

// DEVELOPMENT ONLY
if (import.meta.main) {
  const start = Date.now();
  await fs.emptyDir(path.join(Deno.cwd(), ".vno"));
  await genHtml({
    entry: "./pages/index.vue",
    output: "./.vno/dist/index.html",
    mode: "development",
  });
  console.log("html took", Date.now() - start, "ms");
}
