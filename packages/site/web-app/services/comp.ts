import type { RequestResult, LoadComponentDocData, GetCompSidebarMenuData } from '../../types/server'
import resultAssert from '@/helper/resultAssert'
import request from '@/helper/request'

export async function loadComponentDoc(name: string) {
  const result = await resultAssert(request.post<any, RequestResult<LoadComponentDocData>>('/loadComponentDoc', {
    name
  }))
  return result
}

export async function loadCompSidebarMenu() {
  const { compSidebarMenu } = await resultAssert(
    request.get<any, RequestResult<GetCompSidebarMenuData>>('/getCompSidebarMenu')
  )
  return compSidebarMenu
}
