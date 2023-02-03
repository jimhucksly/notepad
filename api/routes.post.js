function post(router, db) {
  router.post('/signup', async (req, res, next) => {
    try {
      const { login, pass, name, email } = req.body
      if (login && pass && name && email) {
        await db.command().user({ login, pass, name, email }).signup()
        res.send({
          status: 'success',
          message: 'user created'
        })
      }
      throw new Error('bad request')
    } catch (e) {
      res.status(400).send({
        status: 'error',
        message: e?.message
      })
    }

  })
  router.post('/auth', (req, res, next) => {
    res.send('hello')
  })
}

module.exports = {
  post
}