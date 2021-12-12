import { fs, path } from "../utils/deps.ts";
import { File } from "./compile.ts";
import { files } from "./universal.ts";

export const writeTemplate = async (files: File[], root: string) => {
  for (const file of files) {
    if (file.isSymlink) {
      continue;
    }

    if (file.isDirectory) {
      await fs.ensureDir(path.join(root, file.path));
    } else {
      await Deno.writeTextFile(path.join(root, file.path), file.content);
    }
  }
};

if (import.meta.main) {
  const root = path.join(Deno.cwd(), ".example", "template");
  await fs.ensureDir(root);
  await writeTemplate(files, root);
}
