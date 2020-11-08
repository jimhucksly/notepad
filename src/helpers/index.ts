const request = require('request')
const fs = require('fs')
const path = require('path')

const REGEXP_URL = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
const REGEXP_EMAIL = /.+@.+\..+/i

export const checkLinks = (message: string): string => {
  const m: string[] = message.replace(/\n/g, '<br>').split('<br>')
  m.forEach((str, i) => {
    const p = str.split(' ')
    p.forEach((item, k) => {
      const isEmail = new RegExp(REGEXP_EMAIL).test(item)
      if(isEmail) {
        p[k] = item
        return
      }
      const isURL = new RegExp(REGEXP_URL).test(item)
      if(isURL) {
        if(item.indexOf('###') === 0) {
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
  let d
  if(stamp !== undefined) {
    d = new Date(stamp.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/g, '$1-$2-$3 $4:$5:$6'))
  } else d = new Date()
  const y: any = d.getFullYear()
  let mon: any = d.getMonth()
  let day: any = d.getDate()
  let h: any = d.getHours()
  let mm: any = d.getMinutes()
  let s: any = d.getSeconds()

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

export const isJSON = (str: string): boolean => {
  try {
    const obj = JSON.parse(str)
    if(obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch(err) {}
  return false
}

export const getFileType = (name: string): string => {
  if(/\.jpe?g$/.test(name)) return 'jpg'
  if(/\.png$/.test(name)) return 'png'
  if(/\.gif$/.test(name)) return 'image'
  if(/\.html?$/.test(name)) return 'html'
  if(/\.js$/.test(name)) return 'js'
  if(/\.d\.ts$/.test(name)) return 'dts'
  if(/\.ts$/.test(name)) return 'ts'
  if(/\.json$/.test(name)) return 'json'
  if(/\.vue$/.test(name)) return 'vue'
  if(/\.css$/.test(name)) return 'css'
  if(/\.(sass|scss)$/.test(name)) return 'sass'
  if(/\.svg$/.test(name)) return 'svg'
  if(/\.docx?$/.test(name)) return 'doc'
  if(/\.pdf$/.test(name)) return 'pdf'
  if(/\.txt$/.test(name)) return 'txt'
  if(/\.zip$/.test(name)) return 'zip'
  if(/\.rar$/.test(name)) return 'rar'
  if(/\.md$/.test(name)) return 'md'

  return 'default'
}

export function dragAndDropLoader(
  DOMElementId: string,
  CSSClassHighlight: string,
  Callback: (e: any) => any
): void {
  const id = DOMElementId
  const cls = CSSClassHighlight
  const cb = Callback

  const dropArea: HTMLElement | null = document.getElementById(id)

  if(dropArea) {
    if(!dropArea.style.position) {
      dropArea.style.position = 'relative'
    }
    const overlay: HTMLElement = document.createElement('div')
    overlay.classList.add('drop-overlay')
    dropArea.appendChild(overlay)

    dropArea.ondragenter = function(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      if(!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
        overlay.style.position = 'absolute'
        overlay.style.left = '0'
        overlay.style.right = '0'
        overlay.style.width = '100%'
        overlay.style.height = '100%'
        overlay.style.background = 'rgba(0,0,0,0.2)'
        overlay.style.border = '2px dashed #fff'
      }
    }

    dropArea.ondragover = function(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      if(!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
      }
      dropArea.ondragleave = function(event: MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        if(dropArea.classList.contains(cls)) {
          dropArea.classList.remove(cls)
          overlay.style.display = 'none'
          dropArea.ondragleave = null
        }
      }
    }

    dropArea.ondrop = function(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      cb(e)
      if(dropArea.classList.contains(cls)) {
        dropArea.classList.remove(cls)
        overlay.style.display = 'none'
      }
    }
  }
}

export const downloadFile = (
  fileUri: string,
  targetPath: string,
  loaderDOMElement: HTMLElement
): void => {
  let receivedBytes = 0
  let totalBytes = 0

  const targetFileName: string = path.parse(targetPath).base
  const targetFileDir: string = path.parse(targetPath).dir

  const req = request({
    method: 'GET',
    uri: encodeURI(fileUri)
  })

  const canSave = (tPath: string) => {
    return new Promise((resolve, reject) => {
      fs.access(tPath, (err: Error) => {
        if(err) return resolve()
        else return reject(new Error('file exists'))
      })
    })
  }

  const checkTargetPath = (target: string) => {
    canSave(target)
      .then(() => {
        req.on('response', (data: { statusCode: number, headers: string[] }) => {
          if(data.statusCode === 200 || data.statusCode === 201) {
            totalBytes = parseInt(data.headers['content-length'])
            const out = fs.createWriteStream(target)
            req.pipe(out)
          } else {
            showError(loaderDOMElement)
            return
          }
        })
        req.on('data', (chunk: any) => {
          if(totalBytes > 0) {
            receivedBytes += chunk.length
            showProgress(receivedBytes, totalBytes, loaderDOMElement)
          }
        })
      })
      .catch(() => {
        const filename = targetFileName.replace(/\./g, `(${++index}).`)
        checkTargetPath(path.resolve(targetFileDir, filename))
      })
  }

  let index = 0

  checkTargetPath(targetPath)
}

const showError = (loaderDOMElement: HTMLElement) => {
  loaderDOMElement.style.display = 'block'
  if(loaderDOMElement.firstElementChild) {
    loaderDOMElement.firstElementChild.classList.add('error')
    loaderDOMElement.firstElementChild.textContent = 'Error: file not found'
  }
  setTimeout(() => {
    loaderDOMElement.style.display = 'none'
    if(loaderDOMElement.firstElementChild) {
      loaderDOMElement.firstElementChild.classList.remove('error')
      loaderDOMElement.firstElementChild.textContent = ''
    }
  }, 5000)
}

const showProgress = (
  received: number,
  total: number,
  loaderDOMElement: HTMLElement
) => {
  const percentage = Math.ceil((received * 100) / total)
  loaderDOMElement.style.display = 'block'
  loaderDOMElement.style.width = `${percentage}px`
  if(loaderDOMElement.firstElementChild) {
    loaderDOMElement.firstElementChild.textContent = `${percentage}%`
  }
  if(percentage === 100) {
    setTimeout(() => {
      loaderDOMElement.style.display = 'none'
      if(loaderDOMElement.firstElementChild) {
        loaderDOMElement.style.width = '0'
        loaderDOMElement.firstElementChild.textContent = ''
      }
    }, 3000)
  }
}

export const uploadingFile = (received: number, total: number) => {
  const percentage = Math.ceil((received * 100) / total)
  const cont: HTMLElement | null = document.querySelector('.popup-uploading')
  if(cont) {
    const progress: HTMLElement | null = cont.querySelector('.uploading-progress')
    if(progress) {
      const text = progress.firstElementChild
      progress.style.width = `${percentage}px`
      text && (text.textContent = `${percentage}%`)
    }
  }
}

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
    if(transl[text[i]] !== undefined) {
      if(curentSim !== transl[text[i]] || curentSim !== space) {
        result += transl[text[i]]
        curentSim = transl[text[i]]
      }
    } else {
      result += text[i]
      curentSim = text[i]
    }
  })

  return result.trim()
}

export const uniqueid = (len?: number) => {
  if(len === undefined) len = 16
  let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65))
  while(idstr.length < len) {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicode = Math.floor((Math.random() * 42) + 80)
    if(ascicode < 58 || (ascicode > 64 && ascicode < 91) || ascicode > 96) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode)
    }
  }
  return (idstr)
}

export const upperFirst = (s: string) => {
  s = s.toString()
  if(!s.length) return ''
  return s.charAt(0).toUpperCase() + s.slice((s.length - 1) * -1)
}

export const lowerFirst = (s: string) => {
  s = s.toString()
  if(!s.length) return ''
  return s.charAt(0).toLowerCase() + s.slice((s.length - 1) * -1)
}

export const indexOf = (DOMElement: HTMLElement): number => {
  let result = -1
  if(!DOMElement) return -1
  if(DOMElement.classList) {
    DOMElement.classList.add('index-of-element-search-proc')
  } else return -1
  const parent = DOMElement.parentNode
  if(!parent) return -1
  if(!parent.childNodes) return -1
  if(parent.childNodes.length === 1) return 0
  const children: HTMLElement[] = []
  parent.childNodes.forEach(el => {
    if((el as HTMLElement).tagName) children.push((el as HTMLElement))
  })
  if(!children.length) return -1
  children.forEach((elem, i) => {
    if(elem.classList) {
      if(elem.classList.contains('index-of-element-search-proc')) {
        elem.classList.remove('index-of-element-search-proc')
        result = i
      }
    }
  })
  return result
}
