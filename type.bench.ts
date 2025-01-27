import createValidator from "./mod.ts";

const stringCheck = createValidator("string");
const numberCheck = createValidator("number");
const booleanCheck = createValidator("boolean");
const objectCheck = createValidator({
  string: "string",
  number: "number",
});
const arrayCheck = createValidator(["string", "number"]);

Deno.bench("Strings", () => {
  stringCheck("Str");
});

Deno.bench("Numbers", () => {
  numberCheck(1);
});

Deno.bench("Booleans", () => {
  booleanCheck(true);
});

Deno.bench("Objects (string: string, number: number)", () => {
  objectCheck({ string: "Str", number: 1 });
});

Deno.bench("Arrays (string, number)", () => {
  arrayCheck(["Str1", 1]);
});
