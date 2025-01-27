# Vali

A swift, tiny JSON schema validator.

```ts
import createValidator, { type ValiPart } from "@inbestigator/vali";

const userSchema: ValiPart = {
  id: "number",
  username: "string:3:32",
  email: "string?",
};

const isUser = createValidator(userSchema);

console.log(isUser({ id: 1, username: "Alice", email: "alice@example.com" }));
console.log(isUser({ id: 2, username: "Bob" }));
```

## Base types

```ts
"string"
"number"
"boolean"
[...]
{...}
```

## Argument parts:

```ts
"string:minimum_length:maximum_length";
"number:minimum_value:maximum_value";
```

## Optionality

```ts
"?"; // Undefined only
"string?"; // String or undefined
"number?"; // Number or undefined
"boolean?"; // Boolean or undefined
```
