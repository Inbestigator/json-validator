export type BaseTypes = "string" | "number" | "boolean";
export type OptionalTypes = `${BaseTypes}?` | "?";
export type ArgTypes =
  | `${"string" | "string?"}:${number | "?"}:${number | "?"}`
  | `${"number" | "number?"}:${number | "?"}:${number | "?"}`;

export type ValiPart =
  | (BaseTypes | OptionalTypes | ArgTypes)
  | {
    [key: string]: ValiPart;
  }
  | ValiPart[];

export type Obj =
  & { isOptional?: boolean }
  & (
    | {
      type: "boolean";
    }
    | {
      min?: number;
      max?: number;
    }
      & (
        | {
          type: "string";
        }
        | {
          type: "number";
        }
      )
    | {
      type: "object";
      items: { key: string; schema: Obj }[];
    }
    | {
      type: "array";
      items: Obj[];
    }
  );

/**
 * Constructs a specialized schema part based on the given base or optional type
 * and its constraints. For "string" or "string?" types, accepts minimum and maximum
 * length constraints. For "number" or "number?" types, accepts minimum and maximum
 * value constraints. Returns a ValiPart string representation of the schema part.
 * @param type - The base or optional type to specialize.
 * @param args - The constraints specific to the type, such as min/max length for strings or min/max value for numbers.
 * @returns A ValiPart string representation of the specialized schema part.
 * @throws Will throw an error if an unexpected type is provided.
 */
export function specialize<T extends BaseTypes | OptionalTypes>(
  type: T,
  args: T extends "string" | "string?" ? {
      minLength?: number;
      maxLength?: number;
    }
    : T extends "number" | "number?" ? {
        min?: number;
        max?: number;
      }
    : never,
): ValiPart {
  switch (type) {
    case "string?":
    case "string": {
      const strArgs = args as {
        minLength?: number;
        maxLength?: number;
      };
      return `${type as "string" | "string?"}:${strArgs.minLength ?? "?"}:${
        strArgs.maxLength ?? "?"
      }`;
    }
    case "number?":
    case "number": {
      const numArgs = args as {
        min?: number;
        max?: number;
      };
      return `${type as "number" | "number?"}:${numArgs.min ?? "?"}:${
        numArgs.max ?? "?"
      }`;
    }
    default:
      throw new Error("Unexpected type");
  }
}

function parseRange(
  args: string[],
  defaultMin: number,
  defaultMax: number,
): { min?: number; max?: number } {
  const min = args[1] === "?"
    ? defaultMin
    : args[1]
    ? parseInt(args[1], 10)
    : undefined;
  const max = args[2] === "?"
    ? defaultMax
    : args[2]
    ? parseInt(args[2], 10)
    : undefined;
  return { min, max };
}

/**
 * Converts a ValiPart schema definition into an Obj representation.
 * Handles string, array, and object types, and supports optional fields.
 * @param {ValiPart} part - The schema definition which can be a string, array, or object.
 * @returns The converted Obj representation of the schema.
 * @throws Throws an error if an unexpected type is encountered.
 */
export function createObj(part: ValiPart): Obj {
  if (typeof part === "string") {
    const args = part.split(":");
    let partType = args[0] as BaseTypes;
    const isOptional = part.endsWith("?");

    if (isOptional) {
      partType = args[0].slice(0, -1) as BaseTypes;
    }

    switch (partType) {
      case "string": {
        const { min, max } = parseRange(args, 0, Infinity);
        return { type: "string", isOptional, min, max };
      }
      case "number": {
        const { min, max } = parseRange(args, -Infinity, Infinity);
        return { type: "number", isOptional, min, max };
      }
      case "boolean": {
        return { type: "boolean", isOptional };
      }
      default: {
        throw new Error("Unexpected type");
      }
    }
  } else if (Array.isArray(part)) {
    const items: Obj[] = [];
    part.forEach((p) => {
      items.push(createObj(p));
    });
    return { type: "array", items };
  } else if (typeof part === "object") {
    const items: { key: string; schema: Obj }[] = [];
    for (const key in part) {
      items.push({ key, schema: createObj(part[key]) });
    }
    return { type: "object", items };
  }

  throw new Error("Unexpected type");
}
