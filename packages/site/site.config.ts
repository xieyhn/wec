export interface CompSidebarItem {
  title: string,
  name: string,
  markdown: string,
  html?: string
}

export interface CompSidebarGroup {
  title: string,
  items: CompSidebarItem[]
}

export interface SiteConfig {
  compSidebar: CompSidebarGroup[]
}

const siteConfig: SiteConfig = {
  compSidebar: [
    {
      title: '开发指南',
      items: [
        {
          title: '介绍',
          name: 'home',
          markdown: 'docs/home.md'
        }
      ]
    },
    {
      title: '基础组件',
      items: [
        {
          title: '按钮',
          name: 'button',
          markdown: 'button/index.md'
        },
      ]
    }
  ]
}

export default siteConfig