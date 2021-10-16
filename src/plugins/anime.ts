import { App } from 'vue'

const anime = require('animejs').default

export default {
  install: (vue: App) => {
    const slideDown = (el: HTMLElement, duration = 300) => {
      el.style.overflow = 'hidden'
      el.style.display = 'block'
      const h = el.clientHeight
      el.style.visibility = 'hidden'
      el.style.height = '0px'
      el.style.visibility = 'visible'
      anime({
        targets: el,
        height: h,
        easing: 'linear',
        duration: duration,
        complete() {
          el.attributes.removeNamedItem('style')
        }
      })
    }

    const slideUp = (el: HTMLElement, duration = 300) => {
      el.style.overflow = 'hidden'
      anime({
        targets: el,
        height: 0,
        easing: 'linear',
        duration: duration,
        complete() {
          el.attributes.removeNamedItem('style')
          el.style.display = 'none'
        }
      })
    }

    vue.config.globalProperties.$slideDown = slideDown
    vue.config.globalProperties.$slideUp = slideUp
  }
}
