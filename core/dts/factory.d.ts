import Factory from "../factory/Factory.ts";
import Component from "../factory/Component.ts";
import DepsList from "../factory/DepsList.ts";
import Queue from "../factory/Queue.ts";
import Storage from "../factory/Storage.ts";

export { Component, DepsList, Factory, Queue, Storage };
export interface CreateInputs {
  /**
   * requested inputs for `vno create` command
   * options to further customize vno
   */
  title: string;
  /**
   * project title
   */
  root: string;
  /**
   * label of root component
   */
  components: string[];
  /**
   * child components to generate
   */
  port: number;
  /**
   * preferred port for dev server
   * default: 3000
   */
  vue: number;
  /**
   *  preferred Vue version
   *  default: 2
   */
}

// Factory library
export interface Config {
  /**
   * Config interface defines the properties for vno.config.json
   * or the options argument provided to Factory.create()
   */
  entry: string;
  /**
   * entry defines the path from vno.config.json
   * to the application's Root component
   * (i.e. "./client")
   */
  root: string;
  /**
   * root defines the name of the application's root component file
   * (i.e.'App' for App.vue)
   */
  vue?: Vue.Version;
  /**
   * The number provided for the preferred version of Vue
   */
  server?: string;
  /**
   * path to application server to for running vno run server
   */
  options?: {
    /**
     * options to further customize vno
     */
    port?: number;
    /**
     * preferred port for dev server
     * default: 3000
     */
    title?: string;
    /**
     * title of your project
     */
    hostname?: string;
    /**
     * preferred host
     * default: "0.0.0.0"
     */
  };
}
export declare namespace Vue {
  export type Version = 2 | 3;
  /**
   * number 2 represents Vue version "2.6.12"
   * number 3 represents Vue version "3.0.5"
   */
  export interface State {
    state: Version;
    /**
     * state property defines the Vue version
     */
    dep: string;
    /**
     * syntax for import from CDN
     */
    cdn: string;
    /**
     * provided CDN for vue dependency
     */
    mount: string;
    /**
     * syntax for mounting App
     */
  }
}

// component library
export type ComponentList = Component[];
/**
 * an ordered list of Component's
 */
export interface ComponentContainer {
  /**
   * an unordered container for Component's
   */
  [key: string]: Component;
}
export declare namespace Raw {
  /**
   * Raw data saved onto the Component Class
   */
  export interface Source {
    /**
     * provided on Component.__source__ protected instance prop
     */
    descriptor: Descriptor;
    /**
     * compiled data is saved on descriptor prop
     */
    errors: [];
    /**
     * in the event of errors, they are stored here
     */
  }

  export interface Descriptor {
    filename: string;
    source: string;
    template: Tag;
    script: Tag;
    /**
     * below props are not used
     */
    scriptSetup: unknown;
    styles: Tag[];
    customBlocks: [];
    cssVars: [];
  }

  export interface Tag {
    /**
     * compiled data for Template, Script, Style
     */
    type: string;
    content: string;
    /**
     * file content saved as string
     */
    loc: {
      source: string;
      start: Record<string, unknown>;
      end: Record<string, unknown>;
    };
    lang?: string;
    /**
     * allows us to identify characteristics i.e. SCSS or TypeScript
     */
    ast?: Record<string, unknown>;
    attrs?: {
      load: unknown;
    };
    scoped?: boolean;
    /**
     * refers to styling
     */
  }

  export interface Data {
    template: Tag;
    styles: Tag[];
    script: Tag;
  }
}

export interface Parser {
  (src: Component, storage?: Storage, queue?: Queue): void;
}

export declare namespace Resolve {
  /**
   * lib resolver functions, allow to properly parse content
   */
  export interface Attrs {
    (
      curr: Component,
      ref: string | string[],
      storage?: Storage,
      queue?: Queue,
    ): Promise<string> | void;
  }

  export interface Source {
    (
      src: string | string[],
      path: string,
      ref: string | boolean,
    ): Promise<string>;
  }
}
