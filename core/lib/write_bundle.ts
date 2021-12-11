import type { Component, Storage } from "../dts/factory.d.ts";
import { lintignore, VnoPath } from "../utils/constants.ts";
import { liveReloadScript } from "../utils/livereload.ts";
import { hasValidInstance } from "../utils/type_guards.ts";
import { fs } from "../utils/deps.ts";

export function writeBundle(storage: Storage, isDev?: boolean): void {
  // console.log("(/core/lib/write_bundle.ts) Storage: ", storage);
  fs.ensureDirSync(VnoPath.Dir);
  fs.ensureDirSync(VnoPath.DirSSR);

  if (fs.existsSync(VnoPath.Style)) {
    Deno.removeSync(VnoPath.Style);
  }

  if (fs.existsSync(VnoPath.StyleJS)) {
    Deno.removeSync(VnoPath.StyleJS);
  }
  //"vno-build/build.js" ->  dep: "import Vue from ", ->
  const reloadScript = liveReloadScript.replace(
    ":8080",
    `:${storage.config.options?.reloadPort}`,
  );
  // isDev => live reload
  Deno.writeTextFileSync(
    VnoPath.Build,
    lintignore +
      `${storage.vue.dep}"${storage.vue.cdn}";\n\n
    ${isDev ? reloadScript : ""} `,
  );

  //vno-ssr/build.js
  Deno.writeTextFileSync(
    VnoPath.BuildSSR,
    lintignore + `${storage.vue.dep}"https://deno.land/x/vue_js@/mod.js";\n`,
  );

  postorderTraverse(storage.root);
  if (storage.vue.state === 3) {
    preorderTraverse(storage.root);
  }

  Deno.writeTextFileSync(VnoPath.Build, storage.vue.mount, {
    append: true,
  });

  Deno.writeTextFileSync(
    VnoPath.BuildSSR,
    "export default " + storage.root.label,
    {
      append: true,
    },
  );
}

function postorderTraverse(current: Component): void {
  hasValidInstance(current);

  if (current.dependants != null && current.dependants.head) {
    postorderTraverse(current.dependants.head);
  }

  if (current.sibling) {
    postorderTraverse(current.sibling);
  }

  if (current.instance) {
    Deno.writeTextFileSync(VnoPath.Build, current.instance, {
      append: true,
    });
    Deno.writeTextFileSync(VnoPath.BuildSSR, current.instance, {
      append: true,
    });
  }

  if (current.styles) {
    Deno.writeTextFileSync(VnoPath.Style, current.styles, {
      append: true,
    });
  }
}

function preorderTraverse(current: Component): void {
  if (current.registration) {
    Deno.writeTextFileSync(VnoPath.Build, current.registration, {
      append: true,
    });
    Deno.writeTextFileSync(VnoPath.BuildSSR, current.registration, {
      append: true,
    });
  }

  if (current.dependants != null && current.dependants.head) {
    preorderTraverse(current.dependants.head);
  }

  if (current.sibling) {
    preorderTraverse(current.sibling);
  }
}
