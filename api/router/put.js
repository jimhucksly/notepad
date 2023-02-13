const {
  responseModify,
  checkHeaders,
  checkSession,
  checkToken,
  getErrorCode
} = require('../utils.js')

function put(router, $app) {
  router.put('/project', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'notepad.json'
      const content = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      let key = ''
      Object.keys(req.body).forEach(k => { key = k })
      content[key] = req.body[key]
      const payload = Buffer.from(JSON.stringify(content))
      await $app.yandex.uploadFile(filename, payload, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        message: 'new project is successfully created',
        data: responseModify(req.body[key])
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.put('/library', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'library'
      const filename = req.body.name + '.md'
      let info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
      if (info._embedded.items) {
        let found = info._embedded.items.find(item => item.name === filename)
        if (found) {
          throw new Error('File with name "' + filename + '" is already exists')
        }
        await $app.yandex.uploadFile(path + '/' + filename, Buffer.from(''), user.yandex_disk_access_token)
        info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
        found = info._embedded.items.find(item => item.name === filename)
        if (found) {
          res.send({
            status: 'success',
            message: 'a new library file is successfully created',
            data: {
              id: found.resource_id
            }
          })
        } else {
          throw new Error('File creating failed')
        }
      } else {
        throw new Error('resource not found')
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
}

module.exports = {
  put
}