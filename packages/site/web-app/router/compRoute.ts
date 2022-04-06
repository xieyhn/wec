import type { Component } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { SiteConfig, CompSidebarItem } from '../../site.config'
import useAppStore from '@/store/app'
import { loadCompSidebarMenu } from '@/services/comp'
import DocContent from '@/components/DocContent/index.vue'
import LayoutComponent from '@/components/Layout/index.vue'
import { isDev } from '@/helper/common'
import RouteName from './RouteName'

function createHTMLComponent(name: string, html: string): Component{
  return { name, template: html }
}

export async function addCompRoute(router: Router) {
  const mainStore = useAppStore()

  if (!mainStore.compSidebarMenu) {
    mainStore.$patch({
      compSidebarMenu: isDev ? await loadCompSidebarMenu() : __COMP_SIDEBAR_MENU__.map(group => ({
        ...group,
        items: group.items.map(item => {
          // 删除 html 优化内存
          delete item.html
          return item
        })
      }))
    })
  }
  // 生产环境使用已编译好的 html
  let compSidebarInfo: SiteConfig['compSidebar'] = isDev ? mainStore.compSidebarMenu! : __COMP_SIDEBAR_MENU__
  const children: RouteRecordRaw[] = compSidebarInfo
    .reduce((menu, current) => menu.concat(current.items), [] as CompSidebarItem[])
    .map(item => ({
      name: item.name,
      path: item.name,
      component: isDev ? DocContent : createHTMLComponent(item.name, item.html!),
    }))
  const compRoute = {
    name: RouteName.Comp,
    path: '/comp',
    component: LayoutComponent,
    redirect: { name: children[0].name },
    children
  }
  router.addRoute(compRoute)
}