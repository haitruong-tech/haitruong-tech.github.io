---
title: "GraphQL qua một đơn Shopee Food"
description: "Hiểu bản chất GraphQL — schema, resolver, query, parse → validate → execute — bằng câu chuyện đặt burger với coca. Không server, không client, chỉ 1 file code."
pubDate: 2026-07-21
lang: "vi"
tags: ["graphql", "api", "javascript", "backend"]
---

Trước khi nói về GraphQL, để mình kể một chuyện chẳng liên quan gì đến code: chuyện mình đặt đồ ăn hôm Chủ nhật vừa rồi.

## Chuyện đặt đồ ăn hôm Chủ nhật

Hôm Chủ nhật vừa rồi mình định đặt burger với lại coca trên Shopee Food. Quán đầu tiên mình chọn thì chỉ có combo burger và khoai tây chiên thôi, trong khi đó mình cần burger với coca. Vừa **thừa** khoai tây chiên vừa **thiếu** coca nên mình kiếm shop khác.

Qua tới quán thứ 2 thì thấy quán này chia menu ra từng món nhỏ, món nào cũng cho mình tự chọn hết. Burger thì chọn được bò hay gà, thêm phô mai hay không. Nước thì có coca, size gì và đá như thế nào. Mình thấy quán này ok nên chọn đúng thứ mình muốn thôi: 1 burger bò thêm phô mai và 1 coca size lớn nhiều đá. Một đơn duy nhất, nhận về chính xác những gì mình đặt.

## Lật bài: quán 1 là REST, quán 2 là GraphQL

Kể tới đây chắc bạn cũng hiểu sơ sơ mình muốn nói gì rồi ha.

**Quán 1 chính là REST API.** Mỗi endpoint là 1 cái combo mà server chốt sẵn, client không có quyền ý kiến — dư cái mình không cần, thiếu đúng cái mình cần. Cần mỗi cái burger thôi mà phải ôm nguyên combo, trả tiền luôn cho bịch khoai tây chiên — cái này gọi là **over-fetching**. Còn muốn có coca thì phải qua quán khác đặt thêm 1 đơn nữa, tốn thêm 1 lần ship nữa — tức là gọi thêm 1 endpoint, tốn thêm 1 round-trip — cái này là **under-fetching**.

**Quán 2 là GraphQL.** Lần này người viết đơn hàng là mình — phía client. Cần field nào tick field đó, tick sâu vô tới từng lựa chọn nhỏ bên trong luôn. 1 request duy nhất, server trả về đúng cái shape mình yêu cầu. Không dư, không thiếu.

À, còn cái menu của quán 2 nữa. Nó chính là **schema** — một cái contract ghi rõ quán có gì, mỗi món cho chọn những gì. Mình mà order món ngoài menu là app chặn liền ngay lúc bấm đặt.

## Vậy rốt cuộc GraphQL là cái gì?

GraphQL bản chất chỉ gồm 2 thứ: một **ngôn ngữ truy vấn** và một **engine thực thi**. Nó **không phải database**, **không cần server**, thậm chí **không cần cả HTTP**.

Để chứng minh, phần còn lại của bài này sẽ chạy GraphQL trong đúng 1 file code — không server, không client gì hết.

## Chứng minh bằng 1 file code

Setup chỉ cần 2 file nằm cạnh nhau:

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

Chạy `npm i`, tạo file `demo-graphql.js` (code đầy đủ ở cuối bài), rồi `node demo-graphql.js`. Giờ đi qua từng khối.

### Khối 1 — Schema = menu

```graphql
type Shop {
  name:   String
  rating: Float
  menu:   [MenuItem]
}

type MenuItem {
  name:         String
  price:        Int
  priceWithTax: Int           # computed — database không hề có cột này!
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

# Query cũng chỉ là một type — đặc biệt duy nhất ở chỗ
# field của nó là những cánh cửa duy nhất vào đồ thị.
type Query {
  shop(name: String!): Shop
}
```

Schema này miêu tả menu của quán số 2. Để ý 2 từ khóa: **type** thì y như `interface` bên TypeScript — Shop, MenuItem, Option... — còn **field** là các property nằm bên trong interface. Type chứa field, field lại trỏ sang type khác: Shop trỏ MenuItem, MenuItem trỏ OptionGroup... Chúng móc nối nhau thành một đồ thị — chữ **Graph** trong GraphQL là từ đây.

Riêng type `Query` là cổng vào: field của nó là những entrypoints để client lấy data. Muốn tới MenuItem thì phải đi từ `shop → menu`, không có chuyện nhảy thẳng vô giữa — thử query `{ name }` là bị chặn ngay với lỗi `Cannot query field "name" on type "Query"`.

### Khối 2 — Database (giả)

Schema chỉ là contract thôi, chưa có miếng dữ liệu nào. Dữ liệu nằm ở **database** — ở đây mình fake bằng object thường cho gọn, ngoài đời là MongoDB, Postgres... gì cũng được.

```js
const menuItem = (name, price, optionGroups) => ({
  name,
  price,
  optionGroups,
  priceWithTax() {                        // hàm nằm NGAY TRÊN object món
    return Math.round(this.price * 1.1);  // `this` = chính món này
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

Mỗi object ở đây "đóng vai" một instance của một type: object quán ↔ `Shop`, mỗi phần tử trong `menu` ↔ `MenuItem`... Và một property có thể là **data** (dùng luôn) hoặc **một hàm** — như `priceWithTax`, sẽ được gọi khi field tương ứng được hỏi tới.

### Khối 3 — Resolver = nhà bếp

```js
const resolver = {
  shop({ name }) {
    console.log(`   🧑‍🍳 Kitchen is fetching "${name}" from the database...`);
    return database[name];
  },
};
```

**Resolver** là hàm chịu trách nhiệm lấy dữ liệu ra. Object `resolver` này sẽ được truyền vào engine qua `rootValue` — nó đơn giản là **parent đầu tiên** mà engine cầm khi bắt đầu đi: gặp field `shop`, engine đọc `rootValue["shop"]`, thấy là hàm thì gọi (kèm arguments), và object trả về trở thành parent cho tầng dưới.

Điểm hay: mình chỉ viết đúng 1 resolver cho `shop`. Vậy `name`, `price`, `menu`... ai lo? **Default resolver** của engine — và luật của nó chỉ là trò nối tên: *tên field trong query khớp với tên property trong object (parent) thì chép giá trị qua*, viết thành code đúng 1 dòng: `parent[tênField]`. Query hỏi `name` → chép `"Shop No.2"`. Hỏi `menu` → chép mảng món, rồi chui vào từng món làm tiếp. Không hỏi `rating` → không chép. Cứ vậy đệ quy tới đáy.

Nếu không có default resolver thì sao? Khi đó mọi field đều phải có resolver: schema nhỏ xíu này có 12 field → phải viết đủ 12 hàm, mà 10 hàm y chang nhau kiểu `name: (parent) => parent.name` — toàn boilerplate. Nên GraphQL quy ước luôn: field nào không viết resolver, engine tự làm giùm động tác đó; code chỉ còn lại những resolver "có não" như `shop` phải đi tra database.

Riêng `priceWithTax` thì đặc biệt xíu: database không hề có cột này. Nhưng vì property của nó là một hàm, nên khi được hỏi tới, engine sẽ gọi hàm và tính ra tại chỗ.

### Khối 4 — Đơn hàng & hóa đơn

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

Nhìn kỹ nha: trong query mình **chỉ viết tên field**, không có tên type nào hết. Phần `name: "Shop No.2"` là **argument** của field — được khai báo sẵn trong schema (`shop(name: String!)`) và được engine gói lại đưa vào tham số đầu tiên của resolver. Và mình cố tình KHÔNG tick 2 field: `rating` và `extraPrice`.

Kết quả:

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

Đúng y chang shape của đơn hàng. `rating` nằm trong database đàng hoàng nhưng không có trong hóa đơn — vì mình đâu có hỏi. Ngược lại `priceWithTax` không hề có trong database mà vẫn được tính ra. Client hỏi gì nhận đúng cái đó — không dư, không thiếu. Thử thêm `rating` vào query rồi chạy lại: hóa đơn nở thêm đúng 1 dòng.

### Khối 5 — Lật màn: parse → validate → execute

Cái hàm `graphql()` nãy giờ thật ra gói 3 bước bên trong: **parse** — đọc ngữ pháp và xây dựng AST của query; **validate** — đối chiếu query với schema; **execute** — xử lý query và trả về data. Giờ thử một field invalid: thêm `promotion` — thứ không hề có trong schema — và cho đơn này đi qua từng bước bằng tay:

```js
const invalidOrder = `{ shop(name: "Shop No.2") { name promotion } }`;

const document = parse(invalidOrder);        // chỉ kiểm tra NGỮ PHÁP
console.log('1️⃣  parse    ✓  (syntax is valid)');

const errors = validate(schema, document);   // ...nhưng menu nói không
console.log(`2️⃣  validate ✗  ${errors[0].message}`);

console.log('3️⃣  execute  ⏭️  never called');
```

Console in ra:

```
1️⃣  parse    ✓  (syntax is valid)
2️⃣  validate ✗  Cannot query field "promotion" on type "Shop".
3️⃣  execute  ⏭️  never called — notice: NO 🧑‍🍳 log at all.
```

Parse qua ngon — vì ngữ pháp viết đúng mà. Validate chặn liền. Và quan trọng nhất: **không có dòng log 🧑‍🍳 nào của resolver hết** — đơn bị chặn *trước khi* resolver kịp biết tới sự tồn tại của nó. Y hệt cái app chặn ngay lúc mình bấm đặt, chứ không phải để shipper chạy tới nơi rồi mới báo hết món.

## Vậy Apollo, Yoga... để làm gì?

Nhớ lại: graphql-js *cố tình* chỉ làm 2 thứ — ngôn ngữ + engine — và không có một dòng HTTP nào. Mà API thật thì client ở đầu kia mạng, nên phải có ai đó nhận request, móc query ra khỏi body, gọi engine, trả JSON về, kèm cả đống việc xung quanh: context per-request (auth, DB connection), resolver map theo type, che lỗi, playground, chặn query quá sâu, caching... Tự viết hết đống đó xong là bạn vừa tạo ra một Apollo mini. Nên Apollo Server, GraphQL Yoga tồn tại để lo trọn gói phần "mở tiệm giao hàng"; còn ruột bên trong vẫn gọi đúng cái engine parse → validate → execute bạn vừa thấy.

## Tóm lại

| Ẩn dụ Shopee Food | GraphQL |
|---|---|
| Menu của quán | Schema |
| Nhà bếp | Resolver |
| Đơn hàng | Query |
| Hóa đơn | Response |
| App chặn lúc bấm đặt | Validation |
| Tiệm nhận đơn, shipper giao | Apollo / Yoga (lớp HTTP) |

Toàn bộ GraphQL nằm gọn trong 1 file: **schema, resolver, query**. Server, HTTP, Apollo... chỉ là lớp bọc bên ngoài để giao cái engine này qua mạng — bản chất bên trong vẫn y chang những gì bạn vừa thấy.

## Phụ lục — file demo hoàn chỉnh

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
