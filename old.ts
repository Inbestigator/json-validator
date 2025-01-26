import type { BaseTypes, ValiPart } from "./utils.ts";

export function createValidator(part: ValiPart) {
  // deno-lint-ignore no-explicit-any
  function validate(data: any, part: ValiPart) {
    if (typeof part === "string") {
      const args = part.split(":");
      let partType = args[0] as BaseTypes;
      const isOptional = typeof part === "string" && args[0].endsWith("?");
      if (isOptional) {
        partType = args[0].slice(0, -1) as BaseTypes;
      }
      if (isOptional && data === undefined) {
        return;
      }
      switch (partType) {
        case "string": {
          if (typeof data !== "string") {
            throw new Error("not a string");
          }
          if (args[1] !== "?" && data.length < parseInt(args[1], 10)) {
            throw new Error("too short");
          }
          if (args[2] !== "?" && data.length > parseInt(args[2], 10)) {
            throw new Error("too long");
          }
          break;
        }
        case "number": {
          if (typeof data !== "number") {
            throw new Error("not a number");
          }
          if (args[1] !== "?" && data < parseInt(args[1], 10)) {
            throw new Error("too small");
          }
          if (args[2] !== "?" && data > parseInt(args[2], 10)) {
            throw new Error("too big");
          }
          break;
        }
        case "boolean": {
          if (
            typeof data !== "boolean"
          ) {
            throw new Error("not a boolean");
          }
          break;
        }
        default:
          throw new Error("unexpected type");
      }
    } else if (Array.isArray(part)) {
      if (!Array.isArray(data)) {
        throw new Error("not an array");
      }
      if (part.length === 1) {
        for (const item of data) {
          validate(item, part[0]);
        }
      } else {
        if (data.length !== part.length) {
          throw new Error("wrong array length");
        }
        for (let i = 0; i < data.length; i++) {
          validate(data[i], part[i]);
        }
        for (let i = 0; i < part.length; i++) {
          validate(data[i], part[i]);
        }
      }
    } else if (typeof part === "object") {
      if (typeof data !== "object" || Array.isArray(data)) {
        throw new Error("not an object");
      }
      for (const key in part) {
        validate(data[key], part[key]);
      }
      for (const key in data) {
        validate(data[key], part[key]);
      }
    }
  }
  // deno-lint-ignore no-explicit-any
  return (data: any) => {
    try {
      validate(data, part);
    } catch {
      return false;
    }
    return true;
  };
}
