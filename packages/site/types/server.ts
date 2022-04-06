import type { SiteConfig } from '../site.config'
import Code from '../helper/Code'

export interface RequestResult<T> {
  code: Code,
  data: T,
  message?: string
}

// --------- api ---------
// getCompSidebarMenu
export interface GetCompSidebarMenuData {
  compSidebarMenu: SiteConfig['compSidebar']
}

// loadComponentDoc
export interface LoadComponentDocData {
  html: string
}

// --------- api ---------