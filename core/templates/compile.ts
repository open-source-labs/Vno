import { fs, path } from "../utils/deps.ts";

const __dirname = new URL(".", import.meta.url).pathname;

export interface File {
  path: string;
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
  content: string;
}

const main = async (name: string) => {
  const root = path.join(__dirname, name) + "/";

  const files: File[] = [];
  for await (const file of fs.walk(root)) {
    if (file.isSymlink) {
      continue;
    }

    if (file.isDirectory) {
      files.push({
        ...file,
        path: file.path.replace(root, ""),
        content: "",
      });
      continue;
    }

    const content = await Deno.readTextFile(file.path);
    files.push({
      ...file,
      path: file.path.replace(root, ""),
      content,
    });
  }

  const script = `export const files = ${JSON.stringify(files)};`;

  await Deno.writeTextFile(path.join(__dirname, name + ".ts"), script);
};

if (import.meta.main) {
  if (Deno.args[0]) {
    main(Deno.args[0]);
  }
}
