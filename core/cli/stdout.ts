import { colors } from "../utils/deps.ts";
import * as fn from "./fns.ts";

export const logo = (colors.bold(`
  __   ___ __   ___
  \\ \\ / / '_ \\ /   \\
   \\ V /| | | | (_) |
    \\_/ |_| |_|\\___/
`));

// prints after build
export const ASCII = function () {
  console.log(colors.green(logo));
};

// prints instead of ASCII if 'quiet' argument is passed
export const QUIET = function () {
  console.log(colors.green("\nvno build complete...\n"));
};

// prints when a server is listening
export const LISTEN = function (port: number, hostname?: string) {
  console.log(
    colors.green(
      colors.bold(
        `dev server is listening on ${
          colors.blue("http://localhost:" + port)
        }\n`,
      ),
    ),
  );
};

// print warning
export const WARN = function (msg: string) {
  console.warn(`\n${colors.yellow(msg)}\n`);
};
interface DocInfo {  //SETS REQS FOR DOCINFO
  version: string | undefined;
  description: string;
  docs: string | undefined;
  module: string | undefined;
  commands: Commands[];
  options: Commands[];
}
interface Commands { //SETS REQS FOR COMMANDS
  action: string;
  cmd: string[];
  about: string;
}

// prints module specific information
export const INFO = function (doc: DocInfo) {
  // version
  console.log(fn.keyYellow("version", doc.version));
  // description
  console.log(`\n${colors.green(fn.lineLength(doc.description, 52, 4))}`);
  console.log(`\n${fn.keyYellow("docs", doc.docs)}`);
  console.log(`${fn.keyYellow("module", doc.module)}`);
};

// commands
export const CMDS = function (doc: DocInfo) {
  console.log("\n" + fn.keyYellow("commands"));
  doc.commands.forEach((obj: Commands) => {
    const { action, cmd, about } = obj;
    console.log("\n" + fn.keyGreen(action));
    cmd.forEach((el: string) => {
      console.log(`${fn.lineLength(colors.yellow(">>") + "  " + el, 61, 6)}`);
    });
    console.log(`${fn.lineLength(about, 60, 6)}`);
  });
};

// options flags
export const OPTIONS = function (doc: DocInfo) {
  console.log("\n" + fn.keyYellow("options"));
  doc.options.forEach((obj) => {
    const { cmd, about } = obj;
    cmd.forEach((el: string) => {
      console.log(`\n${fn.keyGreen(el)}`);
    });
    console.log(`      ${colors.yellow(">>")}  ${about}`);
  });
  console.log("\n");
};
