import {
  Component,
  ComponentContainer,
  Config,
  Router,
  Vue,
} from "../dts/factory.d.ts";

/**
 * Storage class follows the Singelton design pattern
 * only one can be made for an application
 */
export default class Storage {
  private _root: Component;
  private _vue: Vue.State;
  public size: number;
  public app: ComponentContainer;
  // added 9/27
  private _router: Router.Version;
  private _config: Config;
  private static instance: Storage;
  private constructor() {
    this.app = <ComponentContainer> {};
    this._root = <Component> {};
    this._vue = <Vue.State> {};
    this.size = 0;
    // added 9/27
    this._router = <Router.Version> {};
    this._config = <Config> {};
  }

  /**
   * an instance is made through the `create` method
   * if an instance has already been made, it returns
   * the original instance
   */
  public static create() {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }

    return Storage.instance;
  }

  public cache(label: string, component: Component): Component {
    this.app[label] = component;
    this.size += 1;
    return component;
  }

  public get(label: string): Component | undefined {
    return this.app[label];
  }

  get root() {
    return this._root;
  }

  set root(component: Component) {
    this._root = component;
  }

  get vue() {
    return this._vue;
  }

  set vue(vue: Vue.State) {
    this._vue = vue;
  }

  // added 9/27
  get router() {
    return this._router;
  }

  set router(router: Router.Version) {
    this._router = router;
  }

  get config() {
    return this._config;
  }

  set config(config: Config) {
    this._config = config;
  }
}
