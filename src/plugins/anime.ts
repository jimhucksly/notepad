import { VueConstructor } from 'vue/types'
const anime = require('animejs')

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const Anime = function _anime(options: any) {
  if(!options) options = {}
}

function install(Constructor: VueConstructor) {
  const slideDown = (el: HTMLElement, duration = 300) => {
    el.style.overflow = 'hidden'
    el.style.display = 'block'
    el.style.visibility = 'hidden'
    el.style.height = '0px'
    el.style.visibility = 'visible'
    anime({
      targets: el,
      height: el.offsetHeight,
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

  if(!Constructor.prototype.hasOwnProperty('$slideDown')) {
    Object.defineProperty(Constructor.prototype, '$slideDown', {
      get: function get() {
        return slideDown
      }
    })
  }

  if(!Constructor.prototype.hasOwnProperty('$slideUp')) {
    Object.defineProperty(Constructor.prototype, '$slideUp', {
      get: function get() {
        return slideUp
      }
    })
  }
}

Anime.install = install
export default Anime
