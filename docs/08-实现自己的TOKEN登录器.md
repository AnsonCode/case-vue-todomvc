# 授权登录：基于 TOKEN

获取 token

https://doc.laf.run/guide/quick-start/login.html

## REST API 实现

## GraphQL API 实现

## 钩子实现

内部钩子调用

## 用户注册

```TS
import cloud from "@lafjs/cloud";
import { createHash } from "crypto";

export default async function (ctx: FunctionContext) {
  const username = ctx.body?.username || "";
  const password = ctx.body?.password || "";

  // check param
  if (!/[a-zA-Z0-9]{3,16}/.test(username)) return { error: "invalid username" };
  if (!/[a-zA-Z0-9]{3,16}/.test(password)) return { error: "invalid password" };

  // check username existed
  const db = cloud.database();
  const exists = await db
    .collection("users")
    .where({ username: username })
    .count();

  if (exists.total > 0) return { error: "username already existed" };

  // add user
  const { id } = await db.collection("users").add({
    username: username,
    password: createHash("sha256").update(password).digest("hex"),
    created_at: new Date(),
  });

  console.log("user registered: ", id);
  return { data: id };
};
```

## 用户登录

```TS
import cloud from "@lafjs/cloud";
import { createHash } from "crypto";

export default async function (ctx: FunctionContext) {
  const username = ctx.body?.username || "";
  const password = ctx.body?.password || "";

  // check user login
  const db = cloud.database();
  const res = await db
    .collection("users")
    .where({
      username: username,
      password: createHash("sha256").update(password).digest("hex"),
    })
    .getOne();

  if (!res.data) return { error: "invalid username or password" };

  // generate jwt token
  const user_id = res.data._id;
  const payload = {
    uid: user_id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };

  const access_token = cloud.getToken(payload);

  return {
    uid: res.data._id,
    access_token: access_token,
  };
};
```

##
