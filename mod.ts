import type { ValiPart, Infer } from "./utils.ts";

export default function createValidator<P extends ValiPart, T extends boolean = false>(
  part: P,
  clausesOnly?: T
): T extends true ? string : (d: unknown) => d is Infer<P> {
  const helpers: string[] = ["v"];

  function genCheck(part: ValiPart, path: string): string {
    if (typeof part === "string") {
      const optional = part.endsWith("?");
      const base = optional ? part.slice(0, -1) : part;

      switch (base) {
        case "boolean":
        case "number":
        case "string": {
          const baseCheck = `typeof ${path}==='${base}'`;
          return optional ? `${path}===undefined||(${baseCheck})` : baseCheck;
        }
        default:
          throw new Error(`Unknown base type: ${part}`);
      }
    }

    if (Array.isArray(part)) {
      const name = `c${helpers.length}`;
      helpers.push(`${name}=(i)=>${genCheck(part[0], "i")}`);
      return `Array.isArray(${path})&&${path}.every(${name})`;
    }

    const keys = Object.keys(part);
    let out = `typeof ${path}==='object'&&${path}!==null`;
    for (const k of keys) {
      out += `&&${genCheck(part[k], `${path}.${k}`)}`;
    }
    return out;
  }

  const condition = genCheck(part, "d");

  if (clausesOnly) {
    return condition as ReturnType<typeof createValidator<P, T>>;
  }

  return Function(`var ${helpers};return (d)=>${condition}`)() as ReturnType<
    typeof createValidator<P, T>
  >;
}
