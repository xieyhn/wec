import path from 'path'
import fs from 'fs-extra'
import marked from './marked/index'
import { CompSidebarItem } from '../site.config'
import { setCurrentParseFilepath } from './marked/helper'
import { getCompilerOptions } from '../helper/CompilerOptions'
import requireSiteConfig from '../helper/requireSiteConfig'

async function parseComponentDoc(
  { name, markdown }: { name?: string, markdown?: string }
): Promise<string> {
  if (!name && !markdown) return ''
  if (!markdown) {
    const siteConfig = requireSiteConfig()
    const menuItem = 
      siteConfig
      .compSidebar
      .reduce((menu, current) => menu.concat(current.items), [] as CompSidebarItem[])
      .find(item => item.name === name)
    if (!menuItem) return ''
    markdown = menuItem.markdown
  }
  let mdPath = ''
  if (markdown.startsWith('docs')) {
    mdPath = path.resolve(__dirname, '../', markdown)
  } else {
    mdPath = path.resolve(getCompilerOptions().compsDir, markdown)
  }
  if (!(await fs.pathExists(mdPath)) || !fs.statSync(mdPath).isFile()) return ''

  setCurrentParseFilepath(mdPath)
  
  return marked.parse(
    await fs.readFile(mdPath, { encoding: 'utf-8' })
  )
}

export default parseComponentDoc