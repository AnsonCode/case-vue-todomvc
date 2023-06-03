# 05-文件上传及 SDK 对接

## 文件上传

1. S3 配置
2. Profile 配置
3. 上传测试

## 客户端对接

支持

## SDK 对接

将 SDK 生成到指定目录~

改造接入方式

## 应用改造

1.为 TODO 表增加 `image_urls` 字段，类型为 `JSON`

```diff prisma
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
+ image_urls JSON
}
```

2.修改创建待做事项接口为

```

```
