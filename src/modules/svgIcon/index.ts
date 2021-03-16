import { CreateElement, VueConstructor, VNode } from 'vue/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

const SvgIcon = function svgIcon(options: Record<string, unknown>) {
  if(!options) {
    options = {}
  }
}

@Component
class SvgIconComponent extends Vue {
  @Prop() icon: string
  @Prop({ type: String, default: '100%' }) width: string
  @Prop({ type: String, default: '100%' }) height: string

  get href(): string {
    return `static/${this.icon}.svg#${this.icon}`
  }

  render(h: CreateElement): VNode {
    return h(
      'svg',
      {
        domProps: {
          style: 'fill: transparent; stroke: transparent'
        },
        attrs: {
          width: this.width,
          height: this.height
        }
      },
      [
        h(
          'use',
          {
            attrs: {
              href: this.href
            }
          }
        )
      ]
    )
  }
}

function install(constructor: VueConstructor) {
  constructor.component('SvgIcon', SvgIconComponent)
}

SvgIcon.install = install
SvgIcon.NAME = 'SvgIcon'

export default SvgIcon
