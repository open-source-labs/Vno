// deno std library
export * as fs from "https://deno.land/std@0.123.0/fs/mod.ts";
export * as path from "https://deno.land/std@0.123.0/path/mod.ts";
export * as colors from "https://deno.land/std@0.123.0/fmt/colors.ts";
export * as http from "https://deno.land/std@0.123.0/http/mod.ts";
export { v4 } from "https://deno.land/std@0.123.0/uuid/mod.ts"; //uuid generator
export {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.83.0/testing/asserts.ts"; // testing library
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.1/mod.ts";
export { WebSocketServer };
export type { WebSocketClient };

// oak
export {
  Application,
  Context,
  Router,
  send,
} from "https://deno.land/x/oak@v6.5.0/mod.ts";
export { superoak } from "https://deno.land/x/superoak@4.0.0/mod.ts"; // testing lib for oak

// third-party
import _ from "https://cdn.skypack.dev/lodash"; // lodash
import ProgressBar from "https://deno.land/x/progress@v1.2.3/mod.ts";
import { exec } from "https://deno.land/x/exec/mod.ts";
export { _, exec, ProgressBar };

// compilers
export { compile as scssCompiler } from "https://raw.githubusercontent.com/crewdevio/deno_sass2/master/mod.ts";
export * as sfcCompiler from "https://denopkg.com/crewdevio/vue-deno-compiler/mod.ts";

//event emitter for live reload
import { EventEmitter } from "https://deno.land/std@0.93.0/node/events.ts";
export { EventEmitter };
