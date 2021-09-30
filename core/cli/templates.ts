import { CreateInputs } from "../dts/factory.d.ts";
import { _ } from "../utils/deps.ts";

// template literal strings for HTML/Components/Server/Deps
export const childComponent = (componentsName: string) => {
  return (
    `<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      <br />
    </p>
    <h3>
      <a href="https://vno.land" target="_blank" rel="noopener">vno.land</a> &
      <a
        href="https://github.com/oslabs-beta/vno"
        target="_blank"
        rel="noopener">
        github
      </a>
    </h3>
    <ul>
      <br />
    </ul>
  </div>
</template>

<script>
export default {
  name: '${_.kebabCase(componentsName)}',
  props: {
    msg: String,
  },
};
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
  a {
  color: #79d0b2;
}
</style>`
  );
};

export const rootComponent = (options: CreateInputs) => {
  return (
    `<template>
  <div id="${options.root.toLowerCase()}">
    <img
      src="https://user-images.githubusercontent.com/63819200/128429048-5927eb19-b151-4855-93e3-2e0755c447a2.png"
      alt="image"
      border="0"
      width="450"
      height="auto"
    />
    <${
      options.components[0]
    } msg="you are building: ${options.title} with vno" />
  </div>
</template>

<script>
import ${options.components[0]} from './components/${
      options.components[0]
    }.vue';

export default {
  name: '${_.kebabCase(options.root)}',
  components: {${options.components[0]}},
};

</script>

<style>
html {
  background-color: #203A42;
}
#${options.root.toLowerCase()} {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #79d0b2;
  margin-top: 60px;
}
</style>`
  );
};

export const genericComponent = () => {
  return `
<template>

</template>

<script>
  export default {
    name:
  };
</script>

<style>

</style>`;
};

export const htmlTemplate = (options: CreateInputs) => {
  return (
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="stylesheet" href="./style.css" />
    <title>${options.title}</title>

  </head>
  <body>
    <div id="${_.kebabCase(options.root)}">
      <!-- built files will be auto injected -->
    </div>
    <script type="module" src="./build.js"></script>
  </body>
</html>
`
  );
};

export const vnoConfig = (options: CreateInputs) => {
  const { root, port, title, vue } = options;
  return JSON.stringify(
    { root, entry: "./", vue, options: { port, title } },
    null,
    2,
  );
};

export const ssrTemplate =
  `import { opine, serveStatic } from "https://deno.land/x/opine@1.3.3/mod.ts";
import  vueServerRenderer from 'https://deno.land/x/vue_server_renderer@/mod.js';

import App from './vno-ssr/build.js';
import { join, dirname} from "https://deno.land/std@0.63.0/path/mod.ts";
import  styles  from './vno-ssr/style.js'

const port = 3000
const app = opine();
app.use(serveStatic('vno-build'));
const __dirname = dirname(import.meta.url);

app.use("/", (req, res, next) => {

      let rendered;
      vueServerRenderer(App, (err:any, res:any) => {
        rendered = res;
      });

      const html =
      \`<html>
         <head>

            \${styles}

         </head>
         <body>
           <div id="root">\${rendered}</div>
           <script type="module" src="./build.js"></script>
         </body>
       </html>\`;

    res.type("text/html").send(html);
  });

app.listen({ port });

console.log(\`Vue SSR App listening on port \${port}\`);

` as string;

// template for router/index.js
// also need to add router to 
export const vue3RouterTemplate = (options: CreateInputs) => {
  
  let routes = '[';
  let importRoutes = '';
  for (let i = 0; i < options.components.length; i++) {
    // import statements
    importRoutes += `import ${options.components[i]} from '../components/${options.components[i]}.vue';\n`;
    let routeObj = `{
      path: '/${options.components[i].toLowerCase()}',
      name: '${options.components[i]}',
      component: ${options.components[i]}
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/${options.components[i]}.vue')
    },`
    routes += routeObj;
  }
  routes += ']';

  // vue router 4 -> vue 3
  // vue router 3 -> vue 2
  return(
    // vue router 4 syntax
    `import VueRouter from 'https://unpkg.com/vue-router@4.0.5/dist/vue-router.global.js'
  ${importRoutes}
    const routes = ${routes};

    const router = VueRouter.createRouter({
      // ask if user wants to "Use history mode for router? (Requires proper server setup for index fallback in production)"
      // https://next.router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations

      // history: createWebHistory(),
      routes
    });

    export default router;
    `
  )
}

export const vue2RouterTemplate = (options: CreateInputs) => {
  let routes = '[';
  let importRoutes = '';
  for (let i = 0; i < options.components.length; i++) {
    // import statements
    importRoutes += `import ${options.components[i]} from '../components/${options.components[i]}.vue';\n`;
    let routeObj = `{
      path: '/${options.components[i].toLowerCase()}',
      name: '${options.components[i]}',
      component: ${options.components[i]}
    },`
    routes += routeObj;
  }
  routes += ']';

  return (
    `import VueRouter from 'https://unpkg.com/vue-router@3.5.2/dist/vue-router.js';
  ${importRoutes}

    const routes = ${routes};

    const router = new VueRouter({
      routes
    });

    export default router;
    `
  )
}