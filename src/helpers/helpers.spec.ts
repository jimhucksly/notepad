import { isJSON } from '@dn-web/core';
import { checkLinks, htmlToText, indexOf, now, translit } from './index';

const html = 'My site <br><a href=\\"http:\\/\\/dn-web.ru\\" target=\\"_blank\\">http:\\/\\/dn-web.ru<\\/a>';
const text = 'My site \nhttp://dn-web.ru';

describe('Helpers', () => {
  it('htmlToText', () => {
    expect(htmlToText(html)).toEqual(text);
  });

  it('checkLinks', () => {
    expect(checkLinks(text)).toEqual(html);
  });

  it('now: with stamp', () => {
    const { date } = now('20180506144311');
    expect(date).toEqual('06.05.2018, 14:43');
  });

  it('now: without stamp', () => {
    const { date, stamp } = now();
    expect(typeof date).toEqual('string');
    expect(typeof stamp).toEqual('string');
  });

  it('isJSON', () => {
    const json = '{"winter":"is comming"}';
    expect(isJSON(json)).toBe(true);
    try {
      isJSON('');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('translit', () => {
    const target = 'перекресток';
    expect(translit(target)).toEqual('perekrestok');
  });

  it('indexOf', () => {
    const content = '<ul><li class="a">A</li><li class="b">B</li><li class="c">C</li></ul>';
    const div = document.createElement('div');
    div.innerHTML = content;
    const li: HTMLElement = div.querySelector('.a');
    expect(indexOf(li)).toEqual(0);
  });
});
