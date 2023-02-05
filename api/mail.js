const nodemailer = require('nodemailer')

async function createTransporter() {
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

  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        reject(error)
      }
      resolve()
    })
  })

  const buildBody = (code) => {
    return `
      <table style="width: 100%; background-color: #E6EBEC">
        <tr>
          <td style="padding: 15px 0"></td>
        </tr>
        <tr>
          <td style="text-align: center; font-size: 16px; color: #2766BA">Enter the received code in the appropriate field in the application</td>
        </tr>
        <tr>
          <td style="text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 4px;">${ code }</td>
        </tr>
        <tr>
          <td style="padding: 15px 0"></td>
        </tr>
      </table>
    `
  }

  const sendmail = async (email, code) => {
    const message = {
      from: 'noreply@dn-web.ru',
      to: email,
      subject: 'Verify registration in Notepad App',
      html: buildBody(code)
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(message, function(err) {
        if (err) {
          reject(err)
        }
        resolve('email sent successfully')
      })
    })
  }

  return sendmail
}

module.exports = {
  createTransporter
}