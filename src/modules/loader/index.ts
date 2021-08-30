import { CreateElement, VueConstructor, VNode } from 'vue/types'
import { Vue, Component } from 'vue-property-decorator'
import './loader.scss'

const Loader = function loader(options: Record<string, unknown>) {
  if(!options) {
    options = {}
  }
}

@Component
class LoaderComponent extends Vue {
  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'loader'
      },
      [
        h(
          'svg-icon',
          {
            props: {
              icon: 'loader',
              width: '30px',
              height: '30px'
            }
          }
        )
      ]
    )
  }
}

function install(constructor: VueConstructor) {
  constructor.component('Loader', LoaderComponent)
}

Loader.install = install
Loader.NAME = 'Loader'

export default Loader
