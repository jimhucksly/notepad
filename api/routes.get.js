const {
  checkHeaders,
  checkToken,
  checkSession,
  getErrorCode,
  responseModify
} = require('./utils.js')

function get(router, $app) {
  router.get('/session', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const token = await checkToken(req.headers)
      const ssid = await checkSession(req.headers)
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
}

module.exports = {
  get
}