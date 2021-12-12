import { exec } from "../utils/deps.ts";
import { event } from "../utils/events.ts";
import Factory from "../factory/Factory.ts";

const vno = Factory.create();

async function watchChanges(
  path: string,
  onChange: () => void, //typescript for callback that doesnt return anything
  config = { interval: 500 },
) {
  const watcher = Deno.watchFs(path);
  let reloading = false;
  //watches a path which (currently not given specific path)
  for await (const event of watcher) {
    if (/modify|create/.test(event.kind) && !reloading) {
      reloading = true;
      onChange();
      setTimeout(() => (reloading = false), config.interval);
    }
  }
}

//live reloading watching all files components for changes and will automatically run exec() code once there are changes
interface watchOptions { //interface is a TS thing where it sets requirement
  ssr?: boolean;
  interval?: number;
}

async function watchAndRebuild(options: watchOptions) {
  const ssrFlag = options?.ssr ? " --ssr" : "";
  const interval = options?.interval ? options.interval : 500;
  console.log("Watching for changes.");
  await watchChanges(".", async () => {
    console.log("File change detected.");
    // await exec(
    //   `deno run --allow-read --allow-write --allow-net --unstable https://raw.githubusercontent.com/oslabs-beta/vno/reloading/install/vno.ts build${ssrFlag}`,
    // );
    // May not need the above exec function any longer, but keeping it around as a reminder that rebuilding SSR may still
    // be needed.
    await vno.build(true);

    // emit event called "buildDone" AFTER this build process finishes
    event.emit("buildDone");
    // this is all part of microtask queue. which means this will be pushed onto callstack after.
    // if we had await in front of it then: this callback should not be garbage collected until
    // its all resolved. but because its recursive then will always stay in microtask queue, since the
    // function calls itself again. in this case, since we do NOT have an await keyword,
    // it doesn't matter here because nothing else after line 33 suspends the callback until this resumes
    //watchAndRebuild(options);
  }, { interval: interval });
}

export { watchAndRebuild };
