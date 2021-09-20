import { CreateElement, VueConstructor, VNode } from 'vue/types'
import { Vue, Component, Prop } from 'vue-property-decorator'
import './loader.scss'

const Loader = function loader(options: Record<string, unknown>) {
  if(!options) {
    options = {}
  }
}

@Component
class LoaderComponent extends Vue {
  @Prop() small: boolean
  @Prop({ default: true }) full: boolean

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'loader',
        class: {
          small: this.small,
          full: this.full
        }
      },
      [
        h(
          'svg-icon',
          {
            props: {
              icon: this.small ? 'loader-sm' : 'loader',
              width: this.small ? '18px' : '30px',
              height: this.small ? '18px' : '30px'
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
