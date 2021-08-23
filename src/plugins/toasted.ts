import { VueConstructor } from 'vue/types'
import { Hub } from './hub'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const Toasted = function _toasted(options: any) {
  if(!options) options = {}
}

class ToastedClass {
  success(subject: string) {
    Hub.$emit('on-toasted-success', subject)
  }

  error(subject: string) {
    Hub.$emit('on-toasted-error', subject)
  }
}

function install(Constructor: VueConstructor) {
  if(!Constructor.prototype.hasOwnProperty('$toasted')) {
    Object.defineProperty(Constructor.prototype, '$toasted', {
      get: function get() {
        return new ToastedClass()
      }
    })
  }
}

Toasted.install = install
export default Toasted
