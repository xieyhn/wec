import type { Application } from 'express'
import bodyParser from 'body-parser'
import router from './routes'

export function register(app: Application) {
  app.use(bodyParser.json())

  app.use(router)
}