import { Component, Config, Storage, Vue } from "../dts/factory.d.ts";

export function checkOptions(obj: unknown): obj is Config {
  //returns a boolean. checks...
  return obj != null &&

    typeof (obj as Config).entry === "string" &&
    typeof (obj as Config).root === "string";
}

export function checkVueVersion(obj: unknown,): obj is Config & { vue: Vue.Version } {
  return (obj as Config).vue != null &&  (obj as Config).vue === 2 || (obj as Config).vue === 3;
}


export function isStorageReady(obj: unknown): obj is Storage {
  if (
    obj != null &&
    (obj as Storage).root != null
  ) {
    return true;
  }
  throw new Error("failure to ready application");
}

export function hasValidInstance(
  obj: unknown,
): obj is Component & { instance: string } {
  if (
    obj != null &&
    typeof (obj as Component).parsed_data.instance === "string"
  ) {
    return true;
  }
  throw new TypeError("component is missing an instance property");
}
