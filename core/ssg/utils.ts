import { fs, path } from "../utils/deps.ts";
import { Language, minify } from "https://deno.land/x/minifier@v1.1.1/mod.ts";

export type Mapped<T> = { [key: string]: T };

/**
 * Individual path data exported from 'getStaticPaths'.
 */
export interface PathData {
  params: Mapped<string>;
}

/**
 * Passed to 'getStaticProps'.
 */
export interface GetStaticPropsContext {
  params: Mapped<string>;
  fetch: typeof fetch;
}

/**
 * Passed to 'getStaticPaths'
 */
export interface GetStaticPathsContext {
  fetch: typeof fetch;
}

/**
 * vno .vue file export.
 */
export interface VueExport {
  default: {
    name: string;
    getStaticProps?: (ctx: GetStaticPropsContext) => any;
    getStaticPaths?: (
      ctx: GetStaticPathsContext,
    ) => Promise<PathData[]> | PathData[];
    css?: string[];
    data?: () => any;
  };
}

/**
 * Get exports from a js script as a string.
 */
export const getExport = async (script: string) => {
  const tmpPath = path.join(Deno.cwd(), ".vno", "exports");
  await fs.ensureDir(tmpPath);

  const jsPath = path.join(
    tmpPath,
    `${Math.random().toString(36).substring(7)}.js`,
  );

  let obj: VueExport | null = null;
  let created = false;

  try {
    await Deno.writeTextFile(jsPath, minify(Language.JS, script));
    created = true;
    obj = (await import("file://" + jsPath)) as VueExport;
  } finally {
    if (created) await Deno.remove(jsPath);
  }

  if (!obj) throw Error("could not import script");
  return obj;
};

/**
 * Get the unique tags from html.
 */
export const getTags = (html: string) => {
  const matches = html.matchAll(/(?<=<)[\w\d]+(?=[\s*|>|/>])/gi);

  return new Set([...matches].map((match) => match[0]));
};

/**
 * Debounce a function.
 */
export const debounce = (func: (...args: any) => any, duration = 300) => {
  let id: any = null;

  return (...args: any) => {
    if (id) {
      clearTimeout(id);
    }

    id = setTimeout(() => {
      func(...args);
    }, duration);
  };
};
