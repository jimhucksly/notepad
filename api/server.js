const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./database.js')

const { createServer } = require('./socket.js')
const { createRouter } = require('./routes.js')
const { createTransporter } = require('./mail.js')
const { createYandexDiskApi } = require('./yandex.js')

async function startApp() {
  try {
    const app = express()
    const $app = {
      db,
      sendmail: await createTransporter(),
      yandex: await createYandexDiskApi(db)
    }
    const routes = createRouter($app)

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Honeypot");
      next();
    });

    app.use('/', routes);

    createServer(http.createServer(app))
  } catch (e) {
    console.log(e)
  }
}

startApp()
