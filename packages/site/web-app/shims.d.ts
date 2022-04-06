/* eslint-disable */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare let __MODE__: string

// 生产环境下的组件 sidebar 配置，并带有编译后的 html
declare let __COMP_SIDEBAR_MENU__: import('../site.config').SiteConfig['compSidebar']
