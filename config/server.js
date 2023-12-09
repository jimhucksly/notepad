import { port } from './endpoint.json'

import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

function initServer() {
  const server = express()

  server.use(bodyParser.json())
  server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  server.get('*', function (req, res) {
    res.send('Server is started!')
  })

  server.post('/postman', async function (req, res) {
    try {
      const url = req.body.url.trim()
      if (!url) {
        throw new Error('Invalid URL')
      }

      const method = req.body.method.trim()
      if (!['GET', 'POST'].includes(method)) {
        throw new Error('Invalid Method: ' + method)
      }

      const headers = {}
      if (req.body.headers) {
        for (const h of req.body.headers) {
          headers[h.key] = h.value
        }
      }

      switch (method) {
        case 'GET':
          const { data: getResp } = await axios.get(url, {
            headers,
          })
          res.json(getResp)
          break;
        case 'POST':
          const body = JSON.parse(req.body.body);
          if (!body) {
            throw new Error('Bad Request')
          }
          const { data: postResp } = await axios.post(url, body, {
            headers
          })
          res.json(postResp)
          break;
      }

      res.json(req.body)
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  server.listen(Number(port) + 1)
}

export default initServer