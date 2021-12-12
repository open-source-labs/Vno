import type { Component, Config, Vue } from "../dts/factory.d.ts";
import { configReader } from "../lib/config_reader.ts";
import { vueLogger } from "../lib/vue_logger.ts";
import { assertEquals, assertNotEquals, path } from "./test_deps.ts";

// configReader tests:
// Tests if the configReader can read vno.config.json properly
Deno.test({
  name: "configReader returns object with valid props",

  async fn(): Promise<void> {
    await Deno.writeTextFile(
      path.join(Deno.cwd(), "vno.config.json"),
      JSON.stringify({
        "root": "App",
        "entry": "../../example/test_demo/",
        "vue": 3,
        "options": {
          "title": "benchmark test project",
        },
      }),
    );

    const config: Config | unknown = await configReader(); //checks if Config or Unknown; if unknown invoke configReader()
    assertNotEquals(config as Config, undefined); // checks if config is undefined
    assertEquals((config as Config).vue, 3); //tests config as Config with stringify keys on LINE 15-19 and checks value
    assertEquals((config as Config).entry, "../../example/test_demo/"); // checks entry
    assertEquals((config as Config).root, "App"); // checks root is equal to "App"
    assertNotEquals((config as Config).options, undefined); // check if options exists
    assertEquals(
      (config as Config).options?.title,
      "benchmark test project",
    );

    await Deno.remove("./vno.config.json");
  },
});

// vueLogger tests:
const component = <Component> { label: "TestRoot", name: "test-root" };

Deno.test({ //test checks if vueLogger returns object with valid props
  name: "vueLogger returns object with valid props for Vue2",

  fn(): void {
    const V2: Vue.State = vueLogger(
      2 as Vue.Version,
      component,
      "label",
    );

    assertNotEquals(V2 as Vue.State, undefined);

    const dep = "import Vue from ";
    assertEquals((V2 as Vue.State).dep, dep); // checks to see if dep matches

    const mount = `\nTestRoot.$mount("#test-root")`;
    assertEquals((V2 as Vue.State).mount, mount); // checks to see if mount matches
  },
});

Deno.test({ //test checks if vueLogger returns object with valid props for VUE3
  name: "vueLogger returns object with valid props for Vue3",

  fn(): void {
    const V3: Vue.State = vueLogger(
      3 as Vue.Version,
      component,
      "label",
    );

    assertNotEquals(V3 as Vue.State, undefined);

    const dep = "import * as Vue from "; // checks to see if dep matches
    assertEquals((V3 as Vue.State).dep, dep);

    const mount = `\nlabel.mount("#test-root")`;
    assertEquals((V3 as Vue.State).mount, mount); // checks to see if mount matches
  },
});
