import { createValidator as objCreate } from "./obj.ts";
import { createValidator as oldCreate } from "./old.ts";
import { createValidator as ifCreate } from "./if.ts";
import stnl from "stnl";
import build from "stnl/compilers/validate-json/compose.js";
import { ValiPart } from "./utils.ts";

const mySchema: ValiPart = [
  {
    id: "number",
    author: {
      name: "string",
      email: "string",
      age: "number",
      posts: ["number"],
    },
    title: "string",
    published: "boolean",
    tags: ["string"],
  },
];

const objIsUser = objCreate(mySchema);
const ifIsUser = ifCreate(mySchema);
const oldIsUser = oldCreate(mySchema);
const StnlUser = stnl({
  values: [
    {
      props: {
        id: "i16",
        author: {
          props: {
            name: "string",
            email: "string",
            age: "i16",
            posts: {
              values: ["i16"],
            },
          },
        },
        title: "string",
        published: "bool",
        tags: {
          values: ["string"],
        },
      },
    },
  ],
});
const stnlIsUser = build(StnlUser);

// Each array only has one, because the STNL schemaing for arrays is rather confusing to me
const usage = [
  {
    id: 1,
    author: {
      name: "John",
      email: "a@a.com",
      age: 30,
      posts: [1],
    },
    title: "Hello world",
    published: true,
    tags: ["foo"],
  },
];

Deno.bench("Old", () => {
  oldIsUser(usage);
});

Deno.bench("If", () => {
  ifIsUser(usage);
});

Deno.bench("Obj", () => {
  objIsUser(usage);
});

Deno.bench("Stnl", () => {
  stnlIsUser(usage);
});

console.log("Old:", oldIsUser(usage));
console.log("If:", ifIsUser(usage));
console.log("Obj:", objIsUser(usage));
console.log("Stnl:", stnlIsUser(usage));
