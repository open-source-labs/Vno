// deno testing library
export { //export bench and runBenchmarks from deno URL
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.117.0/testing/bench.ts";
export {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts"; // testing library

// deno standard
export * as fs from "https://deno.land/std@0.117.0/fs/mod.ts";
export * as path from "https://deno.land/std@0.117.0/path/mod.ts";
