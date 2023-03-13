const express = require('express')
const router = express.Router()

const { get } = require('./router/get.js')
const { post } = require('./router/post.js')
const { put } = require('./router/put.js')
const { _delete } = require('./router/delete.js')

/**
 * @param $app { db, sendmail }
 */
function createRouter($app) {
  get(router, $app)
  post(router, $app)
  put(router, $app)
  _delete(router, $app)
  router.get('/', (req, res) => res.send('Server API working'))
  router.get('*', function(req, res) {
    res.status(404).send('not found')
  })
  return router
}

module.exports = {
  createRouter
}
