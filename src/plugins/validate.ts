import { App, ComponentPublicInstance } from 'vue'
import { REGEXP_LOGIN, REGEXP_EMAIL, REGEXP_PASS, REGEXP_NAME } from '~/helpers'

export interface IValidate {
  touched?: number
  touch?: () => void
  valid?: () => boolean
}

export default {
  install: (vue: App) => {
    const v: IValidate = {
      touched: 0,
      touch: () => null,
      valid: () => null
    }

    const rulesMap = {
      login: REGEXP_LOGIN,
      pass: REGEXP_PASS,
      name: REGEXP_NAME,
      email: REGEXP_EMAIL
    }

    const keys: Array<string> = []

    function validation(instance: ComponentPublicInstance & { v: IValidate }) {
      const required = this.$el.querySelectorAll('input[required]')
      if (required?.length) {
        for (const el of required) {
          if (!el.name) {
            continue
          }
          const key = el.name
          keys.push(key)
          const target = el.dataset?.ruleTarget
          v[key] = {
            value: '',
            rule: rulesMap[key] || rulesMap[target],
            isValid: true,
            isInvalid: false
          }
          if (target) {
            v[key].target = target
          }
          instance.v = v
          instance.v.touch = () => {
            instance.v.touched++
          }
          instance.v.valid = () => {
            let result = true
            for (const k of keys) {
              if (instance.v[k].isInvalid) {
                result = false
                break
              }
            }
            return result
          }
          instance.$watch(`${key}`, (_value: string) => {
            instance.v[key].value = _value
          })
          instance.$watch(
            () => `${instance.v[key].value}${instance.v.touched}`,
            () => {
              const _value = instance.v[key].value
              const regexp = new RegExp(instance.v[key].rule)
              instance.v[key].isValid = _value.length > 0 && regexp.test(_value)
              if (instance.v[key].target) {
                instance.v[key].isValid = instance.v[key].isValid && _value === instance.v[instance.v[key].target].value
              }
              instance.v[key].isInvalid = !instance.v[key].isValid
            }
          )
        }
      }
    }

    vue.config.globalProperties.$validate = validation
  }
}
