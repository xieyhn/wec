import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { addCompRoute } from './compRoute'
import RouteName from './RouteName'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/comp' }
  ]
})

router.beforeEach(async (to) => {
  if (to.fullPath.startsWith(`/${RouteName.Comp}`) && !router.hasRoute(RouteName.Comp)) {
    await addCompRoute(router)
    return { path: to.fullPath }
  }
  return true
})

export default router
