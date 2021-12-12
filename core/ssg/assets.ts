import { fs, path } from "../utils/deps.ts";
import { Mapped } from "./utils.ts";

/**
 * Read assets as strings.
 */
export const getAssets = async (match?: RegExp[]) => {
  const assets: Mapped<string> = {};

  for await (
    const file of fs.walk(path.join(Deno.cwd(), "assets"), {
      includeDirs: false,
      match,
    })
  ) {
    assets[file.path] = await Deno.readTextFile(file.path);
  }

  return assets;
};
