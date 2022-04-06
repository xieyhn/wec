import { defineStore } from 'pinia'
import type { SiteConfig } from '../../site.config'

const useAppStore = defineStore('app', {
  state: () => {
    return {
      // 左侧侧边栏菜单
      compSidebarMenu: null as SiteConfig['compSidebar'] | null
    }
  }
})

export default useAppStore
