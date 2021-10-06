import { exec } from "../utils/deps.ts";
import { event } from "../utils/events.ts";
import Factory from "../factory/Factory.ts";

const vno = Factory.create();

async function watchChanges(
  path: string,
  onChange: () => void, //typescript for callback that doesnt return anything
) {
  const watcher = Deno.watchFs(path);
  //watches a path which (currently not given specific path)
  for await (const event of watcher) {
    if (/modify|create/.test(event.kind)) {
      await onChange();
      return;
    }
    return;
  }
}

//live reloading watching all files components for changes and will automatically run exec() code once there are changes
interface watchOptions { //interface is a TS thing where it sets requirement
  ssr?: boolean;
}


async function watchAndRebuild(options: watchOptions) {
  const ssrFlag = options?.ssr ? " --ssr" : "";
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
    watchAndRebuild(options);
  });
}

export { watchAndRebuild };
