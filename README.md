# Vali

Vali is a quick, 0 dependency JSON schema validator. It's designed to be
lightning fast and let you make your schemas in a Typescript-familiar way.

```ts
import createValidator, { type ValiPart } from "@inbestigator/vali";

const userSchema: ValiPart = {
  id: "number",
  username: "string:3:32",
  email: "string",
  isVerified: "boolean?",
};

const isUser = createValidator(userSchema);

console.log(
  isUser({
    id: 1,
    username: "Alice",
    email: "alice@example.com",
    isVerified: true,
  }),
);
console.log(isUser({ id: 2, username: "Bob", email: "bob@example.com" }));
```

## Base types

```ts
"string"
"number"
"boolean"
[...]
{...}
```

## Arguments

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
