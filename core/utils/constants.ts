import { Component } from "../dts/factory.d.ts";

export enum ComponentType {
  Primitive = "PRIMITIVE",
  Composite = "COMPOSITE",
}

export const Vue = {
  version2: {
    dep: "import Vue from ",
    cdn: "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js",
    mount: (root: Component) => `${root.label}.$mount("${root.name}")`,//can choose root file
  },
  version3: {
    dep: "import * as Vue from ",
    cdn: "https://cdn.jsdelivr.net/npm/vue@3.0.5/dist/vue.esm-browser.js",
    mount: (root: Component) => `app.mount("${root.name}")`, //root file set to app
  },
};

// relative paths for vno-build/ bundle
export const VnoPath: Record<string, string> = {
  DirSSR: "vno-ssr",
  Dir: "vno-build",
  Build: "vno-build/build.js",
  Style: "vno-build/style.css",
  StyleJS: "vno-ssr/style.js",
  BuildSSR:"vno-ssr/build.js",
};

// ignore linting in build
export const lintignore = `/* eslint-disable */
/* eslint-disable prettier/prettier */
// deno-lint-ignore-file
`;

// reoccuring patterns
//URL
//g=global search==> returns an array of all that the pattern matches
//parenthesis means starting a capturegroup inside parens find any patterns matching this and definitelyfind"://"
//"/w"
//"+" includes stuff after it
//find :
//websites to test regex pattern
//"\s" find white space {2,} at least 2 spaces as white spaces
export const patterns: Record<string, RegExp> = {
  multilineComment: /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\//gm,
  htmlComment: /<!--([\s\S]*?)-->/gm, // <!-- comment -->
  import:
    /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/gm,
  url:
    /(ftp|http|https|file):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gm,
  whitespace: /(\s{2,})/g,
};
