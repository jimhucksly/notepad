import { ActionTree } from 'vuex'

const REGEXP_URL = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
export const REGEXP_LOGIN = /^[a-zA-Z\d\_]{1,}$/g
export const REGEXP_EMAIL = /.+@.+\..+/i
export const REGEXP_PASS = /^[a-zA-Z\d\_\*\?\!\.\,\(\)\=\+\\)]{1,}$/g
export const REGEXP_NAME = /^[a-zA-Zа-яА-ЯёЁ\D \-]{1,}$/g

export const htmlToText = (html: string): string => {
  if (!html) {
    return ''
  }
  const div = document.createElement('div')
  div.innerHTML = html
  const urls = div.querySelectorAll('a')
  urls.length && urls.forEach((el: HTMLAnchorElement) => {
    const href: string = el.href.replace(/\/$/, '')
    const a = div.querySelector(`a[href="${href}"]`)
    if (a) {
      const p = document.createElement('p')
      p.innerHTML = href
      a.parentNode.insertBefore(p, a)
      a.remove()
    }
  })
  const marks = div.querySelectorAll('mark')
  marks.length && marks.forEach((el: HTMLElement) => {
    const p = document.createElement('p')
    p.innerHTML = '###' + el.innerHTML
    div.insertBefore(p, el)
    el.remove()
  })
  return div.innerHTML.replace(/<br\/?>/g, '\n').replace(/<\/?p\/?>/g, '')
}

export const checkLinks = (message: string): string => {
  const m: string[] = message.replace(/\n/g, '<br>').split('<br>')
  m.forEach((str, i) => {
    const p = str.split(' ')
    p.forEach((item, k) => {
      const isEmail = new RegExp(REGEXP_EMAIL).test(item)
      if (isEmail) {
        p[k] = item
        return
      }
      const isURL = new RegExp(REGEXP_URL).test(item)
      if (isURL) {
        if (item.indexOf('###') === 0) {
          item = item.replace(/^\#\#\#/, '')
          item = '<mark>' + item + '</mark>'
          p[k] = item
          return
        }
        item = '<a href="' + (item.indexOf('http') < 0 ? 'http://' : '') + item + '" target="_blank">' + item + '</a>'
        p[k] = item
      }
    })
    m[i] = p.join(' ')
  })
  return m.join('<br>')
}

export const now = (stamp?: string): { date: string, stamp: string } => {
  let st = ''
  if (stamp) {
    st = stamp.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/g, '$1-$2-$3 $4:$5:$6')
  }
  const d = st ? new Date(st) : new Date()
  const y = d.getFullYear()
  if (isNaN(y)) {
    return null
  }
  let mon: string | number = d.getMonth()
  let day: string | number = d.getDate()
  let h: string | number = d.getHours()
  let mm: string | number = d.getMinutes()
  let s: string | number = d.getSeconds()

  mon = ('0' + (mon + 1)).slice(-2)
  day = ('0' + day).slice(-2)
  h = ('0' + h).slice(-2)
  mm = ('0' + mm).slice(-2)
  s = ('0' + s).slice(-2)

  return {
    date: `${day}.${mon}.${y}, ${h}:${mm}`,
    stamp: stamp || `${y}${mon}${day}${h}${mm}${s}`
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const isJSON = (value: any): boolean => {
  let json: Record<string, unknown>
  if (typeof value === 'string') {
    try {
      json = JSON.parse(value)
      return true
    } catch (e) {
      //
    }
  } else {
    try {
      json = JSON.parse(JSON.stringify(value))
      if (json && typeof json === 'object' && json !== null) {
        return true
      }
    } catch (e) {
      //
    }
  }
  return false
}

export const getFileType = (name: string): string => {
  if (/jpe?g$/.test(name)) return 'jpg'
  if (/png$/.test(name)) return 'png'
  if (/gif$/.test(name)) return 'image'
  if (/html?$/.test(name)) return 'html'
  if (/js$/.test(name)) return 'js'
  if (/d.ts$/.test(name)) return 'dts'
  if (/ts$/.test(name)) return 'ts'
  if (/json$/.test(name)) return 'json'
  if (/vue$/.test(name)) return 'vue'
  if (/(sass|scss)$/.test(name)) return 'sass'
  if (/css$/.test(name)) return 'css'
  if (/svg$/.test(name)) return 'svg'
  if (/docx?$/.test(name)) return 'doc'
  if (/pdf$/.test(name)) return 'pdf'
  if (/txt$/.test(name)) return 'txt'
  if (/zip$/.test(name)) return 'zip'
  if (/rar$/.test(name)) return 'rar'
  if (/md$/.test(name)) return 'md'
  if (/7z$/.test(name)) return '7z'
  if (/xlsx?$/.test(name)) return 'xls'
  if (/exe?$/.test(name)) return 'exe'
  if (/msi?$/.test(name)) return 'msi'
  if (/cer?$/.test(name)) return 'cer'
  if (/pfx?$/.test(name)) return 'pfx'

  return 'default'
}

export function dragAndDropLoader(
  DOMElementId: string,
  CSSClassHighlight: string,
  Callback: (e: InputEvent | DragEvent) => void
): void {
  const id = DOMElementId
  const cls = CSSClassHighlight
  const cb = Callback

  const dropArea = document.getElementById(id)

  if (dropArea) {
    if (!dropArea.style.position) {
      dropArea.style.position = 'relative'
    }
    const overlay = document.createElement('div')
    overlay.classList.add('drop-overlay')
    dropArea.appendChild(overlay)

    dropArea.ondragenter = function(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      if (!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
        overlay.style.position = 'absolute'
        overlay.style.left = '0'
        overlay.style.top = '0'
        overlay.style.width = '100%'
        overlay.style.height = '100%'
        overlay.style.background = 'rgba(48,64,60,0.7)'
        overlay.style.border = '2px dashed #fff'
      }
    }

    dropArea.ondragover = function(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      if (!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
      }
      dropArea.ondragleave = function(event: MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (dropArea.classList.contains(cls)) {
          dropArea.classList.remove(cls)
          overlay.style.display = 'none'
          dropArea.ondragleave = null
        }
      }
    }

    dropArea.ondrop = function(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      cb(e)
      if (dropArea.classList.contains(cls)) {
        dropArea.classList.remove(cls)
        overlay.style.display = 'none'
      }
    }
  }
}

export const uploadDownloadFile = (received: number, total: number) => {
  const percentage = Math.ceil((received * 100) / total)
  const percentageText = `${percentage}%`
  const cont: HTMLElement | null = document.getElementById('upload-download-popup')
  if (cont) {
    const textField: HTMLElement | null = cont.querySelector('.percentage')
    if (textField) {
      textField.textContent = percentageText
    }
    const progress: HTMLElement | null = cont.querySelector('.progress')
    if (progress) {
      progress.style.width = percentageText
    }
  }
}

/**
 * Translit ru-Ru -> en-En
 */
export const translit = (val: string) => {
  const space = '_'
  /* eslint-disable object-property-newline */
  const transl = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh',
    'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'ju',
    'я': 'ja', ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
    '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
    '(': space, ')': space, '-': space, '\=': space, '+': space, '[': space,
    ']': space, '\\': space, '|': space, '/': space, '.': space, ',': space,
    '{': space, '}': space, '\'': space, '"': space, '': space, ':': space,
    '?': space, '<': space, '>': space, '№': space
  }
  /* eslint-enable object-property-newline */
  let result = ''
  let curentSim = ''
  const text = val.toLowerCase()

  text.split('').forEach((s, i) => {
    if (transl[text[i] as keyof typeof transl] !== undefined) {
      if (curentSim !== transl[text[i] as keyof typeof transl] || curentSim !== space) {
        result += transl[text[i] as keyof typeof transl]
        curentSim = transl[text[i] as keyof typeof transl]
      }
    } else {
      result += text[i]
      curentSim = text[i]
    }
  })

  return result.trim()
}

export const uniqueid = (len: number = 16, format?: string): string | number => {
  let result = ''
  let dic = ''
  switch (format) {
    case 'a-z':
      dic = 'abcdefghijklmnopqrstuvwxyz'
      break
    case 'A-Z':
      dic = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ'
      break
    case '0-9':
      dic = '1234567890'
      break
    case 'a-zA-Z':
      dic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ'
      break
    case 'a-z0-9':
      dic = 'abcdefghijklmnopqrstuvwxyz1234567890'
      break
    case 'A-Z0-9':
      dic = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890'
      break
    default:
      dic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890'
  }

  for (let i = 0; i < len; i++) {
    result += dic.charAt(Math.floor(Math.random() * dic.length))
  }

  if (format === '0-9') {
    return Number(result)
  }
  return result
}

export const upperFirst = (s: string) => {
  s = s.toString()
  if (!s.length) return ''
  return s.charAt(0).toUpperCase() + s.slice((s.length - 1) * -1)
}

export const lowerFirst = (s: string) => {
  s = s.toString()
  if (!s.length) return ''
  return s.charAt(0).toLowerCase() + s.slice((s.length - 1) * -1)
}

export const indexOf = (DOMElement: HTMLElement): number => {
  let result = -1
  if (!DOMElement) {
    return -1
  }
  if (DOMElement.classList) {
    DOMElement.classList.add('__target-element__')
  } else {
    return -1
  }
  const parent = DOMElement.parentNode
  if (!parent || !parent.childNodes) {
    return -1
  }
  if (parent.childNodes.length === 1) return 0
  const children: HTMLElement[] = []
  parent.childNodes.forEach(el => {
    if ((el as HTMLElement).tagName) children.push((el as HTMLElement))
  })
  if (!children.length) {
    return -1
  }
  children.forEach((elem, i) => {
    if (elem.classList) {
      if (elem.classList.contains('__target-element__')) {
        elem.classList.remove('__target-element__')
        result = i
      }
    }
  })
  return result
}

export async function delay(timeout: number) {
  let resolveFunc: (value: unknown) => void = null
  const promise = new Promise(resolve => {
    resolveFunc = resolve
  })
  setTimeout(() => {
    resolveFunc(void 0)
  }, timeout)
  await promise
}

export function toActionTree<S, R>(obj: ActionTree<S, R>): ActionTree<S, R> {
  const arr = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
  const result: ActionTree<S, R> = {}
  arr.forEach(key => {
    if (key !== 'constructor') {
      result[key] = obj[key]
    }
  })
  return result
}

export function isDefined(value: unknown): boolean {
  /* eslint-disable no-undefined */
  const isNaNValue = typeof value === 'number' && isNaN(value)
  return value !== null && value !== undefined && !isNaNValue
}
