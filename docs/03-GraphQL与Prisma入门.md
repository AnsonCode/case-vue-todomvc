# 03-GraphQL 与 Prisma 入门

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
