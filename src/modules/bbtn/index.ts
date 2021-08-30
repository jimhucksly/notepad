import { CreateElement, VueConstructor, VNode } from 'vue/types'
import { Vue, Component, Prop } from 'vue-property-decorator'
import './bbtn.scss'

const BBtn = function bbtn(options: Record<string, unknown>) {
  if(!options) {
    options = {}
  }
}

@Component
class BBtnComponent extends Vue {
  @Prop() primary: boolean
  @Prop() processing: boolean
  @Prop({ type: String, default: 'Submit' }) label: string

  render(h: CreateElement): VNode {
    const staticChild = h(
      'span',
      {},
      this.label
    )

    const procChildren = [1, 2, 3].map(i => {
      return h(
        'span',
        {
          staticClass: `processing-indicator-${i}`
        }
      )
    })

    return h(
      'button',
      {
        staticClass: 'btn',
        class: {
          'btn-primary': this.primary,
          'btn-processing': this.processing
        },
        on: {
          click: (e: MouseEvent) => this.$emit('click', e)
        }
      },
      this.processing ? procChildren : [staticChild]
    )
  }
}

function install(constructor: VueConstructor) {
  constructor.component('BBtn', BBtnComponent)
}

BBtn.install = install
BBtn.NAME = 'BBtn'

export default BBtn
