import * as vm from "node:vm";
import { expect, test } from 'vitest'

import mixnames from "../src/index";

test("keeps object keys with truthy values", () => {
  expect(mixnames({
    a: true,
    b: false,
    c: 0,
    d: null,
    e: undefined,
    f: 1,
  })).toBe("a f");
});

test("joins arrays of class names and ignore falsy values", () => {
  expect(mixnames("a", 0, null, undefined, true, 1, "b")).toBe("a 1 b");
});

test("supports heterogenous arguments", function () {
  expect(mixnames({ a: true }, "b", 0)).toBe("a b");
});

test("should be trimmed", function () {
  expect(mixnames("", "b", {}, "")).toBe("b");
});

test("returns an empty string for an empty configuration", function () {
  expect(mixnames({})).toBe("");
});

test("supports an array of class names", function () {
  expect(mixnames(["a", "b"])).toBe("a b");
});

test("joins array arguments with string arguments", function () {
  expect(mixnames(["a", "b"], "c")).toBe("a b c");
  expect(mixnames("c", ["a", "b"])).toBe("c a b");
});

test("handles multiple array arguments", function () {
  expect(mixnames(["a", "b"], ["c", "d"])).toBe("a b c d");
});

test("handles arrays that include falsy and true values", function () {
  expect(mixnames(["a", 0, null, undefined, false, true, "b"])).toBe("a b");
});

test("handles arrays that include arrays", function () {
  expect(mixnames(["a", ["b", "c"]])).toBe("a b c");
});

test("handles arrays that include objects", function () {
  expect(mixnames(["a", { b: true, c: false }])).toBe("a b");
});

test("handles deep array recursion", function () {
  expect(mixnames(["a", ["b", ["c", { d: true }]]])).toBe("a b c d");
});

test("handles arrays that are empty", function () {
  expect(mixnames("a", [])).toBe("a");
});

test("handles nested arrays that have empty nested arrays", function () {
  expect(mixnames("a", [[]])).toBe("a");
});

test("handles all types of truthy and falsy property values as expected", function () {
  expect(mixnames({
    // falsy:
    null: null,
    emptyString: "",
    noNumber: NaN,
    zero: 0,
    negativeZero: -0,
    false: false,
    undefined: undefined,

    // truthy (literally anything else):
    nonEmptyString: "foobar",
    whitespace: " ",
    function: Object.prototype.toString,
    emptyObject: {},
    nonEmptyObject: { a: 1, b: 2 },
    emptyList: [],
    nonEmptyList: [1, 2, 3],
    greaterZero: 1,
  })).toBe(
    "nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero",
  );
});

test("handles toString() method defined on object", function () {
  expect(mixnames({
    toString: function () {
      return "classFromMethod";
    },
  })).toBe("classFromMethod");
});

test("handles toString() method defined inherited in object", function () {
  class Class1 {
    toString() {
      return "classFromMethod";
    }
  }
  class Class2 extends Class1 { }

  expect(mixnames(new Class2())).toBe("classFromMethod");
});

test("handles objects in a VM", function () {
  const context = { mixnames, output: undefined };
  vm.createContext(context);
  const code = "output = mixnames({ a: true, b: true });";
  vm.runInContext(code, context);

  expect(context.output).toBe("a b");
});
