# 前置知识学习

## GraphQL 快速入门

接下来，切换到 ‘API 设计’ 页面，点击”新建“，创建 API。

在超图面板中可以看到基于 TODO 数据库生成的所有函数签名。

若想更好的跟上节奏，请先花费 10 分钟大概了解下 GraphQL 的基本知识，前往[查看](https://graphql.devjs.cn/learn/#)。

这些函数都是 GraphQL 语法，总的来说，我们只需要掌握如下要点，就可以快速上手。

- GraphQL 是什么：是一个用于 API 的查询语言(描述 API 的请求和响应类型)
- GraphQL 的函数分为 3 大类：查询 QUERY（对应 REST 的 GET 请求）、变更 MUTATION（对应 REST 的 POST\PUT\PATCH）、订阅 SUBSCRIPTION(对应 WEBSOCKET 或 SSE)，目前只需要知道前两个
- GraphQL 的函数[入参](https://graphql.devjs.cn/learn/queries/#arguments)和出参都有类型（是[强类型语言](https://graphql.devjs.cn/learn/schema/#type-system)），支持[变量](https://graphql.devjs.cn/learn/queries/#variables)替换

下面的示例包含了作为操作类型(OPERATION)的关键字 `query` 以及操作名称 `GetTodoById` 。

```gql
query MyQuery($id: String = "default") {
  todo_findUniqueTodo(where: { id: $id }) {
    completed
    createdAt
    id
    title
  }
}
```

其中，入参变量为`$id`，默认值为 `default` ，参数为 `where: { id: $id }`中的`id`。

此外，响应示例为：

```JSON
{
  "data": {
    "todo_findUniqueTodo": {
      "completed": false,
      "createdAt": "2022-12-31T16:00:01.000Z",
      "id": "2",
      "title": "This is Fireboom"
    }
  }
}
```

## Prisma 快速入门

上文，我们在超图面板看到了基于 TODO 数据库生成的所有函数签名。这些函数签名就是由 Prisma 生成的，核心签名如下：

查询方法：

- findFirst：返回列表中符合条件的第一条记录。
- findMany：返回记录列表。
- findUnique：根据主键或唯一键查询一条记录。
- aggregate：聚合数据，包括 avg、count、sum、min、max。
- groupBy：结合聚合函数，根据一个或多个列对结果集进行分组。

变更方法：

- createOne：创建一条记录，对应 sql 中的 insert。
- deleteMany：批量删除记录，对应 sql 中的 delete。
- deleteOne：删除一条记录，对应 sql 中的 delete。
- updateMany：更新多条记录，对应 sql 的 update。
- updateOne：更新一条记录，对应 sql 的 update。
- upsertOne：更新或插入一条记录。

**_GraphQL Operation=[命名空间]+函数签名+[表名]_**

关于 Prisma 我们只需要了解如下信息：

- Prisma 是一个现代 Nodejs ORM 库，其底层基于 RUST 编写，Firboom 用 golang 调用了其 RUST 引擎
- Prisma 采用了一个全新语法 Primsa Schema 描述数据模型，用于屏蔽各种数据库的方言（SQL），前往[查看](https://zhuanlan.zhihu.com/p/422628213)
- Prisma 内部采用了 GraphQL 协议作为对外的 API 接口，前往文档[查看](https://ansons-organization.gitbook.io/product-manual/kai-fa-wen-dang/shu-ju-yuan/shu-ju-ku#yuan-li-qian-xi)

## 请求流程图

![查询引擎Ts调用原理图](https://57674646-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhvHBEKUXoqt1bL00q2Ra%2Fuploads%2FXk8DEeDBLipGoG8lV8Ov%2Fimage.png?alt=media&token=8c5a4a6c-eb4d-4ad2-aca0-341c72b9bec5)

## 单数据源请求流程

![Fireboom调用Prisma的流程图](./img/03-Fireboom%E8%B0%83%E7%94%A8Prisma%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

图示备注：

0 定义接口

```gql
query MyQuery($id: String = "default") {
  todo_findUniqueTodo(where: { id: $id }) {
    completed
    createdAt
    id
    title
  }
}
```

3 请求：

```sh
http://localhost:9991/operations/GetOneTodo?id=2
```

注意：只有上线的 API 才能用这种请求，测试情况下用的是另一个端点。

```sh
curl 'http://localhost:9123/app/main/graphql' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-raw '{"query":"query MyQuery($id: String = \"default\") {\n  todo_findUniqueTodo(where: {id: $id}) {\n    completed\n    createdAt\n    id\n    title\n  }\n}","variables":{"id":"2"},"operationName":"MyQuery"}' \
  --compressed
```

注意看请求体 ：

```json
{
  "operationName": "MyQuery",
  "query": "query MyQuery($id: String = \"default\") {\n  todo_findUniqueTodo(where: {id: $id}) {\n    completed\n    createdAt\n    id\n    title\n  }\n}",
  "variables": { "id": "2" }
}
```

其主要区别是：

- 前者是 REST API，后者是 GraphQL API
- 前者用于生产，后者只用于测试

本质上前者和后者是一一对应的。

4 findUniqueTodo：

```gql
query MyQuery {
  findUniqueTodo(where: { id: "2" }) {
    completed
    createdAt
    id
    title
  }
}
```

5 SQL req：

```sql
SELECT `completed`,`createdAt`,`id`,`title` FROM Todo WHERE id='2'
```

6 SQL res：

| completed |   createdAt   |  id |            title |
| --------- | :-----------: | --: | ---------------: |
| 0         | 1672502401000 |   2 | This is Fireboom |

7 Query res(json)：

```JSON
{
  "data": {
    "findUniqueTodo": {
      "completed": false,
      "createdAt": "2022-12-31T16:00:01.000Z",
      "id": "2",
      "title": "This is Fireboom"
    }
  }
}
```

8 响应

```JSON
{
  "data": {
    "todo_findUniqueTodo": {
      "completed": false,
      "createdAt": "2022-12-31T16:00:01.000Z",
      "id": "2",
      "title": "This is Fireboom"
    }
  }
}
```

有以下 2 点需要注意：

- 0 和 4 的区别有两点：4 去掉了`todo_`；4 内联了入参，把`$id`改为`"2"`
- 7 和 8 的区别: 8 加了`todo_`

那为什么会有上述区别呢？

- Prisma 查询引擎不支持参数传递，所以必须要进行内联
- `todo_`其实是数据源的名称，加上前缀是为了区分要去哪个数据源查询数据（额外好处时支持多个数据源同时查询）

## 多数据源请求流程

![03-Fireboom调用多数据源流程图](./img/03-Fireboom%E8%B0%83%E7%94%A8%E5%A4%9A%E6%95%B0%E6%8D%AE%E6%BA%90%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

0 定义接口

```gql
query MyQuery($id: String = "default") {
  todo_findUniqueTodo(where: { id: $id }) {
    completed
    createdAt
    id
    title
  }
  system_getAllRoles {
    code
    remark
  }
}
```

6 getAllRoles req

```sh
curl 'http://localhost:9123/api/v1/role/all'
```

7 getAllRoles res

```json
[
  { "code": "admin", "remark": "" },
  { "code": "user", "remark": "" }
]
```

8 响应

```json
{
  "data": {
    "todo_findUniqueTodo": {
      "completed": false,
      "createdAt": "2022-12-31T16:00:01.000Z",
      "id": "2",
      "title": "This is Fireboom"
    },
    "system_getAllRoles": [
      {
        "code": "admin",
        "remark": ""
      },
      {
        "code": "user",
        "remark": ""
      }
    ]
  }
}
```

`8 响应` = `5 Query res(json)`+ `7 getAllRoles res`

注意：

- `2-5`和`6-7`两个流程并行执行，无先后顺序
- 等最慢的那个结果出来或超时后才会合并响应结果
