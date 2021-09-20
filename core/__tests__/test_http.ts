import { Router, superoak } from "../utils/deps.ts";  //SUPEROAK is a library to test HTTP
// router is imported from oak
import { server } from "../cli/dev.ts";

const router = new Router(); //creates new Router

const hello = "Hello, Vno!";

router.get("/test", (ctx) => {  //ctx = object to hold response
  ctx.response.body = hello;
});

server.use(router.routes());
server.use(router.allowedMethods());

Deno.test({ //TESTS for successful GET req
  name: "server responds to GET request supported by the Oak framework",
  async fn() {
    const request = await superoak(server);
    await request.get("/test").expect(hello);
  },
});
