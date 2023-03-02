function generateVerifyCode() {
  let result = ''
  const dic = '1234567890'
  const len = 6
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return Number(result)
}

function generatePassword() {
  let result = ''
  const dic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890'
  const len = 16
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return result
}

function generateToken() {
  let result = ''
  const dic = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ'
  const len = 54
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return result
}

function isObj(item) {
  return Object.prototype.toString.call(item) === '[object Object]'
}

function isArr(item) {
  return Object.prototype.toString.call(item) === '[object Array]'
}

function isStr(item) {
  return typeof item === 'string'
}

function underscoreToCamelCase(str) {
  if (!str) {
    return str
  }
  return str
    .split('_')
    .filter(Boolean)
    .map((k, i) => i === 0 ? k : capitalize(k))
    .join('')
}

function capitalize(str) {
  if (!str) {
    return str
  }
  return str[0].toUpperCase() + str.substring(1)
}

function responseModify(response) {
  if (isObj(response)) {
    if ('pswd_md5' in response) {
      delete response.pswd_md5
    }
    Object.keys(response).forEach(key => {
      if (key.indexOf('_') > -1) {
        const newKey = underscoreToCamelCase(key)
        response[newKey] = response[key]
        delete response[key]
        key = newKey
      }
      response[key] = responseModify(response[key])
    })
    return response
  }
  if (isArr(response)) {
    response.forEach((item, i) => {
      response[i] = responseModify(item)
    })
    return response
  }
  if (isStr(response)) {
    return response.trim()
  }
  return response
}

async function checkHeaders(headers) {
  return new Promise((resolve, reject) => {
    if ('x-honeypot' in headers && headers['x-honeypot'] === 'App') {
      resolve()
    }
    reject(new Error('Forbidden'))
  })
}

async function checkToken(headers) {
  return new Promise((resolve, reject) => {
    if ('authorization' in headers && headers['authorization']) {
      resolve(headers['authorization'])
    }
    reject(new Error('Forbidden'))
  })
}

async function checkSession(headers) {
  return new Promise((resolve, reject) => {
    if ('ssid' in headers && headers['ssid']) {
      resolve(headers['ssid'])
    }
    reject(new Error('Forbidden'))
  })
}

function getErrorCode(text) {
  switch (text) {
    case 'Bad Request': return 400
    case 'Unauthorized': return 401
    case 'Payment Required': return 402
    case 'Forbidden': return 403
    case 'Not Found': return 404
    case 'Method Not Allowed': return 405
    case 'Not Acceptable': return 406
    case 'Proxy Authentication Required': return 407
    case 'Request Time-out': return 408
    case 'Conflict': return 409
    case 'Gone': return 410
    case 'Length Required': return 411
    case 'Precondition Failed': return 412
    case 'Request Entity Too Large': return 413
    case 'Request-URI Too Large': return 414
    case 'Unsupported Media Type': return 415
    case 'Internal Server Error': return 500
    case 'Not Implemented': return 501
    case 'Bad Gateway': return 502
    case 'Service Unavailable': return 503
    case 'Gateway Time-out': return 504
    case 'HTTP Version not supported': return 505
    default: return 400
  }
}

function emailSecurity(email) {
  const a = email.replace(/(.+)@(.+)/, '$1')
  const b = email.replace(/(.+)@(.+)/, '$2')
  if (a.length === 1) {
    return `**@${b}`
  }
  if (a.length === 2) {
    return `${a.slice(0, 1)}**@${b}`
  }
  return `${a.slice(0, 1)}**${a.slice(-1)}@${b}`
}

function dateFormat(date, format) {
  date = new Date(date)
  if (isNaN(date.getTime())) {
    return null
  }
  const y = date.getFullYear()
  const m = ('0' + date.getMonth()).slice(-2)
  const d = ('0' + date.getDate()).slice(-2)
  const hh = ('0' + date.getHours()).slice(-2)
  const mm = ('0' + date.getMinutes()).slice(-2)
  const ss = ('0' + date.getSeconds()).slice(-2)

  switch (format) {
    case 'YYYYMMDDHms':
      return `${y}${m}${d}${hh}${mm}${ss}`
  }
}

function getFileExtension(filename) {
  if (/d\.ts$/.test(filename)) {
    return filename.replace(/(.+)\.d\.([\w]{2,})$/, 'd.$2')
  }
  return filename.replace(/(.+)\.([\w]{2,})$/, '$2')
}

function getFileSize(bytes, decimals = 2) {
  if (!bytes) {
    return '0 Bytes';
  }
  if (typeof bytes === 'string') {
    bytes = Number(bytes);
  }
  if (Number.isNaN(bytes) || bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  generateVerifyCode,
  generatePassword,
  generateToken,
  responseModify,
  checkHeaders,
  checkToken,
  checkSession,
  getErrorCode,
  emailSecurity,
  dateFormat,
  getFileExtension,
  getFileSize
}
