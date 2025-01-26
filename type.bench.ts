import { createValidator } from "./if.ts";

const stringCheck = createValidator("string");
const numberCheck = createValidator("number");
const booleanCheck = createValidator("boolean");
const objectCheck = createValidator({
  name: "string",
  age: "number",
});
const arrayCheck = createValidator(["string"]);

Deno.bench("Strings", () => {
  stringCheck("Str");
});

Deno.bench("Numbers", () => {
  numberCheck(1);
});

Deno.bench("Booleans", () => {
  booleanCheck(true);
});

Deno.bench("Objects (name: string, age: number)", () => {
  objectCheck({ name: "Str", age: 1 });
});

Deno.bench("Arrays (string, number)", () => {
  arrayCheck(["Str1", "Str2"]);
});
