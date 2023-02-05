const express = require('express')
const router = express.Router()

const { get } = require('./routes.get.js')
const { post } = require('./routes.post.js')

/**
 * @param $app { db, sendmail }
 */
function createRouter($app) {
  get(router, $app)
  post(router, $app)
  return router
}

module.exports = {
  createRouter
}
