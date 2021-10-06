import { assertEquals, fs } from "../utils/deps.ts";
import { yellow } from "../cli/fns.ts";

Deno.test({  //TESTS CREATE COMMANDS
  name: "\n\ntesting success of create command\n",
  fn(): void {
    const args = [ //array of tests 
      "create",
      "cli-test",
      "TestApp",
      "8080",
      "TestOne",
      "TestTwo",
      "TestThree",
    ];

    yellow("\n>> project directory was created"); //prints to terminal in yellow
    assertEquals( //tests if create command creates a new proj called cli-test as directory 
      fs.existsSync("./cli-test"), //used to synchronously check if file already exists in given path; RETURNS BOOLEAN
      true, //EXPECTED BOOLEAN VALUE
    );

    yellow("\n>> root component file was created");//prints to terminal in yellow
    assertEquals(//tests if create command creates a new proj called cli-test as directory and TestApp.vue as root file
      fs.existsSync("./cli-test/TestApp.vue"),
      true, //EXPECTED BOOLEAN VALUE
    );

    yellow("\n>> config file was created");//prints to terminal in yellow
    assertEquals(//tests if create command creates vno.config.json file
      fs.existsSync("./cli-test/vno.config.json"),
      true, //EXPECTED BOOLEAN VALUE
    );

    const json = Deno.readTextFileSync("./cli-test/vno.config.json");//prints to terminal in yellow
    const res = JSON.parse(json);

    yellow("\n>> project root labeled in vno.config");
    assertEquals(res.root, args[2]); //tests after create; looks at res(obj).root and compares with args[2]===TestApp

    yellow("\n>> server port labeled in vno.config");
    assertEquals(res.options.port, Number(args[3])); //tests if res.options.port is equal to args[3] === 8080

    yellow("\n>> project title in vno.config");
    assertEquals(res.options.title, args[1]); //tests if res.options.title is equal to args[1] === cli-test

    yellow("\n>> 1/3 child components created");
    assertEquals(
      fs.existsSync("./cli-test/components/TestOne.vue"), //tests if  file already exists in given path
      true, //EXPECTED BOOLEAN VALUE
    );

    yellow("\n>> 2/3 child components created");
    assertEquals(
      fs.existsSync("./cli-test/components/TestTwo.vue"), //tests if  file already exists in given path
      true, //EXPECTED BOOLEAN VALUE, **if test ^^ fails; LINES 53-56 will fail.
    );

    yellow("\n>> 3/3 child components created");
    assertEquals(
      fs.existsSync("./cli-test/components/TestThree.vue"), //tests if  file already exists in given path
      true, //EXPECTED BOOLEAN VALUE
    );
  },
});

Deno.test({ //TESTS IF BUILD COMMANDS WORKED
  name: "\n\ntesting success of build command\n",
  fn(): void {
    yellow("\n>> vno-build directory exists");
    assertEquals(
      fs.existsSync("./cli-test/vno-build"), //run build should create vno-build directory
      true, //EXPECTED BOOLEAN VALUE
    );

    yellow("\n>> build.js file compiled");
    assertEquals(
      fs.existsSync("./cli-test/vno-build/build.js"), // will compile all js into single build.js file
      true, //EXPECTED BOOLEAN VALUE
    );

    yellow("\n>> style.css file compiled");
    assertEquals(
      fs.existsSync("./cli-test/vno-build/style.css"),  // will compile all css into single style.css file
      true, //EXPECTED BOOLEAN VALUE
    );
  },
});
