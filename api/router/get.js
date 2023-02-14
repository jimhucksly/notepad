const {
  checkHeaders,
  checkToken,
  checkSession,
  getErrorCode,
  responseModify
} = require('../utils.js')

function get(router, $app) {
  router.get('/session', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const ssid = await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      await $app.db.command().session(ssid).bindToUser({ id: user.id })
      res.send({
        status: 'success',
        data: responseModify(user)
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/projects', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'notepad.json'
      const content = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        data: content
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/projects/archives', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'archives'
      const info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
      if (info._embedded.items.length) {
        const result = info._embedded.items.map(item => {
          const name = item.name.replace(/(.+)(\_\(datetime\))(.+)(\.html)/g, '$1')
          const date = item.name.replace(/(.+)(\_\(datetime\))(.+)(\.html)/g, '$3')
          return {
            name,
            date,
            id: item.resource_id
          }
        })
        res.send({
          status: 'success',
          data: result
        })
        return
      }
      res.send({
        status: 'success',
        data: []
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/library', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'library'
      let filename = 'main.md'
      if (req.query.id) {
        const info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
        if (info._embedded.items) {
          const found = info._embedded.items.find(el => el.resource_id === req.query.id)
          console.log('found', found)
          if (found) {
            filename = found.name
          } else {
            throw new Error('resource not found')
          }
        } else {
          throw new Error('resource not found')
        }
      }
      const content = await $app.yandex.downloadFile(path + '/' + filename, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        data: content
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/library/list', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'library'
      const info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
      if (info._embedded.items) {
        res.send({
          status: 'success',
          data: info._embedded.items.map(el => ({ id: el.resource_id, name: el.name})).sort((a, b) => a.name === 'main.md' ? -1 : 1)
        })
        return
      }
      throw new Error('resource not found')
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/links', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'links.json'
      const content = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        data: Object.keys(content).length
          ? Object.keys(content).map(key => ({ id: key, name: content[key].name, url: content[key].url }))
          : []
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/events', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'events.json'
      const content = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        data: content
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.get('/todo', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'todo.json'
      const content = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        data: content
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
}

module.exports = {
  get
}