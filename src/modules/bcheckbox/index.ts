import { VueConstructor, VNode } from 'vue/types'
import { Vue, Component, Prop } from 'vue-property-decorator'
import './bcheckbox.scss'

const BCheckbox = function calendar(options: any) {
  if(!options) options = {}
}

@Component
class BCheckboxComponent extends Vue {
  @Prop() value: boolean

  public toggle() {
    this.$emit('input', !this.value)
  }

  render(h: typeof Vue.prototype.$createElement): VNode {
    return h(
      'label',
      {
        staticClass: 'b-checkbox',
        class: {
          'b-checkbox--enabled': this.value
        }
      },
      [
        h(
          'input',
          {
            domProps: {
              type: 'checkbox',
              value: this.value
            }
          }
        ),
        h(
          'span',
          {
            staticClass: 'b-checkbox_runner',
            on: {
              click: (e: MouseEvent) => this.toggle()
            }
          }
        )
      ]
    )
  }
}

function install(constructor: VueConstructor) {
  constructor.component('BCheckbox', BCheckboxComponent)
}

BCheckbox.install = install
BCheckbox.NAME = 'BCheckbox'

export default BCheckbox
