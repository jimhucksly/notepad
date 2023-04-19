import express, { Request, Response, NextFunction } from 'express'
import fileUpload from 'express-fileupload'
import http from 'http'
import bodyParser from 'body-parser'
import db from './database'
import scheduler from './scheduler'
import { createServer } from './socket'
import { createRouter } from './routes'
import { createTransporter } from './mail'
import { createYandexDiskApi } from './yandex'
import { IApp } from './model'

async function startApp() {
  try {
    const app = express()
    const $app: IApp = {
      db,
      sendmail: await createTransporter(),
      yandex: await createYandexDiskApi(db)
    }
    const routes = createRouter($app)

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(fileUpload({ createParentPath: true }))

    app.use(function(req: Request, res: Response, next: NextFunction) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Honeypot, SSID')
      next()
    })

    app.use('/', routes)

    createServer(http.createServer(app), $app)
    scheduler($app).start(1000 * 60 * 60 * 24 * 7 /* 1 week */)
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e)
  }
}

startApp()
