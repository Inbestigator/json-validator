import { createObj, type Obj, specialize, type ValiPart } from "./utils.ts";

export { createObj, specialize, type ValiPart };

/**
 * Given a schema, returns a function that takes some data and returns whether it matches the schema.
 * If the second argument is true, returns a string that can be used in a conditional statement to check whether data matches the schema.
 * @param {ValiPart} part - The schema to validate against
 * @param {boolean} [clausesOnly] - If true, returns a string that can be used in a conditional statement
 * @returns - A function that takes some data and returns whether it matches the schema
 */
export default function createValidator<T extends boolean = false>(
  part: ValiPart,
  clausesOnly?: T,
): T extends true ? string
  : (data: unknown) => boolean {
  const obj = createObj(part);

  /**
   * Quickly make sure that data is in the correct form before going more specific
   */
  function generatePreliminaryIf(obj: Obj, path = "data"): string {
    switch (obj.type) {
      case "array":
        return `Array.isArray(${path})`;
      case "object":
        return `typeof ${path} === 'object' && ${path} !== null`;
      default:
        return `typeof ${path} === '${obj.type}'`;
    }
  }

  /**
   * Specific checks, e.g. length, min, max
   */
  function generateGranularIf(obj: Obj, path = "data"): string {
    switch (obj.type) {
      case "string": {
        const conditions = [
          obj.min ? `${path}.length >= ${obj.min}` : undefined,
          obj.max ? `${path}.length <= ${obj.max}` : undefined,
        ];
        const filtered = conditions.filter((c) => c !== undefined);
        return filtered.length === 0 ? "true" : filtered.join(" && ");
      }
      case "number": {
        const conditions = [
          obj.min ? `${path} >= ${obj.min}` : undefined,
          obj.max ? `${path} <= ${obj.max}` : undefined,
        ];
        const filtered = conditions.filter((c) => c !== undefined);
        return filtered.length === 0 ? "true" : filtered.join(" && ");
      }
      case "array": {
        if (obj.items.length === 0) {
          return `${path}.length === 0`;
        }
        if (obj.items.length === 1) {
          return `${path}.every(item => ${
            generateIfStatement(
              obj.items[0],
              "item",
            )
          })`;
        }
        const itemConditions = obj.items
          .map((item, index) => generateIfStatement(item, `${path}[${index}]`))
          .join(" && ");
        return `${itemConditions} && ${path}.length === ${obj.items.length}`;
      }
      case "object": {
        if (obj.items.length === 0) {
          return "true";
        }
        const propertyConditions = obj.items
          .map(
            ({ key, schema }) =>
              `${
                generateIfStatement(
                  schema,
                  `${path}.${key}`,
                )
              }`,
          )
          .join(" && ");
        return propertyConditions;
      }
      default:
        return "true";
    }
  }

  function generateIfStatement(obj: Obj, path = "data"): string {
    const preliminaryCondition = generatePreliminaryIf(obj, path);
    const granularCondition = generateGranularIf(obj, path);

    if (obj.isOptional) {
      return `${path} === undefined || (${preliminaryCondition}${
        granularCondition !== "true" ? ` && ${granularCondition}` : ""
      })`;
    }
    return `(${preliminaryCondition}${
      granularCondition !== "true" ? ` && ${granularCondition}` : ""
    })`;
  }

  if (clausesOnly === true) {
    return generateIfStatement(obj) as ReturnType<typeof createValidator<T>>;
  }

  return Function(
    "data",
    `'use strict';return ${generateIfStatement(obj)};`,
  ) as ReturnType<typeof createValidator<T>>;
}
