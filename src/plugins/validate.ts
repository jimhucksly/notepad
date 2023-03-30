import { App, ComponentPublicInstance } from 'vue'
import { REGEXP_LOGIN, REGEXP_EMAIL, REGEXP_PASS, REGEXP_NAME } from '~/helpers'

export interface IValidate {
  touched?: number
  touch?: () => Promise<void>
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
      const required = instance.$el.querySelectorAll('input[required]')
      if (required?.length) {
        instance.v = v
        for (const el of required) {
          if (!el.name) {
            continue
          }
          const key = el.name
          keys.push(key)
          const target = el.dataset?.ruleTarget
          const rule = rulesMap[key] || (target ? rulesMap[target] : null)
          instance.v[key] = {
            value: '',
            rule,
            isValid: true,
            isInvalid: false
          }
          if (target) {
            instance.v[key].target = target
          }
          instance.$watch(`${key}`, (_value: string) => {
            instance.v[key].value = _value
          }, { immediate: true })
          instance.$watch(
            () => `${instance.v[key].value}${instance.v.touched}`,
            () => {
              const _value = instance.v[key].value
              let regexp: RegExp = null
              if (instance.v[key].rule) {
                regexp = new RegExp(instance.v[key].rule)
              }
              instance.v[key].isValid = _value.length > 0
              if (instance.v[key].isValid && regexp) {
                instance.v[key].isValid = regexp.test(_value)
              }
              if (instance.v[key].target) {
                instance.v[key].isValid = instance.v[key].isValid && _value === instance.v[instance.v[key].target].value
              }
              instance.v[key].isInvalid = !instance.v[key].isValid
            }
          )
        }
        instance.v.touch = async () => {
          instance.v.touched++
          await instance.$nextTick()
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
      }
    }

    vue.config.globalProperties.$validate = validation
  }
}
