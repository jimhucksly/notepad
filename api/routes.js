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
  router.get('/', (req, res) => res.send('Server API working'))
  router.get('*', function(req, res) {
    res.status(404).send('not found')
  })
  return router
}

module.exports = {
  createRouter
}
