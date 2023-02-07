const {
  generateVerifyCode,
  generatePassword,
  generateToken,
  responseModify,
  checkHeaders,
  getErrorCode,
  emailSecurity
} = require('./utils.js')

function post(router, $app) {
  router.post('/signup', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const { login, password, name, email } = req.body
      if (login && password && name && email) {
        await $app.db.command().user({ login, password, name, email }).signup()
        const user = await $app.db.query().user({ login }).get()
        const code = generateVerifyCode()
        await $app.db.command().user({ id: user.id, email }).setVerifyCode(code)
        await $app.sendmail(email, 'verify', { code })
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
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }

  })
  router.post('/auth', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const { login, password } = req.body
      if (login && password) {
        await $app.db.command().user({ login, password }).signin()
        const user = await $app.db.query().user({ login }).get()
        if (user) {
          const isWaitingVerify = await $app.db.query().verify({ userId: user.id }).get()
          if (isWaitingVerify) {
            user.waitingVerify = true
            res.send({
              status: 'success',
              message: 'user authenticated',
              user: responseModify(user)
            })
          }
          const token = generateToken()
          await $app.db.command().user({ id: user.id }).setToken(token)
          user.token = token
          res.send({
            status: 'success',
            message: 'user authenticated',
            user: responseModify(user)
          })
          return
        }
        throw new Error('user not found')
      }
      throw new Error()
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.post('/verify', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const { userId, code } = req.body
      if (userId && code) {
        const isVerifySuccess = await $app.db.query().verify({ userId }).check(code)
        if (isVerifySuccess) {
          await $app.db.command().verify({ userId }).delete()
          res.send({
            status: 'success',
            message: 'user successfully verified'
          })
        } else {
          res.send({
            status: 'error',
            message: 'verify code is invalid'
          })
        }
        return
      }
      throw new Error()
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.post('/resend', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const { userId } = req.body
      if (userId) {
        const user = await $app.db.query().user({ id: userId }).get()
        const code = generateVerifyCode()
        await $app.db.command().user({ id: user.id }).resetVerifyCode(code)
        await $app.sendmail(user.email, 'verify', { code })
        res.send({
          status: 'success',
          message: 'code was been sent',
          user: responseModify(user)
        })
        return
      }
      throw new Error()
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.post('/reset', async (req, res, next) => {
    try {
      await checkHeaders(req.headers)
      const { email } = req.body
      if (email) {
        const user = await $app.db.query().user({ login: email, email, }).search()
        const password = generatePassword()
        await $app.db.command().user({ id: user.id }).setTempPassword(password)
        await $app.sendmail(user.email, 'resetPassword', { password })
        console.log()
        res.send({
          status: 'success',
          message: 'success',
          email: emailSecurity(user.email)
        })
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
  post
}