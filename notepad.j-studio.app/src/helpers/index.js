
const REGEXP_URL = /\b(^(ftp|https?):\/\/[-\w]+(\.\w[-\w]*)+|(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\.)+(?: com\b|edu\b|biz\b|gov\b|in(?:t|fo)\b|mil\b|net\b|org\b|[a-z][a-z]\b))(\:\d+)?(\/[^.!,?;"'<>()\[\]{}\s\x7F-\xFF]*(?:[.!,?]+[^.!,?;"'<>()\[\]{}\s\x7F-\xFF]+)*)?/

export const checkLinks = (message) => {
  let m = message.replace(/\n/g, '<br>').split('<br>')
  m.forEach((str, i) => {
    let p = str.split(' ')
    p.forEach((item, k) => {
      if((new RegExp(REGEXP_URL)).test(item)) {
        item = '<a href="' + (item.indexOf('http') < 0 ? 'http://' : '') + item + '" target="_blank">' + item + '</a>'
        p[k] = item
      }
    })
    m[i] = p.join(' ')
  })
  return m.join('<br>')
}

export const now = () => {
  let d = new Date()
  let y = d.getFullYear()
  let mon = d.getMonth()
  let day = d.getDate()
  let h = d.getHours()
  let mm = d.getMinutes()
  let s = d.getSeconds()

  mon = (mon + 1) < 10 ? '0' + (mon + 1) : (mon + 1)
  day = day < 10 ? '0' + day : day
  h = h < 10 ? '0' + h : h
  mm = mm < 10 ? '0' + mm : mm
  s = s < 10 ? '0' + s : s

  return {
    date: `${day}.${mon}.${y}, ${h}:${mm}`,
    stamp: `${y}${mon}${day}${h}${mm}${s}`
  }
}

export const isJSON = (str) => {
  try {
    var obj = JSON.parse(str)
    if(obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch (err) {}
  return false
}
