import { createObj, type Obj, type ValiPart } from "./utils.ts";

export function createValidator(part: ValiPart) {
  const obj = createObj(part);

  function generateIfStatement(obj: Obj, path = "data"): string {
    switch (obj.type) {
      case "string": {
        const conditions = [
          `typeof ${path} === 'string'`,
          `(${path}.length >= ${obj.min})`,
          `(${path}.length <= ${obj.max})`,
        ];
        return obj.isOptional
          ? `(${path} === undefined || (${conditions.join(" && ")}))`
          : conditions.join(" && ");
      }
      case "number": {
        const conditions = [
          `typeof ${path} === 'number'`,
          `(${path} >= ${obj.min})`,
          `(${path} <= ${obj.max})`,
        ];
        return obj.isOptional
          ? `(${path} === undefined || (${conditions.join(" && ")}))`
          : conditions.join(" && ");
      }
      case "boolean": {
        return obj.isOptional
          ? `(${path} === undefined || typeof ${path} === 'boolean')`
          : `typeof ${path} === 'boolean'`;
      }
      case "array": {
        if (obj.items.length === 1) {
          return `Array.isArray(${path}) && ${path}.every((item) => (${
            generateIfStatement(obj.items[0], "item")
          }))`;
        }
        const itemConditions = obj.items
          .map((item, index) => generateIfStatement(item, `${path}[${index}]`))
          .join(" && ");
        return `Array.isArray(${path}) && (${itemConditions}) && (${path}.length === ${obj.items.length})`;
      }
      case "object": {
        const propertyConditions = obj.items
          .map(
            ({ key, schema }) =>
              `(${path}.${key} !== undefined && ${
                generateIfStatement(
                  schema,
                  `${path}.${key}`,
                )
              })`,
          )
          .join(" && ");
        return `typeof ${path} === 'object' && ${path} !== null && (${propertyConditions})`;
      }
    }
  }

  return new Function("data", `return ${generateIfStatement(obj)};`) as (
    data: unknown,
  ) => boolean;
}
