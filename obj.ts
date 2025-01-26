import { createObj, type Obj, type ValiPart } from "./utils.ts";

export function createValidator(part: ValiPart) {
  const obj = createObj(part);

  // deno-lint-ignore no-explicit-any
  function validate(data: any, part: Obj): void {
    if (data === undefined && part.isOptional) return;
    switch (part.type) {
      case "object": {
        if (typeof data !== "object" || data === null) {
          throw new Error("Not an object");
        }
        if (Object.keys(data).length !== part.items.length) {
          throw new Error("Invalid object");
        }
        for (const { key, schema } of part.items) {
          validate(data[key], schema);
        }
        return;
      }
      case "array": {
        if (!Array.isArray(data)) throw new Error("Not an array");
        const validator = part.items[0];
        for (const item of data) {
          validate(item, validator);
        }
        return;
      }
      case "boolean": {
        if (typeof data !== "boolean") throw new Error("Not a boolean");
        break;
      }
      case "string": {
        if (
          typeof data !== "string" || data.length < part.min ||
          data.length > part.max
        ) {
          throw new Error("Invalid string");
        }
        break;
      }
      case "number": {
        if (typeof data !== "number" || data < part.min || data > part.max) {
          throw new Error("Invalid number");
        }
        break;
      }
      default: {
        throw new Error("Unexpected type");
      }
    }
  }

  // deno-lint-ignore no-explicit-any
  return (data: any): boolean => {
    try {
      validate(data, obj);
      return true;
    } catch {
      return false;
    }
  };
}
