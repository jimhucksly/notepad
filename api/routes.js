const express = require('express')
const router = express.Router()

const { get } = require('./routes.get.js')
const { post } = require('./routes.post.js')

function createRouter(db) {
  get(router, db)
  post(router, db)
  return router
}

module.exports = {
  createRouter
}
