import createValidator from "./mod.ts";
import { build, t } from "stnl";
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

const stnlIsUser = build.json.assert.compile(
  t.list(
    t.dict({
      id: t.int,
      author: t.dict({
        name: t.string,
        email: t.string,
        age: t.int,
        posts: t.list(t.int),
      }),
      title: t.string,
      published: t.bool,
      tags: t.list(t.string),
    })
  )
);

const ArktypeUser = type([
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
