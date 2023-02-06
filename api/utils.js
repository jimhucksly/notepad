function generateVerifyCode() {
  let result = ''
  const dic = '1234567890'
  const len = 6
  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }
  return Number(result)
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
    reject()
  })
}

module.exports = {
  generateVerifyCode,
  responseModify,
  checkHeaders
}
