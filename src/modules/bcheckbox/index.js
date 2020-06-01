import './bcheckbox.scss'

const BCheckbox = function calendar(options) {
  if(!options) options = {}
}

function install(Vue) {
  Vue.component('b-checkbox', {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggle() {
        this.$emit('input', !this.value)
      }
    },
    render(h) {
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
                click: (e) => this.toggle()
              }
            }
          )
        ]
      )
    }
  })
}

BCheckbox.install = install
BCheckbox.NAME = 'BCheckbox'

export default BCheckbox
