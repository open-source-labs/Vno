import {  //import bench and runBenchmarks from deno URL
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.83.0/testing/bench.ts";

import Factory from "../factory/Factory.ts";

//***MEASURES HOW LONG BUILD METHOD TAKES TO COMPLETE***//
bench({ //bench registers the code below to the benchmark
  name: "complete vno runtime benchmark", //name of benchmark test
  runs: 1, //runs one time
  func(x: { start: () => void; stop: () => void }): void {  //start and stop function that takes no args and doesn't return anything
    x.start();
    const vnoTest = Factory.create(); //TS class to build VNO app. Factory.create() creates everything 
    vnoTest.build(); //runs build on everything from ^^
    x.stop(); //stops funcX.
  },
});

const res = await runBenchmarks(); //runBenchmarks  executes the code in bench()
console.log(res);

/*

// benchmark tests { Feb25, 2021 } with Vno v1.1.1

const results = [ // ms
  1.1306320000003325,
  1.0482279999996535,
  0.9737719999993715,
  1.1142459999991843,
  1.3043730000008509,
  1.0332610000004934,
  3.4674230000000534,
  1.0084569999999076,
  1.0324909999999363,
  1.1479699999999866,
];

// average runtime: 1.326085299999977 ms


*/
