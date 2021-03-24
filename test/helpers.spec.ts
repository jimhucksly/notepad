import { htmlToText, checkLinks } from '../src/helpers/index'

const html = 'My site <br><a href=\"http:\/\/dn-web.ru\" target=\"_blank\">http:\/\/dn-web.ru<\/a>'
const text = 'My site \nhttp://dn-web.ru'

describe('Helpers', () => {
  it('htmlToText', () => {
    expect(htmlToText(html)).toEqual(text)
  })

  it('checkLinks', () => {
    expect(checkLinks(text)).toEqual(html)
  })
})