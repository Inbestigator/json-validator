import createValidator from "./mod.ts";

Deno.bench("Strings", () => {
  const stringCheck = createValidator("string");
  stringCheck("Str");
});

Deno.bench("Numbers", () => {
  const numberCheck = createValidator("number");
  numberCheck(1);
});

Deno.bench("Booleans", () => {
  const booleanCheck = createValidator("boolean");
  booleanCheck(true);
});

Deno.bench("Objects (string: string, number: number)", () => {
  const objectCheck = createValidator({
    string: "string",
    number: "number",
  });
  objectCheck({ string: "Str", number: 1 });
});

Deno.bench("Arrays (string, number)", () => {
  const arrayCheck = createValidator(["string", "number"]);
  arrayCheck(["Str1", 1]);
});
