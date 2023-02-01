const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./database.js')

const { createServer } = require('./socket.js')
const { createRouter } = require('./routes.js');

const app = express()

const routes = createRouter(db)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Honeypot");
  next();
});

app.use('/', routes);

createServer(http.createServer(app))