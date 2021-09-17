import * as parse from "../lib/parser.ts";
import Component from "../factory/Component.ts";
import Storage from "../factory/Storage.ts";
import Queue from "../factory/Queue.ts";
import { assertEquals, assertNotEquals, path } from "../utils/deps.ts";
import { patterns } from "../utils/constants.ts";
import { yellow } from "../cli/fns.ts";

const testRoot = new Component(
  "Test",
  path.join(Deno.cwd(), "./core/__tests__/test-components/Test.vue"),
);
// sets up test root component
const testChild = new Component(
  "TestChild",
  path.join(Deno.cwd(), "./core/__tests__/test-components/TestChild.vue"),
);
// sets up test child component

const storage = Storage.create();
const queue = new Queue();
storage.root = testRoot;
storage.cache(testChild.label, testChild); //stores testChild component into storage component container with key testChild.label
// creates storage and queue for testing

Deno.test({ // tests if template property was added
  name: "\n\nparse.template successfully adds a 'template' property\n",
  fn() {
    parse.template(testRoot);

    yellow("\n>> Component's template has a value && typeof string\n");

    assertNotEquals(testRoot.template, null || undefined);
    assertEquals(typeof testRoot.template, "string");

    yellow(">> Component's template contains no HTML comments\n");

    assertEquals(testRoot.template?.match(patterns.htmlComment), null);

    yellow(">> Component's template contains no carriage returns\n");

    assertEquals(testRoot.template?.indexOf("\r"), -1);
  },
});

Deno.test({ //tests to check if script was properly added
  name: "\n\nparse.script successfully adds a 'script' property\n",
  async fn() {
    await parse.script(testRoot, storage, queue);

    yellow("\n>> Component's script has a value && typeof string\n");

    assertNotEquals(testRoot.script, null || undefined); //tests script if it has a value or undefined
    assertEquals(typeof testRoot.script, "string"); //tests to check if value is 'string'

    yellow(">> parse.script removes comments\n");
    assertEquals( 
      testRoot.script?.match("// this is a javascript comment\n"), // checks if parser removes comment
      null,//EXPECTS NULL
    );

    yellow(">> parse.script does not remove URLs\n");
    assertNotEquals(
      testRoot.script?.match("http://thisurl.com/will/not/be/deleted"), // checks if url matches and is not removed
      null, //EXPECTS NULL
    );

    yellow(">> testRoot has a child reference to its dependant\n");
    assertEquals(
      testRoot.dependants?.head,
      testChild, 
    );
  },
});

Deno.test({ //tests to check if styles was properly added
  name: "\n\nparse.style successfully adds a 'styles' property\n",
  fn() {
    parse.style(testRoot);

    yellow("\n>> Component's styles has a value && typeof string\n");

    assertNotEquals(testRoot.styles, null || undefined);
    assertEquals(typeof testRoot.styles, "string");

    yellow(">> parse.style removes comments\n");
    assertEquals(
      testRoot.script?.match("some CSS comments"), // checks if parser removes comments
      null, //EXPECTS NULL
    );

    yellow(">> parse.style detects scss from source\n"); //checks if scss file is detected from source
    assertEquals(
      testRoot.style_data[0].lang,
      "scss",
    );
  },
});
