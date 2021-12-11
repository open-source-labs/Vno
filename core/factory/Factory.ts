import { checkOptions, isStorageReady } from "../utils/type_guards.ts";
import { fs, path } from "../utils/deps.ts";
import { configReader } from "../lib/config_reader.ts";
import { vueLogger } from "../lib/vue_logger.ts";
import { writeBundle } from "../lib/write_bundle.ts";
import { Config, Vue } from "../dts/factory.d.ts";
import Component from "./Component.ts";
import Storage from "./Storage.ts";
import Queue from "./Queue.ts";
import { ssrTemplate } from "../cli/templates.ts";
import { serverTs } from "../cli/constants.ts";

/**
 * Factory class follows the Singelton design pattern
 * only one can be made for each application
 */
export default class Factory {
  public storage: Storage;
  public queue: Queue;
  public variable: string;
  private _config: Config;
  private _port!: number;
  private _reloadport!: number;
  private _title!: string;
  private _hostname!: string;
  private _server!: string;
  // added router
  private _router!: string;
  //private means only accessible within instance, static refers to this property is shared amongst all instances, instance is available to all instances of factory
  private static instance: Factory;
  private constructor(options?: Config) {
    this.storage = Storage.create();
    this.queue = new Queue();
    //this variable is only used in Vue3, to mount
    this.variable = `vno${Math.floor(Math.random() * 100 * 100 * 100)}`;
    // ?? definition: if "options" is null or undefined, assign this.config to an empty obj of type "Config"
    this._config = options ?? <Config> {};
  }

  /**
   * an instance is made through the `create` method
   * if an instance has already been made, it returns
   * the original instance
   */

  //all the above properties are saved onto the factory object.
  //create storage is looking for the vno config json and assigning properties
  public static create(options?: Config): Factory {
    if (!Factory.instance) {
      Factory.instance = new Factory(options);
    }

    return Factory.instance;
  }

  /**
   * assignConfig() runs type checks on the available config,
   * if it fails, it seeks out a vno.config.json to take its place
   * then assigns the data to the Factory's props
   */
  public async assignConfig(): Promise<void> {
    //line below returns a "vno.config" config file to this._config, throws err if no config file is found
    if (!checkOptions(this.config)) { //check if config obj is not null, & config.entry & config.root equal "string"
      this._config = await configReader() as Config;
    }
    // "config.options?.port" is an example of optional chaining with the safe navigation operator ".?"
    if (this.config.options?.port) {
      this._port = this.config.options.port;
    }
    if (this.config.options?.reloadPort) {
      this._reloadport = this.config.options.reloadPort;
    }
    if (this.config.options?.hostname) {
      this._hostname = this.config.options.hostname;
    }
    if (this.config.server) {
      //console.log("pre mutation .config server", this.config.server);
      this._server = this.config.server;
      //console.log("server post mutation", this._server);
    }
    // // added router to config - 9/21/21
    if (this.config.router) {
      this._router = this.config.router;
    }
    if (this.storage) {
      this.storage.config = this._config;
    }
  }
  /**
   * createStorage() collects all .vue files
   * transforms the file into a new Component object
   * then caches the component in Storage
   */
  private async createStorage(): Promise<void> {
    await this.assignConfig();
    //for await creates a loop iterating over async iterable objects including string, array, and array like objs
    for await (
      //iterates through entry looking for files with .vue extensions
      const file of fs.walk(`${this.config?.entry}`, { exts: ["vue"] })
    ) {
      const label = path.parse(file.path).name;
      //Component is assigned a "filename": `${this.label}.vue`
      const component = new Component(label, file.path);

      this.storage.cache(label, component);

      if (label === this.config?.root) {
        this.storage.root = component;
      }
    }
  }
  /**
   * parseApplication() initiates compilation
   * begins the Queue starting with the app Root
   */
  private async parseApplication(): Promise<void> {
    //isStorageReady is a typeguard.  Ensures storage object is not null as well as storage.root is a component
    isStorageReady(this.storage);
    //vuelogger returns a vue state object with a unique key stored at mount key
    this.storage.vue = vueLogger(
      this._config.vue as Vue.Version,
      this.storage.root,
      this.variable,
    );
    // console.log(this.storage.vue);
    //adds root
    this.queue.enqueue(this.storage.root);

    //stays looping until queue is empty - pops one off as current component, parses it. looks for children components
    while (!this.queue.isEmpty()) {
      const current = this.queue.dequeue() as Component;
      await current.parseComponent(this.storage, this.queue, this.variable);
    }
  }
  public writeCSS(): void {
    const decoder = new TextDecoder("utf-8");

    const styles = decoder.decode(
      Deno.readFileSync(Deno.cwd() + "/vno-build/style.css"),
    );

    Deno.writeTextFileSync(
      "vno-ssr/style.js",
      "const styles = " + `\`<style>${styles}</style>\`` +
        "\n export default styles",
      {
        append: true,
      },
    );
  }

  /**
   * build is the entry to initiating bundle
   */

  //entrance for user using this  assigned instance of factory.create and starts the compile process
  //which will create storage - add root to queue, add components to queue, calls parse on first in queue
  public async build(isDev?: boolean): Promise<Storage> {
    // When isDev is true, will insert live reloading client websocket script into build.js for frontend.
    // Only runDevServer uses this option, so that script should only get inserted during local testing.
    await this.createStorage();
    await this.parseApplication();
    writeBundle(this.storage, isDev);
    this.writeCSS();

    return this.storage as Storage;
  }

  /**
   * getters for Read Only props to catch for default values
   */
  get config() {
    return this._config;
  }

  get port() {
    if (this._port) return this._port;
    return 3000;
  }

  get reloadPort() {
    if (this._reloadport) return this._reloadport;
    return 8080;
  }

  get hostname() {
    if (this._hostname) return this._hostname;
    return "0.0.0.0";
  }

  get title() {
    if (this._title) return this._title;
    return "Your Project";
  }

  get server() {
    if (this._server) return this._server;
    return null;
  }

  // added router 9/21/21
  get router() {
    if (this._router) return this._router;
    return "^4.0.0-0";
  }
}
