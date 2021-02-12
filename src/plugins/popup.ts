import { VueConstructor } from 'vue/types'
import store from '~/store'

const Popup = function popup(options: any) {
  if(!options) options = {}
}

function install(Constructor: VueConstructor) {
  const open = (ref: string) => {
    store.dispatch(ref + 'PopupShow', true)
  }

  const close = (ref: string) => {
    store.dispatch(ref + 'PopupShow', false)
  }

  const _popup = {
    open,
    close
  }

  if(!Constructor.prototype.hasOwnProperty('$popup')) {
    Object.defineProperty(Constructor.prototype, '$popup', {
      get: function get() {
        return _popup
      }
    })
  }
}

Popup.install = install
export default Popup
