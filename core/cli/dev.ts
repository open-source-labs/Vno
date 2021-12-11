import { Application, path, send } from "../utils/deps.ts";
import { WebSocketClient, WebSocketServer } from "../utils/deps.ts";
import * as print from "./stdout.ts";
import { watchAndRebuild } from "./liveRebuild.ts";
import { event } from "../utils/events.ts";

export const server: Application = new Application();

export const runDevServer = async function (port: number, hostname: string) {
  const wss = new WebSocketServer(8080);
  wss.on("connection", function (ws: WebSocketClient) {
    ws.send("[LiveReload is watching...");
    // create event listener that listens for "buildDone" event
    const reloadWindow = () => {
      console.log("[back to you Client!]");
      ws.send("reload window");
      event.removeListener("buildDone", reloadWindow);
    };

    event.on("buildDone", reloadWindow);

    ws.on("message", function (message: string) {
      console.log(message);
    });
  });

  //server route handler
  server.use(async (ctx, next) => {
    const { pathname } = ctx.request.url;

    if (pathname === "/") {
      await send(ctx, pathname, {
        root: path.join(Deno.cwd(), "public"),
        index: "index.html",
      });
    } else if (pathname === "/build.js") {
      ctx.response.type = "application/javascript";
      await send(ctx, pathname, {
        root: path.join(Deno.cwd(), "vno-build"),
        index: "build.js",
      });
    } else if (pathname === "/style.css") {
      ctx.response.type = "text/css";
      await send(ctx, pathname, {
        root: path.join(Deno.cwd(), "vno-build"),
        index: "style.css",
      });
    } else await next();
  });

  // server error handling
  server.addEventListener("error", (e: unknown) => console.error(e));
  // listen for active server
  // Ensure watchAndRebuild does not get called incessantly on more requests to server.
  let running = false;
  server.addEventListener("listen", () => {
    print.LISTEN(port, hostname);
    if (running === false) {
      watchAndRebuild({ ssr: false });
      running = true;
    }
  });
  await server.listen({ port, hostname });

  return server;
};
