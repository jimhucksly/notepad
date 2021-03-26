import {
  htmlToText,
  checkLinks,
  now,
  isJSON,
  getFileType,
  translit,
  indexOf
} from '../src/helpers/index'

const html = 'My site <br><a href=\"http:\/\/dn-web.ru\" target=\"_blank\">http:\/\/dn-web.ru<\/a>'
const text = 'My site \nhttp://dn-web.ru'

describe('Helpers', () => {
  it('htmlToText', () => {
    expect(htmlToText(html)).toEqual(text)
  })

  it('checkLinks', () => {
    expect(checkLinks(text)).toEqual(html)
  })

  it('now', () => {
    const { date } = now('20180506144311')
    expect(date).toEqual('06.05.2018, 14:43')
  })

  it('isJSON', () => {
    const json = '{"winter": "is coming"}'
    expect(isJSON(json)).toBe(true)
    expect(isJSON('')).toBe(false)
  })

  it('getFileType', () => {
    const fileName = 'file.pdf'
    expect(getFileType(fileName)).toEqual('pdf')
  })

  it('translit', () => {
    const target = 'перекресток'
    expect(translit(target)).toEqual('perekrestok')
  })

  it('indexOf', () => {
    const html = '<ul><li class="a">A</li><li class="b">B</li><li class="c">C</li></ul>'
    const div = document.createElement('div')
    div.innerHTML = html
    const li = div.querySelector('.a') as HTMLElement
    expect(indexOf(li)).toEqual(0)
  })
})
