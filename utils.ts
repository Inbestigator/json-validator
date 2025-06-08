export type BaseTypes = "string" | "number" | "boolean";
export type OptionalTypes = `${BaseTypes}?` | "?";
export type ArgTypes =
  | `${"string" | "string?"}:${number | "?"}:${number | "?"}`
  | `${"number" | "number?"}:${number | "?"}:${number | "?"}`;

export type ValiPart =
  | (BaseTypes | OptionalTypes | ArgTypes)
  | { [key: string]: ValiPart }
  | ValiPart[];

type ArgBase<T extends string> = T extends `string${infer Opt}`
  ? Opt extends "?"
    ? string | undefined
    : string
  : T extends `number${infer Opt}`
  ? Opt extends "?"
    ? number | undefined
    : number
  : never;

type InferArg<T extends ArgTypes> = T extends `${infer Base}:${string}:${string}`
  ? ArgBase<Base>
  : never;

type InferPrimitive<T extends string> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "string?"
  ? string | undefined
  : T extends "number?"
  ? number | undefined
  : T extends "boolean?"
  ? boolean | undefined
  : T extends "?"
  ? unknown
  : T extends ArgTypes
  ? InferArg<T>
  : never;

export type Infer<T extends ValiPart> = T extends BaseTypes | OptionalTypes | ArgTypes
  ? InferPrimitive<T>
  : T extends ValiPart[]
  ? Infer<T[number]>[]
  : // deno-lint-ignore no-explicit-any
  T extends { [key: string]: any }
  ? { [K in keyof T]: Infer<T[K]> }
  : never;

export type Obj = { isOptional?: boolean } & (
  | { type: "boolean" }
  | { type: "string"; min?: number; max?: number }
  | { type: "number"; min?: number; max?: number }
  | { type: "object"; items: { key: string; schema: Obj }[] }
  | { type: "array"; items: Obj[] }
);

export function specialize<T extends "string" | "string?" | "number" | "number?">(
  type: T,
  args: T extends "string" | "string?"
    ? { minLength?: number; maxLength?: number }
    : T extends "number" | "number?"
    ? { min?: number; max?: number }
    : never
): ValiPart {
  let a: number | "?" = "?";
  let b: number | "?" = "?";

  if (type[0] === "s") {
    const aNum = (args as { minLength?: number }).minLength;
    const bNum = (args as { maxLength?: number }).maxLength;
    if (aNum !== undefined) a = aNum;
    if (bNum !== undefined) b = bNum;
  } else {
    const aNum = (args as { min?: number }).min;
    const bNum = (args as { max?: number }).max;
    if (aNum !== undefined) a = aNum;
    if (bNum !== undefined) b = bNum;
  }

  return `${type}:${a}:${b}`;
}
