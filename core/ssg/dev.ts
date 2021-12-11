import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { Application, send } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { EventEmitter } from "https://deno.land/std@0.117.0/node/events.ts";
import * as path from "https://deno.land/std@0.117.0/path/mod.ts";
import { debounce } from "./utils.ts";
import { generate } from "./generate.ts";

const emitter = new EventEmitter();

const startReloadServer = (port: number) => {
  const wss = new WebSocketServer(port);
  wss.on("connection", (ws: WebSocketClient) => {
    const reloadListener = () => ws.send("reload");

    emitter.addListener("fileChange", reloadListener);

    ws.on("close", () => {
      emitter.removeListener("fileChange", reloadListener);
    });
  });
  console.log("reload enabled");
};

const startServer = async (port: number) => {
  const app = new Application();

  app.use(async (context: any) => {
    await send(context, context.request.url.pathname, {
      root: path.join(Deno.cwd(), ".vno", "dist"),
      index: "index.html",
    });
  });

  console.log(`server started on port ${port}`);
  await app.listen({ port });
};

// const watchBuild = async () => {
//   const watcher = Deno.watchFs(path.join(Deno.cwd(), ".vno", "dist"));

//   const onFileChange = debounce(() => {
//     emitter.emit("fileChange");
//   });

//   for await (const event of watcher) {
//     if (/modify|create/.test(event.kind)) {
//       // onFileChange(event);
//     }
//   }
// };

const watchSource = async (reloadPort: number) => {
  const watcher = Deno.watchFs(
    ["assets", "components", "pages", "public"].map((name) =>
      path.join(Deno.cwd(), name)
    ),
  );

  const onFileChange = debounce(async () => {
    try {
      await generate("development", reloadPort);
      emitter.emit("fileChange");
    } catch (err) {
      console.log(err);
    }
  });

  for await (const event of watcher) {
    if (/modify/.test(event.kind)) {
      onFileChange();
    }
  }
};

interface VnoConfig {
  default: {
    port?: number;
    reloadPort?: number;
  };
}

const getConfig = (): Promise<VnoConfig> => {
  return import("file://" + path.join(Deno.cwd(), "vno.config.js"));
};

export const startDev = async () => {
  let {
    default: { port, reloadPort },
  } = await getConfig();
  if (!port) port = 3000;
  if (!reloadPort) reloadPort = 8080;

  try {
    await generate("development", reloadPort);
  } catch (err) {
    console.log(err);
  }
  startServer(port);
  startReloadServer(reloadPort);
  watchSource(reloadPort);
  // watchBuild();
};

if (import.meta.main) {
  startDev();
}
