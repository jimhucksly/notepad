import { Vue } from 'vue-property-decorator'
import { ResendCodeCommand, VerifyCommand } from '~/domain/commands'

export default class Verify extends Vue {
  values = {
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': ''
  }

  isError = false

  onInput(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value.trim()
    if (/[\D]/.test(value)) {
      this.values[index] = value.replace(/[\D]/g, '')
      return false
    }
    if (index === 1 && value.length === 6 && /^[\d]{6}$/.test(value)) {
      this.values[index] = value.slice(0, 1)
      for (const i of [2, 3, 4, 5, 6]) {
        this.setFocus(index + i - 1, value.slice(i - 1, i))
      }
      return false
    }
    if (value.length === 1 && /\d/.test(value)) {
      this.values[index] = value
      this.setFocus(index + 1)
    } else {
      this.values[index] = value.slice(0, 1)
      this.setFocus(index + 1, value.slice(1))
    }
    return false
  }

  onKeydown(e: KeyboardEvent, index: number) {
    if (e.code === 'Delete') {
      e.preventDefault()
      e.stopPropagation()
      this.values[index] = ''
    }
    if (e.code === 'Backspace') {
      e.preventDefault()
      e.stopPropagation()
      this.values[index] = ''
      this.setFocus(index - 1)
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault()
      e.stopPropagation()
      this.setFocus(index - 1)
    }
    if (e.code === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
      this.setFocus(index + 1)
    }
    return false
  }

  setFocus(index: number, value?: string) {
    const input = this.$el.querySelector('#field-' + index)
    if (input) {
      input.focus()
      if (value) {
        this.values[index] = value
      }
    }
  }

  async submit() {
    const code = Object.values(this.values).join('')
    if (code.length === 6 && /^[\d]{6}$/.test(code)) {
      try {
        const res = await this.$app.$commandBus.do<VerifyCommand, { status: 'sucess' | 'error' }>(new VerifyCommand(code))
        this.isError = res.status === 'error'
        if (this.isError) {
          return
        }
        //
      } catch (e) {
        this.$toasted.error(e?.message || 'submit error')
      }
    }
  }

  async resend() {
    try {
      await this.$app.$commandBus.do<ResendCodeCommand, void>(new ResendCodeCommand())
    } catch (e) {
      this.$toasted.error(e?.message || 'resend error')
    }
  }
}
