import nodemailer from 'nodemailer'
import { TemplateTypes } from './model'

async function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.beget.com',
    port: 465,
    secure: true,
    auth: {
      user: 'noreply@dn-web.ru',
      pass: 'vGqr3QX@vASKmm5~'
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  await new Promise((resolve, reject) => {
    transporter.verify(function(error: Error, success: boolean) {
      if (error) {
        reject(error)
      }
      resolve(success)
    })
  })

  const buildSubject = (templateType: TemplateTypes) => {
    switch (templateType) {
      case TemplateTypes.Verify:
        return 'Verify registration in Notepad App'
      case TemplateTypes.ResetPassword:
        return 'Reset password for Notepad App'
    }
  }

  const buildBody = (templateType: TemplateTypes, data: Record<string, unknown>) => {
    switch (templateType) {
      case TemplateTypes.Verify:
        return `
          <table style="width: 100%; background-color: #E6EBEC">
            <tr>
              <td style="padding: 15px 0"></td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 16px; color: #2766BA">Enter the received code in the appropriate field in the application</td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 4px;">${data.code}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0"></td>
            </tr>
          </table>
        `
      case TemplateTypes.ResetPassword:
        return `
          <table style="width: 100%; background-color: #E6EBEC">
            <tr>
              <td style="padding: 15px 0"></td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 16px; color: #2766BA">Your temporary password to access the app</td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 18px; letter-spacing: 1px;">${data.password}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0"></td>
            </tr>
          </table>
        `
    }
  }

  /**
   * @param {String} email
   * @param {String} templateType verify | resetPassword
   * @param {Object} data - данные для шаблона
  */
  const sendmail = async (email: string, templateType: TemplateTypes, data: Record<string, unknown>) => {
    const message = {
      from: 'noreply@dn-web.ru',
      to: email,
      subject: buildSubject(templateType),
      html: buildBody(templateType, data)
    }
    await new Promise((resolve, reject) => {
      transporter.sendMail(message, function(err: Error) {
        if (err) {
          reject(err)
        }
        resolve('email sent successfully')
      })
    })
  }

  return sendmail
}

export {
  createTransporter
}
