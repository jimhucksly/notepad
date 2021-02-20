import axios from 'axios'

// const fs = require('fs')
// const path = require('path')

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
  let d: Date
  if(stamp !== undefined) {
    d = new Date(stamp.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/g, '$1-$2-$3 $4:$5:$6'))
  } else d = new Date()
  const y: string | number = d.getFullYear()
  let mon: string | number = d.getMonth()
  let day: string | number = d.getDate()
  let h: string | number = d.getHours()
  let mm: string | number = d.getMinutes()
  let s: string | number = d.getSeconds()

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

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const isJSON = (value: any): boolean => {
  let json: Record<string, unknown>
  if(typeof value === 'string') {
    try {
      json = JSON.parse(value)
      return true
    } catch(e) {
      console.log(e)
      return false
    }
  } else {
    try {
      json = JSON.parse(JSON.stringify(value))
      if(json && typeof json === 'object' && json !== null) {
        return true
      }
    } catch(e) {
      console.log(e)
    }
  }
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
  Callback: (e: MouseEvent) => void
): void {
  const id = DOMElementId
  const cls = CSSClassHighlight
  const cb = Callback

  const dropArea = document.getElementById(id)

  if(dropArea) {
    if(!dropArea.style.position) {
      dropArea.style.position = 'relative'
    }
    const overlay = document.createElement('div')
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

export async function downloadFile(
  fileUri: string,
  targetPath: string,
  loaderDOMElement: HTMLElement
): Promise<void> {
  // const response = await fetch(encodeURI(fileUri))
  // if(response && response.body && response.headers) {
  //   const reader = response.body.getReader()
  //   const contentLength = response.headers.get('Content-Length')
  //   let receivedLength = 0
  //   const chunks = []
  //   while(true) {
  //     const { done, value } = await reader.read()
  //     if(done) {
  //       break
  //     }
  //     if(value) {
  //       chunks.push(value)
  //       receivedLength += value.length
  //       console.log(`Received ${receivedLength} of ${contentLength}`)
  //     }
  //   }
  // }

  // let receivedBytes = 0
  // let totalBytes = 0
  // let index = 0

  // const targetFileName: string = path.parse(targetPath).base
  // const targetFileDir: string = path.parse(targetPath).dir

  // let isFileExists = true
  // while(isFileExists) {
  //   try {
  //     fs.statSync(targetPath)
  //     const filename = targetFileName.replace(/\./g, `(${++index}).`)
  //     targetPath = path.resolve(targetFileDir, filename)
  //   } catch(e) {
  //     isFileExists = false
  //   }
  // }

  // const req = request({
  //   method: 'GET',
  //   uri: encodeURI(fileUri)
  // })

  const f = 'http://jimhucksly-studio.ru/files/uploads/2016/12/SmartBabyWatch.jpg'

  await axios.get(f, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    responseType: 'blob'
  })
  //   .then((response) => {
  //     console.log(response)
  //     //  const url = window.URL.createObjectURL(new Blob([response.data]));
  //     //  const link = document.createElement('a');
  //     //  link.href = url;
  //     //  link.setAttribute('download', 'file.pdf'); //or any other extension
  //     //  document.body.appendChild(link);
  //     //  link.click();
  //   })
  //   .catch(e => {
  //     console.log(e)
  //   })

  // console.log(targetPath)

  // req.on('response', (data: { statusCode: number, headers: string[] }) => {
  //   console.log('response!!!')
  //   if(data.statusCode === 200 || data.statusCode === 201) {
  //     totalBytes = parseInt(data.headers['content-length'])
  //     const out = fs.createWriteStream(targetPath)
  //     req.pipe(out)
  //   } else {
  //     showError(loaderDOMElement)
  //     return
  //   }
  // })

  // req.on('data', (chunk: any) => {
  //   console.log('data!!!')
  //   if(totalBytes > 0) {
  //     receivedBytes += chunk.length
  //     showProgress(receivedBytes, totalBytes, loaderDOMElement)
  //   }
  // })
}

// function showError(loaderDOMElement: HTMLElement): void {
//   loaderDOMElement.style.display = 'block'
//   if(loaderDOMElement.firstElementChild) {
//     loaderDOMElement.firstElementChild.classList.add('error')
//     loaderDOMElement.firstElementChild.textContent = 'Error: file not found'
//   }
//   setTimeout(() => {
//     loaderDOMElement.style.display = 'none'
//     if(loaderDOMElement.firstElementChild) {
//       loaderDOMElement.firstElementChild.classList.remove('error')
//       loaderDOMElement.firstElementChild.textContent = ''
//     }
//   }, 5000)
// }

// function showProgress(
//   received: number,
//   total: number,
//   loaderDOMElement: HTMLElement
// ): void {
//   const percentage = Math.ceil((received * 100) / total)
//   loaderDOMElement.style.display = 'block'
//   loaderDOMElement.style.width = `${percentage}px`
//   if(loaderDOMElement.firstElementChild) {
//     loaderDOMElement.firstElementChild.textContent = `${percentage}%`
//   }
//   if(percentage === 100) {
//     setTimeout(() => {
//       loaderDOMElement.style.display = 'none'
//       if(loaderDOMElement.firstElementChild) {
//         loaderDOMElement.style.width = '0'
//         loaderDOMElement.firstElementChild.textContent = ''
//       }
//     }, 3000)
//   }
// }

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
