import { assertEquals } from "./test_deps.ts";
import { patterns } from "../utils/constants.ts";
import { indexOfRegExp, sliceAndTrim } from "../utils/utils.ts";

// testing accuracy for utility functions
Deno.test({
  name: "\n\ntesting accuracy for indexOfRegExp\n",
  fn(): void {
    const arr = ["aaa", "bbb", "ccc", "ddd", "eee"];

    const aaaIdx = indexOfRegExp(/(a{3})/i, arr);
    assertEquals(aaaIdx, 0);

    const eeeIdx = indexOfRegExp(/(e{3})/i, arr);
    assertEquals(eeeIdx, 4);
  },
});

Deno.test({
  name: "\n\ntesting accuracy for sliceAndTrim\n",
  fn(): void {
    const arr = [
      "a   a   a",
      "b   b   b",
      "c   c   c",
      "d   d   d",
      "e   e   e",
    ];

    const str1 = sliceAndTrim(arr, 1, 4);
    assertEquals(typeof str1 === "string", true);
    assertEquals((str1 as string).match(patterns.whitespace), null);
  },
});
