# wec

小程序组件库
1. 提供 ts + scss 编译支持
2. 自动根据组件 `properties` 属性或 DTS 文件等生成相关文档

## 开发
```shell
# npm i

npm run start:comp # 启动组件监听编译
npm run start:site # 启动文档生成
```

## 文档
### 配置
1. `packages/site/site.config.ts` 配置侧边栏，其中 `markdown` 属性为组价的说明文档
### 文档API
**`<API src="index.ts"></API>`**

可根据指定文件生成 `properties` 和 `events`

**`<Demo dirs="./demos"></Demo>`**

可指定 demo 的目录，会读取目录下所有的 markdown 文件并解析
