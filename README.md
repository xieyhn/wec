# wec

使用在微信/企业微信小程序上的组件列表

## 开发准备
```shell
npm i
# 启动组件监听编译
npm run start:comp
# 启动文档服务
npm run start:site
```

# 指南
## 新建一个组件
按照约定，在 packages/components 目录下新建一个组件目录编写即可，为了配合文档的生成，约定使用 `ts` 文件来替代 `js` 文件，当前 `css` 可以选择使用 `scss` 和 `wxss`，但推荐一起使用 `scss`。

这是一个组件目录示例：

+ packages/components
  - button
    + index.ts
    + index.scss
    + index.wxml
    + index.json
    + [xxx.wxs]

在编写的过程中，会监听文件修改来生成到 /miniprogram_dist 目录，其中 
  + `ts` => `js` 使用的是 [Typescript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)，因为在项目其它地方也在使用 `typescript`，因此没有使用 `esbuild` 等构建库
  + `scss` => `wxss` 使用的是 [Sass](https://github.com/sass/sass)

代码的实现在 `scripts/ComponentCompiler.ts`

## 编写组件文档
约定在组件目录中新建一个 markdown 文件，如 `index.md`，使用其语法编写组件的文档，其中有内置两个标签

+ `<API></API>`
+ `<DEMO></DEMO>`

其中 Markdown 语法的解析和扩展是基于 [marked](https://github.com/markedjs/marked) 实现的

### `API`标签
该标签可以通过  `src` 属性来加载组件的 `ts` 或指定的 DTS 文件，以此来加载组件的 `Properties` 和 `Events` 最终生成这部分的文档，下面是一个示例

```ts
// index.ts

// 需要主动声明一个名为 `Events` 的接口来描述当前组件会往外发布的事件信息
interface Events {
  /**
   * 这是一个事件的备注
   */
  change: { index: string }
}

// 默认会找当前文件的 `Component` 方法调用，并找一个实参对象的 `properties` 属性来读取当前组件的 properties
Component({
  properties: {
    /**
     * 当前值
     */
    value: String,
  }
})

// 也可以通过 JSDOCTag 的方式来标明 properties
/** @WComponent */
MyComponent({
  /** @WComponentProperties */
  props: {
    // ...
  }
})

```

会生成：

**Properties**

| 属性名 | 说明   | 类型   | 默认值 |
| ------ | ------ | ------ | ------ |
| value  | 当前值 | String |        |

**Events**

| 事件名 | 说明                                                   | 回调参数           |
| ------ | ------------------------------------------------------ | ------------------ |
| change | 这是一个事件的备注这是一个事件的备注这是一个事件的备注 | { index: string; } |

通过[Typescript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)完成。

### `DEMO`标签
该标签可理解为会在入口说明文档说嵌入一个子文档，例如可以描述一些使用案例，其 `dirs` 属性指明 demo 存在的目录，下面是一个使用实例

demos/one.md

````markdown
---
order: 0
title: 这是第一个示例，根据提供的 order 属性排在第一个
---

```js
这是第一个示例

import dayjs from 'dayjs'

dayjs.format('YYYY')
```
````

demos/two.md

````markdown
---
order: 1
title: 这是第一个示例，根据提供的 order 属性排在第二个
---

这是第二个示例

```js
import dayjs from 'dayjs'

dayjs.format('YYYY')
```
````

index.md
````markdown
# 组件1
## 使用实例
<Demo dirs="./demos"></Demo>
````
会生成：

````markdown
# 组件1
## 使用实例
**这是第一个示例，根据提供的 order 属性排在第一个**

这是第一个示例

```js
import dayjs from 'dayjs'

dayjs.format('YYYY')
```
**这是第一个示例，根据提供的 order 属性排在第二个**

这是第二个示例

```js
import dayjs from 'dayjs'

dayjs.format('YYYY')
```
````

## 配置组件文档

配置侧边栏的显示在 `packages/site/site.config.ts`，其中 `markdown` 属性为指定组件的使用文档

+ 若以 `docs` 开头，则会去 `packages/site/docs` 目录寻找后面的路径
+ 否则，会去 `packages/components` 目录寻找后面的路径