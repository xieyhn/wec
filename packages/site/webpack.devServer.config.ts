import type { Configuration } from 'webpack-dev-server'
import { register } from './server/index'

const devServerConfig: Configuration = {
  setupMiddlewares(middlewares, devServer) {
    const { app } = devServer
    if (app) register(app)
    return middlewares
  }
}

export default devServerConfig
