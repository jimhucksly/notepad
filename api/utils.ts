import { IncomingHttpHeaders } from 'http'

function generateVerifyCode(): number {
  let result = ''
  const dic = '1234567890'
  const len = 6
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return Number(result)
}

function generatePassword(): string {
  let result = ''
  const dic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890'
  const len = 16
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return result
}

function generateToken(): string {
  let result = ''
  const dic = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ'
  const len = 54
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return result
}

function isObj(item: unknown): boolean {
  return Object.prototype.toString.call(item) === '[object Object]'
}

function isArr(item: unknown): boolean {
  return Object.prototype.toString.call(item) === '[object Array]'
}

function isStr(item: unknown): boolean {
  return typeof item === 'string'
}

function underscoreToCamelCase(str: string): string {
  if (!str) {
    return str
  }
  return str
    .split('_')
    .filter(Boolean)
    .map((k, i) => i === 0 ? k : capitalize(k))
    .join('')
}

function capitalize(str: string): string {
  if (!str) {
    return str
  }
  return str[0].toUpperCase() + str.substring(1)
}

function responseModify(response: unknown): unknown {
  if (isObj(response)) {
    ['pswd_md5', 'temp_pswd_md5'].forEach(key => {
      if (key in (response as Record<string, unknown>)) {
        delete response[key]
      }
    })
    Object.keys(response).forEach(key => {
      if (key.indexOf('_') > -1) {
        const newKey = underscoreToCamelCase(key)
        response[newKey] = response[key]
        delete response[key]
        key = newKey
      }
      response[key] = responseModify(response[key] as Record<string, unknown>)
    })
    return response
  }
  if (isArr(response)) {
    (response as Array<unknown>).forEach((item, i) => {
      response[i] = responseModify(item)
    })
    return response
  }
  if (isStr(response)) {
    return (response as string).trim()
  }
  return response
}

async function checkHeaders(headers: IncomingHttpHeaders): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if ('x-honeypot' in headers && headers['x-honeypot'] === 'App') {
      resolve(true)
    }
    reject(new Error('Forbidden'))
  })
}

async function checkToken(headers: Record<string, unknown>): Promise<string> {
  return new Promise((resolve, reject) => {
    if ('authorization' in headers && headers['authorization']) {
      resolve(headers['authorization'] as string)
    }
    reject(new Error('Forbidden'))
  })
}

async function checkSession(headers: IncomingHttpHeaders): Promise<string> {
  return new Promise((resolve, reject) => {
    if ('ssid' in headers && headers['ssid']) {
      resolve(headers['ssid'] as string)
    }
    reject(new Error('Forbidden'))
  })
}

function getErrorCode(text: string): number {
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

function emailSecurity(email: string): string {
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

function dateFormat(date: string | Date, format: string): string {
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
    default:
      return null
  }
}

function getFileExtension(filename: string) {
  if (/d\.ts$/.test(filename)) {
    return filename.replace(/(.+)\.d\.([\w]{2,})$/, 'd.$2')
  }
  return filename.replace(/(.+)\.([\w]{2,})$/, '$2')
}

function getFileSize(bytes: string | number, decimals: number = 2) {
  if (!bytes) {
    return '0 Bytes'
  }
  if (typeof bytes === 'string') {
    bytes = Number(bytes)
  }
  if (Number.isNaN(bytes) || bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = decimals <= 0 ? 0 : decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export {
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
