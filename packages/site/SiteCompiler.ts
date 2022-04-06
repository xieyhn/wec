import { webpack, DefinePlugin, Configuration as WebpackConfiguration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config'
import devServerConfig from './webpack.devServer.config'
import siteConfig from './site.config'
import parseComponentDoc from './parsers/parseComponentDoc'
import { setCompilerOptions, CompilerOptions } from './helper/CompilerOptions'

class SiteCompiler {
  private options: CompilerOptions

  constructor(options: CompilerOptions) {
    this.options = options
  }

  async compile(options: { watch?: boolean } = {}) {
    setCompilerOptions(this.options)
    webpackConfig.output!.path = this.options.distDir
    if (!options.watch) {
      await this.defines(webpackConfig)
    }
    const compiler = webpack(webpackConfig)
    if (options.watch) {
      const server = new WebpackDevServer(devServerConfig, compiler)
      server.start()
      return
    }
    compiler.run((err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      if (stats) {
        console.log(stats.toString({ colors: true }))
      }
    })
  }

  async defines(webpackConfig: WebpackConfiguration) {
    for (let group of siteConfig.compSidebar) {
      for(let item of group.items) {
        item.html = await parseComponentDoc({ markdown: item.markdown })
      }
    }
    webpackConfig.plugins!.push(new DefinePlugin({
      __COMP_SIDEBAR_MENU__: JSON.stringify(siteConfig.compSidebar),
    }))
  }
}

export default SiteCompiler
