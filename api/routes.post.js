const nodemailer = require('nodemailer')

function post(router, db) {
  router.post('/signup', async (req, res, next) => {
    try {
      const { login, pass, name, email } = req.body
      if (login && pass && name && email) {
        // await db.command().user({ login, pass, name, email }).signup()
        const transporter = nodemailer.createTransport({
          host: 'smtp.beget.com',
          port: 465,
          secure: true,
          auth: {
            user: 'noreply@dn-web.ru',
            pass: 'vGqr3QX@vASKmm5~',
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
          } else {
            const message = {
              from: 'noreply@dn-web.ru',
              to: email,
              subject: 'Message title !!!!!!',
              text: 'Plaintext version of the message',
              html: '<p>HTML version of the message</p>'
            };
            transporter.sendMail(message, function(err) {
              console.log(err)
            })
          }
        });
        res.send({
          status: 'success',
          message: 'user created'
        })
        return
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