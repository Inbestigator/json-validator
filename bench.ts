import { createValidator as objCreate } from "./obj.ts";
import { createValidator as oldCreate } from "./old.ts";
import { createValidator as ifCreate } from "./if.ts";
import stnl from "stnl";
import { build } from "stnl/compilers/validate-json/index.js";
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
  items: {
    props: {
      id: "i16",
      author: {
        props: {
          name: "string",
          email: "string",
          age: "i16",
          posts: {
            items: "f32",
          },
        },
      },
      title: "string",
      published: "bool",
      tags: {
        items: "string",
      },
    },
  },
});
const stnlIsUser = build(StnlUser);

const usage = [
  {
    id: 1,
    author: {
      name: "John",
      email: "a@a.com",
      age: 30,
      posts: [1, 2],
    },
    title: "Hello world",
    published: true,
    tags: ["foo", "bar"],
  },
  {
    id: 2,
    author: {
      name: "John",
      email: "a@a.com",
      age: 30,
      posts: [1, 2],
    },
    title: "An original title",
    published: false,
    tags: ["bazz"],
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
