import Vue from 'vue'
import * as Vuex from 'vuex'
import { RootState } from 'store/types'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: Vuex.Store<RootState>
    $electron: any
    $slideUp: (elem: HTMLElement, duration: number) => any
    $slideDown: (elem: HTMLElement, duration: number) => any
  }
}
