---
title: "GraphQL Through a Shopee Food Order"
description: "Understand the essence of GraphQL — schema, resolvers, queries, parse → validate → execute — through the story of ordering a burger and a Coke. No server, no client, just one file."
pubDate: 2026-07-21
lang: "en"
tags: ["graphql", "api", "javascript", "backend"]
---

Before we talk about GraphQL, let me tell you a story that has nothing to do with code: the story of me ordering food last Sunday.

## A Sunday food order

Last Sunday I wanted to order a burger and a Coke on Shopee Food. The first shop I picked only sold one combo — a burger plus fries — while all I needed was a burger and a Coke. Too much fries, no Coke at all, so I went looking for another shop.

The second shop was different: the menu was split into individual items, and everything was customizable. Burger — beef or chicken, cheese or no cheese. Drinks — Coke, pick your size, pick your ice. I ticked exactly what I wanted: one beef burger with cheese and one large Coke with extra ice. One single order, and I got back exactly what I asked for.

## The reveal: shop 1 is REST, shop 2 is GraphQL

You can probably see where this is going.

**Shop 1 is a REST API.** Each endpoint is a combo the server decided in advance — the client gets no say. You receive things you don't need and still miss the one thing you do. Needing just the burger but paying for the whole combo, fries included — that's **over-fetching**. Wanting a Coke and having to place a second order at another shop, paying another delivery fee — one more endpoint, one more round-trip — that's **under-fetching**.

**Shop 2 is GraphQL.** This time the client writes the order: tick exactly the fields you need, down to every nested option. One single request, and the server returns exactly the shape you asked for. Nothing extra, nothing missing.

Oh, and shop 2's menu? That's the **schema** — a contract stating what the shop has and what each item lets you choose. Order something off-menu and the app blocks you the moment you hit "Place order".

## So what exactly is GraphQL?

At its core, GraphQL is just two things: a **query language** and an **execution engine**. It is **not a database**, it **doesn't need a server**, it doesn't even need **HTTP**.

To prove it, the rest of this post runs GraphQL inside a single file — no server, no client.

## Proving it with one file

The setup is just two files side by side:

```json
// package.json
{
  "name": "graphql-seminar-demo",
  "type": "module",
  "dependencies": {
    "graphql": "^17.0.2"
  }
}
```

Run `npm i`, create `demo-graphql.js` (full code at the end of this post), then `node demo-graphql.js`. Let's walk through it block by block.

### Block 1 — Schema = the menu

```graphql
type Shop {
  name:   String
  rating: Float
  menu:   [MenuItem]
}

type MenuItem {
  name:         String
  price:        Int
  priceWithTax: Int           # computed — no such column in the database!
  optionGroups: [OptionGroup]
}

type OptionGroup {
  name:    String
  options: [Option]
}

type Option {
  name:       String
  extraPrice: Int
}

# Query is just a type — special only because its fields
# are the ONLY doors into the graph.
type Query {
  shop(name: String!): Shop
}
```

This schema describes shop No.2's menu. Two keywords to notice: a **type** is just like an `interface` in TypeScript — Shop, MenuItem, Option... — while a **field** is a property inside the interface. Types contain fields; fields point to other types: Shop points to MenuItem, MenuItem points to OptionGroup... They link up into a graph — that's the **Graph** in GraphQL.

The `Query` type is the entrance: its fields are the entrypoints clients use to fetch data. To reach MenuItem you must walk `shop → menu` — there's no jumping straight into the middle. Try querying `{ name }` and you're stopped immediately with `Cannot query field "name" on type "Query"`.

### Block 2 — The (fake) database

A schema is just a contract — it holds no data. Data lives in the **database**, faked here with plain objects to keep things small; in real life it's MongoDB, Postgres, anything.

```js
const menuItem = (name, price, optionGroups) => ({
  name,
  price,
  optionGroups,
  priceWithTax() {                        // a function ON the item itself
    return Math.round(this.price * 1.1);  // `this` = this menu item
  },
});

const database = {
  'Shop No.2': {
    name: 'Shop No.2',
    rating: 4.8,
    menu: [
      menuItem('Burger', 45000, [
        { name: 'Type',    options: [{ name: 'Beef', extraPrice: 0 }, { name: 'Chicken', extraPrice: 0 }] },
        { name: 'Topping', options: [{ name: 'Cheese', extraPrice: 10000 }] },
      ]),
      menuItem('Coca', 15000, [
        { name: 'Size', options: [{ name: 'S', extraPrice: 0 }, { name: 'M', extraPrice: 3000 }, { name: 'L', extraPrice: 5000 }] },
        { name: 'Ice',  options: [{ name: 'Extra ice', extraPrice: 0 }, { name: 'No ice', extraPrice: 0 }] },
      ]),
    ],
  },
};
```

Each object here plays the role of an instance of a type: the shop object ↔ `Shop`, each element of `menu` ↔ `MenuItem`... And a property can be **data** (used as-is) or **a function** — like `priceWithTax`, which gets called whenever its field is asked for.

### Block 3 — Resolver = the kitchen

```js
const resolver = {
  shop({ name }) {
    console.log(`   🧑‍🍳 Kitchen is fetching "${name}" from the database...`);
    return database[name];
  },
};
```

A **resolver** is the function responsible for producing data. This `resolver` object is handed to the engine as `rootValue` — which is simply the **first parent** the engine holds when it starts walking: on field `shop` it reads `rootValue["shop"]`, sees a function, calls it (with the arguments), and the returned object becomes the parent for the next level down.

Here's the neat part: I wrote exactly one resolver, for `shop`. So who handles `name`, `price`, `menu`...? The engine's **default resolver** — and its rule is just a name-matching game: *if a field name in the query matches a property name on the object (the parent), copy the value over* — one line of code: `parent[fieldName]`. The query asks for `name` → copy `"Shop No.2"`. Asks for `menu` → copy the array, then recurse into each item. Never asks for `rating` → nothing gets copied. And so on, all the way down.

What if there were no default resolver? Then every field would need one: this tiny schema has 12 fields → 12 functions, 10 of them identical boilerplate like `name: (parent) => parent.name`. So GraphQL made it a convention: any field without a resolver gets exactly that behavior for free — leaving your code with only the resolvers that have a brain, like `shop`, which actually hits the database.

`priceWithTax` is a special little case: the database has no such column. But since its property is a function, the engine calls it on demand and computes the value on the spot.

### Block 4 — The order & the receipt

```js
const order = `{
  shop(name: "Shop No.2") {
    name
    menu {
      name
      price
      priceWithTax
      optionGroups {
        name
        options { name }
      }
    }
  }
}`;

const receipt = await graphql({ schema, source: order, rootValue: resolver });
console.log(JSON.stringify(receipt, null, 2));
```

Look closely: the query contains **field names only** — not a single type name. The `name: "Shop No.2"` part is the field's **argument**, declared in the schema (`shop(name: String!)`) and packed by the engine into the resolver's first parameter. And I deliberately did NOT tick two fields: `rating` and `extraPrice`.

The result:

```json
{
  "data": {
    "shop": {
      "name": "Shop No.2",
      "menu": [
        {
          "name": "Burger",
          "price": 45000,
          "priceWithTax": 49500,
          "optionGroups": [
            { "name": "Type",    "options": [{ "name": "Beef" }, { "name": "Chicken" }] },
            { "name": "Topping", "options": [{ "name": "Cheese" }] }
          ]
        },
        {
          "name": "Coca",
          "price": 15000,
          "priceWithTax": 16500,
          "optionGroups": [
            { "name": "Size", "options": [{ "name": "S" }, { "name": "M" }, { "name": "L" }] },
            { "name": "Ice",  "options": [{ "name": "Extra ice" }, { "name": "No ice" }] }
          ]
        }
      ]
    }
  }
}
```

Exactly the shape of the order. `rating` sits right there in the database but never shows up on the receipt — because I never asked. Meanwhile `priceWithTax` doesn't exist in the database at all, yet it got computed. You receive precisely what you ask for — nothing more, nothing less. Add `rating` to the query and re-run: the receipt grows by exactly one line.

### Block 5 — Behind the curtain: parse → validate → execute

That `graphql()` call actually wraps three steps: **parse** — read the grammar and build the query's AST; **validate** — check the query against the schema; **execute** — run the query and return data. Let's try an invalid field: `promotion`, which doesn't exist in the schema, pushed through the pipeline by hand:

```js
const invalidOrder = `{ shop(name: "Shop No.2") { name promotion } }`;

const document = parse(invalidOrder);        // checks GRAMMAR only
console.log('1️⃣  parse    ✓  (syntax is valid)');

const errors = validate(schema, document);   // ...but the menu says no
console.log(`2️⃣  validate ✗  ${errors[0].message}`);

console.log('3️⃣  execute  ⏭️  never called');
```

The console prints:

```
1️⃣  parse    ✓  (syntax is valid)
2️⃣  validate ✗  Cannot query field "promotion" on type "Shop".
3️⃣  execute  ⏭️  never called — notice: NO 🧑‍🍳 log at all.
```

Parse passes — the grammar is fine. Validate blocks it instantly. And most importantly: **not a single 🧑‍🍳 resolver log** — the order was rejected *before* the resolver ever learned it existed. Exactly like the app blocking you the moment you hit "Place order", instead of the driver showing up just to tell you the item is sold out.

## So what are Apollo, Yoga... for?

Remember: graphql-js *deliberately* does only two things — language + engine — and contains not a single line of HTTP. Real APIs have clients on the other side of a network, so someone has to accept requests, pull the query out of the body, call the engine, and send JSON back — plus everything around it: per-request context (auth, DB connections), per-type resolver maps, error masking, a playground, query-depth limits, caching... Write all of that yourself and congratulations, you've just built a mini Apollo. That's why Apollo Server and GraphQL Yoga exist: they run the delivery storefront, while inside they call the very same parse → validate → execute engine you just saw.

## Wrapping up

| Food-delivery metaphor | GraphQL |
|---|---|
| The shop's menu | Schema |
| The kitchen | Resolvers |
| The order | Query |
| The receipt | Response |
| The app blocking you at checkout | Validation |
| The storefront & delivery | Apollo / Yoga (the HTTP layer) |

All of GraphQL fits in one file: **schema, resolvers, query**. Servers, HTTP, Apollo... are just wrappers that ship this engine over the network — the core stays exactly what you've just seen.

## Appendix — the full demo file

```js
// ============================================================
//  THE ESSENCE OF GRAPHQL — no server, no client
//  Setup : put this file next to package.json → npm i
//  Run   : node demo-graphql.js
// ============================================================
import { graphql, parse, validate, buildSchema } from 'graphql';

// ------------------------------------------------------------
// 1) SCHEMA — the "menu", generic Shopee-Food style.
// ------------------------------------------------------------
const schema = buildSchema(`
  type Shop {
    name:   String
    rating: Float
    menu:   [MenuItem]
  }

  type MenuItem {
    name:         String
    price:        Int
    priceWithTax: Int           # computed — no such column in the database!
    optionGroups: [OptionGroup]
  }

  type OptionGroup {
    name:    String
    options: [Option]
  }

  type Option {
    name:       String
    extraPrice: Int
  }

  # Query is just a type — special only because its fields
  # are the ONLY doors into the graph.
  type Query {
    shop(name: String!): Shop
  }
`);

// ------------------------------------------------------------
// 2) FAKE DATABASE — plain objects playing the role of each type.
// ------------------------------------------------------------
const menuItem = (name, price, optionGroups) => ({
  name,
  price,
  optionGroups,
  priceWithTax() {                        // function ON the item itself
    return Math.round(this.price * 1.1);  // `this` = this menu item
  },
});

const database = {
  'Shop No.2': {
    name: 'Shop No.2',
    rating: 4.8,
    menu: [
      menuItem('Burger', 45000, [
        { name: 'Type',    options: [{ name: 'Beef', extraPrice: 0 }, { name: 'Chicken', extraPrice: 0 }] },
        { name: 'Topping', options: [{ name: 'Cheese', extraPrice: 10000 }] },
      ]),
      menuItem('Coca', 15000, [
        { name: 'Size', options: [{ name: 'S', extraPrice: 0 }, { name: 'M', extraPrice: 3000 }, { name: 'L', extraPrice: 5000 }] },
        { name: 'Ice',  options: [{ name: 'Extra ice', extraPrice: 0 }, { name: 'No ice', extraPrice: 0 }] },
      ]),
    ],
  },
};

// ------------------------------------------------------------
// 3) RESOLVER — the "kitchen" for the root field `shop`.
// ------------------------------------------------------------
const resolver = {
  shop({ name }) {
    console.log(`   🧑‍🍳 Kitchen is fetching "${name}" from the database...`);
    return database[name];
  },
};

// ------------------------------------------------------------
// 4) THE ORDER — deliberately NOT ticked: `rating`, `extraPrice`.
// ------------------------------------------------------------
const order = `{
  shop(name: "Shop No.2") {
    name
    menu {
      name
      price
      priceWithTax
      optionGroups {
        name
        options { name }
      }
    }
  }
}`;

console.log('══════ 1 · VALID ORDER — graphql() all-in-one ══════\n');
const receipt = await graphql({ schema, source: order, rootValue: resolver });
console.log('\n🧾 RECEIPT — exactly the shape we ordered:\n');
console.log(JSON.stringify(receipt, null, 2));

// ------------------------------------------------------------
// 5) BEHIND THE CURTAIN — graphql() = parse → validate → execute.
//    Push an INVALID order through the pipeline by hand.
// ------------------------------------------------------------
console.log('\n══════ 2 · INVALID ORDER — the pipeline, step by step ══════\n');
const invalidOrder = `{ shop(name: "Shop No.2") { name promotion } }`;

const document = parse(invalidOrder);        // checks GRAMMAR only
console.log('1️⃣  parse    ✓  (syntax is valid)');

const errors = validate(schema, document);   // ...but the menu says no
console.log(`2️⃣  validate ✗  ${errors[0].message}`);

console.log('3️⃣  execute  ⏭️  never called — notice: NO 🧑‍🍳 log at all.');
console.log('    The order was rejected BEFORE the kitchen ever heard about it.');
```
