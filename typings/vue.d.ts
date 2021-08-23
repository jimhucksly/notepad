import * as Vuex from 'vuex'
import { IRootState } from '../src/domain/models'
import Application from '../src/application/app'

declare module 'vue/types/vue' {
  interface Vue {
    $app: Application
    $store: Vuex.Store<IRootState>
    $electron: any
    $slideUp: (elem: HTMLElement, duration: number) => any
    $slideDown: (elem: HTMLElement, duration: number) => any
    $toasted: {
      success: (subject: string) => void,
      error: (subject: string) => void
    }
  }
}
