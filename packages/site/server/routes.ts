import express from 'express'
import requireSiteConfig from '../helper/requireSiteConfig'
import Result from '../helper/Result'
import parseComponentDoc from '../parsers/parseComponentDoc'
import type { LoadComponentDocData, GetCompSidebarMenuData } from '../types/server'

const router = express.Router()

/**
 * 获取组件侧边栏配置
 */
router.get('/getCompSidebarMenu', (req, res) => {
  res.send(Result.success<GetCompSidebarMenuData>({ compSidebarMenu: requireSiteConfig().compSidebar }))
})

/**
 * 加载组件文档
 * // TODO: 设置已加载缓存
 */
router.post('/loadComponentDoc', async (req, res) => {
  const { name } = req.body as { name: string }
  try {
    res.send(Result.success<LoadComponentDocData>({ html: await parseComponentDoc({ name }) }))
  } catch (err) {
    res.send(Result.fail(err as Error))
  }
})

export default router