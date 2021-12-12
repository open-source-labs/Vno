import { opine, serveStatic } from "https://deno.land/x/opine@1.3.3/mod.ts";
import vueServerRenderer from "https://deno.land/x/vue_server_renderer@/mod.js";
import App from "../../vendor/component.js";
import { path } from "../utils/deps.ts";
import styles from "../../vno-build/style.js";

export const app = opine();
//const port = 6666;
export const runSSR = async function (port: number, hostname: string) {
  //RENDERS VUE COMPONENTS ONTO SERVER
  const __dirname = path.dirname(import.meta.url);

  app.use("/", (req, res, next) => {
    let rendered;
    vueServerRenderer(App, (err: any, res: any) => {
      console.log("result", res);
      console.log("error", err);
      //print(res);
      rendered = res;
    });

    const html = `<html>
         <head>
         
            ${styles}
           
         </head>
         <body>
           <div id="root">${rendered}</div>
         </body>
       </html>`;

    res.type("text/html").send(html);
  });

  //await app.listen({ port });
  // app.listen(port, () => listen(port, hostname));
  await app.listen({ port, hostname });

  //console.log(`React SSR App listening on port ${port}`);
  return app;
};
