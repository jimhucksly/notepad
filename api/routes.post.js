const { generateVerifyCode, responseModify } = require('./utils.js')

function post(router, $app) {
  router.post('/signup', async (req, res, next) => {
    try {
      const { login, password, name, email } = req.body
      if (login && password && name && email) {
        await $app.db.command().user({ login, password, name, email }).signup()
        const user = await $app.db.query().user({ login }).get()
        const code = generateVerifyCode()
        await $app.db.command().user({ id: user.id, email }).setVerifyCode(code)
        await $app.sendmail(email, code)
        res.send({
          status: 'success',
          message: 'user created',
          user: {
            id: user.id,
            login,
            displayName: name,
            email
          }
        })
        return
      }
      throw new Error()
    } catch (e) {
      res.status(400).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }

  })
  router.post('/auth', async (req, res, next) => {
    try {
      const { login, password } = req.body
      if (login && password) {
        const user = await $app.db.command().user({ login, password }).signin()
        if (user) {
          const isWaitingVerify = await $app.db.query().verify({ userId: user.id }).get()
          if (isWaitingVerify) {
            user.waitingVerify = true
          }
          res.send({
            status: 'success',
            message: 'user authenticated',
            user: responseModify(user)
          })
          return
        }
      }
      throw new Error()
    } catch (e) {
      res.status(400).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
}

module.exports = {
  post
}