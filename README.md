<img src="./assets/vnologo.svg"
     alt="vno logo"
     style="float: left; margin-right: 10px;" />

<p align='right'> - Logo Design by <a href='https://www.behance.net/bmccabe'>Brendan McCabe</a></p>
<h1 align="center">
	<a href='https://www.vno.land'>vno</a> <br/>
	<img alt="twitter" src="https://img.shields.io/twitter/follow/vno_land?label=%40vno_land&logoColor=%2357d3af&style=social"></h1>
	<h4 align='center'> The first <a href='https://deno.land/x/vno'>build tool</a> for compiling and bundling <a href='https://github.com/vuejs'>Vue</a> components in a <a href='https://github.com/denoland'>Deno</a> runtime environment</h4>

<p align="center">
  <img alt="license" src="https://img.shields.io/github/license/oslabs-beta/vno?color=%2357d3af">
  <img alt="issues" src="https://img.shields.io/github/issues-raw/oslabs-beta/vno?color=yellow">
  <img alt="last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/vno?color=%2357d3af">
  <img alt="Repo stars" src="https://img.shields.io/github/stars/oslabs-beta/vno?logoColor=%2334495e&style=social">
</p>

## Features

- Parser
- Compiler
- Bundler
- Adapter

## Overview

- Vue is an approachable, incrementally adoptable JavaScript framework with an exciting ecosystem. Deno is a new runtime environment for JavaScript, built to address the shortcomings of node.js. We wanted to create a tool that let developers easily set up Vue applications in a Deno runtime environment. Meet vno!

## How to use vno

- You can use the vno Command Line Interface to quickly create a new Vue project in a Deno runtime
- OR you can use the vno build method to compile an existing Vue file structure
  into a Deno-legible .js file

### vno installation

- vno requires the use of Deno version 1.10 or above
- MacOS: 
  - Run the following command in your terminal to install vno on your machine.

```bash
deno install --allow-net --unstable https://deno.land/x/vno/install/vno.ts
```

- WSL/Linux: 
  - Open `/home/<USERNAME>/bashrc` with your editor of choice.
  - Add `export PATH="/home/<USERNAME>/.deno/bin:$PATH` to the end of the file.
  - Run the following command in your terminal to install vno on your machine.

```bash
sudo deno install --allow-net --unstable https://deno.land/x/vno/install/vno.ts
```

- Deno requires the `--allow-net` permission to run an installation
- This feature and many of the others used in vno are still considered
  "unstable" for Deno. Run the command with `--unstable` to allow these
  resources to execute.
- The force flag `-f` can be used if you want to overwrite an existing copy of
  the module
- You can name the module in your path with the name flag `-n` or `--name` ,
  'vno' is the default name.
- If you have not already added Deno bin into your path, you will need to do so.

  - MacOS: Copy the export path your terminal returns and paste it into your terminal
  - WSL/Linux: Replace `root` with your username and paste it into your terminal: 
      `export PATH="/home/<USERNAME>/.deno/bin:$PATH"`
  ![install gif](https://media.giphy.com/media/LVokebNuReGJuwU13R/giphy.gif)

### a quick word about permissions

- Deno is secure by default, which means that explicit permissions are required
  for certain tasks.
- You can avoid responding to the permissions requests by flagging the
  installation script.
- Most of our modules require both read and write permissions `--allow-read` &
  `--allow-write`
- If you decide not to flag permissions at installation, you will be prompted in
  the terminal after executing a command.
- If you would like to avoid writing out the permissions altogether, you
  can also use the `-A` or `--allow-all` tag

### vno config

- vno.config.json should be in the root of your project
- following is a description of the object interface:

```ts
interface Config {
    entry: string;
      //entry is the path to root component's directory : i.e. './client/'
    root: string;
      //root is the filename of your root component : i.e. 'App'
    vue?: 2 | 3;
      //vue is the number 2 or 3 : 2 = vue v2.6.12 (default); 3 = vue v3.0.5 
    options?: {
      port?: number;
        //preferred port for the dev server : defaults to `3000`
      title?: string;
        //title of your project
      hostname?: string;
        //preferred host : defaults to `0.0.0.0`
    };
  }
```

## CLI

### create a new project

- Project name will become the directory that holds your project (you must CD
  into project directory after running the `vno create` command).
- If the project name argument is omitted, then the project will be created in the current working directory.
- Using `vno create` will give an option to build out a universal or single page application. Choosing 'SPA' will give you the option of choosing to add Vue Router, as well as choosing between Vue 2 or Vue 3 syntax.

```bash
vno create [project name]
```

![](https://i.ibb.co/Fw5Sp7n/vno-create.gif)

- _OR_ If you'd rather not install:

```bash
deno run --allow-read --allow-write --allow-net --unstable https://deno.land/x/vno/install/vno.ts create [project name]
```

### run a build on a project

- To invoke the build method and dynamically create bundled js and css files for
  your application, type the following into the terminal:

```bash
vno build
```

_OR_

```bash
deno run --allow-read --allow-write --allow-net --unstable https://deno.land/x/vno/install/vno.ts build
```

![vno build](https://i.ibb.co/jgRFXvc/vno-build.gif)

**Scoped styling for CSS is currently not supported, but will be added to future builds**

### run a build on a project AND create a server configured for SSR

- To invoke the build method and dynamically create bundled JS and CSS files, along with a server.ts for server side rendering your application, type the following into the terminal:

```bash
vno build --ssr
```
_OR_

```bash
deno run --allow-read --allow-write --allow-net --unstable https://deno.land/x/vno/install/vno.ts build --ssr
```

![vno build ssr](https://i.ibb.co/dfPZTH6/vno-build-ssr.gif)

### run dev server includes live reload

- Running the dev server dynamically runs a new build and runs the application
  on a module hosted server.
- Native `vno run dev` command automatically enables live reload. Using Live Reload injects a WebSocket connection to build.js. Remove it with: `vno run build`
- Invoke the dev server using the following commands:

```bash
vno run dev
```

_OR_

```bash
deno run --allow-read --allow-write --allow-net --unstable https://deno.land/x/vno/install/vno.ts run dev
```

![vno run dev & live reload](https://i.ibb.co/c15qK5J/final-live-gif.gif)



# vno as an API

### initializing your application with the api

- You can import vno into your application with the following URL :
  `https://deno.land/x/vno/dist/mod.ts` With a vno.config.json, no argument is
  needed The API will search for the config and apply it to your application

```ts
import { Factory } from 'https://deno.land/x/vno/dist/mod.ts';

const vno = new Factory();
await vno.build();
```

- Without a vno.config.json, you can input the object directly into the Factory
  instance

```ts
import { Factory } from 'https://deno.land/x/vno/dist/mod.ts';

const vno = Factory.create({
  root: "App",
  entry: "./"
  vue: 3,
  options: {
    port: 3000
  }
})

await vno.build();
```

`vno.build()` will run a build on the entire application and compile it to a
"vno-build" directory as one JavaScript file and one CSS file.

### accessing component object storage

- After running the build, parsed components are accessible inside the storage
  property on the Factory class.

```ts
vno.storage.get('App');
```

The argument accepted by the get method for storage is the component filename
