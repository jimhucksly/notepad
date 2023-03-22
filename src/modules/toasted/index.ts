import { Vue } from 'vue-class-component'
import { Hub } from '~/plugins/hub'
import { uniqueid } from '~/helpers'

enum ToastType {
  Success = 1,
  Error = 2,
  Info = 3
}

interface IToast {
  id: number
  subject: string
  type: ToastType
}

export default class Toasted extends Vue {
  toasts: Array<IToast> = []

  toastedSuccessHandler: (subject: string) => void
  toastedErrorHandler: (subject: string) => void

  created() {
    this.toastedSuccessHandler = this.toastedSuccess.bind(this)
    Hub.$on('on-toasted-success', this.toastedSuccessHandler)
    this.toastedErrorHandler = this.toastedError.bind(this)
    Hub.$on('on-toasted-error', this.toastedErrorHandler)
  }

  beforeUnmount() {
    Hub.$off('on-toasted-success', this.toastedSuccessHandler)
    Hub.$off('on-toasted-error', this.toastedErrorHandler)
  }

  toastedSuccess(subject: string) {
    const id = Number(uniqueid(6, '0-9'))
    this.toasts.push({
      id,
      subject,
      type: ToastType.Success
    })
    setInterval(() => {
      this.toasts = this.toasts.filter(item => item.id !== id)
    }, 6000)
  }

  toastedError(subject: string) {
    const id = Number(uniqueid(6, '0-9'))
    this.toasts.push({
      id,
      subject,
      type: ToastType.Error
    })
    setInterval(() => {
      this.toasts = this.toasts.filter(item => item.id !== id)
    }, 6000)
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(item => item.id !== id)
  }

  isSuccessType(item: IToast) {
    return item.type === ToastType.Success
  }

  isErrorType(item: IToast) {
    return item.type === ToastType.Error
  }
}

