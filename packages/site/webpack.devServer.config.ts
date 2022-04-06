import type { Configuration } from 'webpack-dev-server'
import type { LoadComponentDocData, GetCompSidebarMenuData } from './types/server'
import bodyParser from 'body-parser'
import parseComponentDoc from './parsers/parseComponentDoc'
import Result from './helper/Result'
import { SiteConfig } from './site.config'

const devServerConfig: Configuration = {
  setupMiddlewares(middlewares, devServer) {
    const { app } = devServer

    app!.use(bodyParser.json())

    app!.get('/getCompSidebarMenu', (req, res) => {
      delete require.cache[require.resolve('./site.config')]
      const { default: { compSidebar } } = require('./site.config') as { default: SiteConfig }
      res.send(Result.success<GetCompSidebarMenuData>({ compSidebarMenu: compSidebar }))
    })

    app!.post('/loadComponentDoc', async (req, res) => {
      const { name } = req.body as { name: string }
      try {
        res.send(Result.success<LoadComponentDocData>({ html: await parseComponentDoc({ name }) }))
      } catch (err) {
        res.send(Result.fail(err as Error))
      }
    })

    return middlewares
  }
}

export default devServerConfig
