import { _, colors, fs, ProgressBar } from "../utils/deps.ts";
import * as fn from "./fns.ts";
import * as out from "./constants.ts";
import * as template from "./templates.ts";

interface CreateProjectObj {
  title?: string;
  custom?: boolean;
  root?: string;
  port?: string;
  vue?: string;
  components?: string[];
  router?: string;
  //ssr?: boolean;
}

/**
 * Function to create standard Vue SPA
 *
 * @param obj of type CreateProjectObj
 * @returns undefined
 */
export const createSinglePageApp = async function (
  obj: CreateProjectObj,
) {
  let app = out.options;

  // app becomes the evaluated result of the customize function invoked with the user arguments
  app = await customize(obj);
  //displays creating message in green
  fn.green(out.creating);

  // progress bar
  renderProgress();
  let complete = false;

  // app templates
  const root: string = template.rootComponent(app);
  const rootFile = `${app.root}.vue`;
  const component: string = template.childComponent(app.components[0]);
  const componentFiles = app.components.map( // creates vue components for each based on passed in strings
    ((sfc: string) => `components/${sfc}.vue`),
  );
  const generic: string = template.genericComponent();
  const html: string = template.htmlTemplate(app);
  const config: string = template.vnoConfig(app);
  // router template
  const vue3Router: string = template.vue3RouterTemplate(app);
  // const vue2Router: string = template.vue2RouterTemplate(app);
  // do I need to add /views directory for all components?


  // Creates Folders
  // write to app directory
  await fs.ensureDir(out.pub); // public dir
  await fs.ensureDir(out.components); // components dir
  //ensureDir/ensureFile are methods that check for a file. if It does not exist, it creates a file.
  await fs.ensureFile(out.indexhtml);
  //Deno.write then writes into the file that was created by fs.ensureFile
  await Deno.writeTextFile(out.indexhtml, html);
  await fs.ensureFile(out.vnoconfig);
  await Deno.writeTextFile(out.vnoconfig, config);
  await fs.ensureFile(rootFile);
  await Deno.writeTextFile(rootFile, root);
  // router
  await fs.ensureDir(out.router); // router dir
  await fs.ensureFile(out.routerJs);
  if (app.vue === 3){
    await Deno.writeTextFile(out.routerJs, vue3Router);
  } 
  // else if (app.vue === 2) {
  //   await Deno.writeTextFile(out.routerJs, vue2Router);
  // }


  componentFiles.forEach(async (filename: string, i: number) => {
    await fs.ensureFile(filename);
    if (i === 0) await Deno.writeTextFile(filename, component);
    else await Deno.writeTextFile(filename, generic);
  });

  return;
};

export const customize = async function (obj: CreateProjectObj) {
  //all of these needs to be true, if one is undefined preset is undefined - short circuiting
  const preset = obj.title && obj.port && obj.root && obj.components; //&& obj.ssr

  //out is all the constants being exported from the constants file -
  //out.options is referencing the interface that has a title, root, port, components
  let output = out.options;
  console.log(output);
  // request if a user would like to customize.
  if (!preset) {
    const choice = await prompt(out.custom, "yes/no") as string;
    //if user choises no, returns the values from output
    if (choice.trim()[0].toLowerCase() !== "y") return output;
  }
  //if user types yes goes to lines below and starts customizing
  //displays init message in green
  fn.green(out.init);
  const reqs = out.reqs.slice();

  // Vue Router - 9/18/21 - @MALRMALR
  let router;
  if (obj.router) {
    //if router is true, remove string "\nVue Router:" from req array
    reqs.pop();
    router = obj.router;
  } else {
    router = await prompt(reqs.pop() as string, "yes/no") as string;
  }



  // vue version
  let vue;
  if (obj.vue) {
    //if the version exists, remove string "\nVersion number for Vue:" from req array
    reqs.pop();
    vue = obj.vue;
  } else {
    vue = await prompt(reqs.pop() as string, "3") as string;
  }
  vue = parseInt(vue, 10);


  // project title
  let title;
  if (obj.title) {
    //if the title exists, remove string "\nPlease enter a title:" from req array
    reqs.pop();
    title = obj.title;
  } else {
    title = await prompt(reqs.pop() as string, "Your Project") as string;
  }

  // label root component file
  let root;
  if (obj.root) {
    reqs.pop();
    root = obj.root;
  } else {
    root = await prompt(reqs.pop() as string, "App") as string;
  }

  // preferred port
  let port;
  if (obj.port) {
    reqs.pop();
    port = obj.port;
  } else {
    port = await prompt(reqs.pop() as string, "3000") as string;
  }
  port = parseInt(port, 10);

  // additional components
  let components;
  if (obj.components) {
    reqs.pop();
    components = obj.components;
  } else {
    const response = await prompt(reqs.pop() as string);
    components = response != null &&
        response.toLowerCase().trim() != "none" &&
        response.trim() != "0"
      ? response.split(/\ +/)
      : out.options.components;
  }

  // request to confirm input
  fn.green(
    fn.confirmation(title, root, components.join(" + "), port.toString(), vue.toString(), router),
  );

  let confirm;
  if (!preset) {
    confirm = await prompt(reqs.pop() as string, "yes/no") as string;
  }

  if (preset || confirm?.trim()[0].toLowerCase() === "y") {
    // checks for router option (yes or no)
    // if (router?.trim()[0].toLowerCase() !== "y") {
      output = { title, root, components, port, vue, router };
    // } else {
    //   output = { title, root, components, port, vue };
    // }
    fn.green(out.creating);
  } else { // reset on rejection
    fn.yellow(out.reset);
    await customize(obj);
  }

  return output;
};

export const renderProgress = function (): void {
  const total = 100;
  let percent = 0;
  const progressBar = new ProgressBar({
    total,
    clear: true,
    complete: colors.bgGreen(" "),
    incomplete: colors.bgWhite(" "),
    display: out.load,
  });

  const run = function () {
    if (percent <= total) {
      progressBar.render(percent++);
      setTimeout(() => run(), 20);
    }
  };
  run();
  return;
};
