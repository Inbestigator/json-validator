import createValidator from "./mod.ts";
import stnl from "stnl";
import { build } from "stnl/compilers/validate-json/index.js";
import { type } from "arktype";

const isUser = createValidator([
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
]);

const StnlUser = stnl({
  item: {
    props: {
      id: "i16",
      author: {
        props: {
          name: "string",
          email: "string",
          age: "i16",
          posts: {
            item: "f32",
          },
        },
      },
      title: "string",
      published: "bool",
      tags: {
        item: "string",
      },
    },
  },
});
const stnlIsUser = build(StnlUser);
const ArktypeUser = type([{
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
}]);

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

Deno.bench("Vali", () => {
  isUser(usage);
});

Deno.bench("Stnl", () => {
  stnlIsUser(usage);
});

Deno.bench("Arktype", () => {
  ArktypeUser(usage);
});
