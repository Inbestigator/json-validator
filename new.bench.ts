import { build, t } from "stnl";
import createValidator from "./mod.ts";

function check(validate: (v: unknown) => boolean) {
  const isGood = validate({
    number: 42.5,
    negNumber: -13.7,
    maxNumber: Number.MAX_VALUE,
    string: "Hello",
    longString: "This is a much longer string to demonstrate string validation.",
    boolean: true,
    deeplyNested: {
      foo: "bar",
      num: 3.14,
      bool: false,
    },
    items: [1.1, 2.2, 3.3, 4.4, 5.5],
  });

  const isBad = validate({
    number: "not a number",
    maxNumber: Infinity,
    string: 12345,
    longString: "",
    boolean: "true",
    deeplyNested: {
      foo: 99,
      bool: "false",
    },
    items: ["1", "2", "3"],
  });

  if (!isGood || isBad) {
    throw new Error("Bad validation");
  }
}

Deno.bench("Stnl - Stnl's benchmark", () => {
  const validate = build.json.assert.compile(
    t.dict({
      number: t.float,
      negNumber: t.float,
      maxNumber: t.float,
      string: t.string,
      longString: t.string,
      boolean: t.bool,
      deeplyNested: t.dict({
        foo: t.string,
        num: t.float,
        bool: t.bool,
      }),
      items: t.list(t.float),
    })
  );

  check(validate);
});

Deno.bench("Vali - Stnl's benchmark", () => {
  const validate = createValidator({
    number: "number",
    negNumber: "number",
    maxNumber: "number",
    string: "string",
    longString: "string",
    boolean: "boolean",
    deeplyNested: {
      foo: "string",
      num: "number",
      bool: "boolean",
    },
    items: ["number"],
  });

  check(validate);
});
