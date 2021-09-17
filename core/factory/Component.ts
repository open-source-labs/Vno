import DepsList from "./DepsList.ts";
import Storage from "./Storage.ts";
import Queue from "./Queue.ts";
import Base from "./Base.ts";

import * as utils from "../utils/utils.ts";
import * as parse from "../lib/parser.ts";

import { javascriptCompile } from "../lib/js_compile.ts";
import { ComponentType } from "../utils/constants.ts";
import { showCodeFrame } from "../lib/code_frame.ts";
import { _, colors } from "../utils/deps.ts";

// constructor function for creating a Component
  // uses the Base class

export default class Component extends Base {
  private _type: ComponentType;
  public sibling: Component | null;
  public name: string;
  public dependants: DepsList | null;
  public is_parsed: boolean;

  constructor(public label: string, public path: string) {
    super(label, path);
    this._type = ComponentType.Primitive;
    this.name = this.setComponentName();
    this.dependants = null;
    this.sibling = null;
    this.is_parsed = false;
  }

  get type() {
    return this._type;
  }

  set type(input: ComponentType) {
    switch (input) {
      case ComponentType.Composite:
        this._type = ComponentType.Composite;
        break;
      case ComponentType.Primitive:
        this._type = ComponentType.Primitive;
        break;
      default:
        this._type = ComponentType.Primitive;
    }
  }

  public isComposite(): void {
    this.dependants = new DepsList();
    this.type = ComponentType.Composite;
  }

  private setComponentName() {
    const data = this.script_data.content.split("\n");
    const index = utils.indexOfRegExp(/^\s*(name\s*:)/, data);

    if (index < 0) return _.kebabCase(this.label);
    return data[index].split(/[`'"]/)[1];
  }


  //
  public async parseComponent(
    storage: Storage,
    queue: Queue,
    variable: string,
  ): Promise<void> {
    console.log(
      colors
        .green(`[vno: compiling] => ${colors.yellow(this.path)}`),
    );

    if (this._source.errors.length) {
      showCodeFrame(this._source.descriptor, this._source.errors);
    } else {
      //"this"refers to parseComponent
      await parse.script(this, storage, queue);
      parse.template(this as Component);
      parse.style(this);
      javascriptCompile(this, storage, variable);
      this.is_parsed = true;
    }
  }
}
