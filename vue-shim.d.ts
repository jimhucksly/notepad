import Vue from 'vue'
import * as Vuex from 'vuex'
import { RootState } from 'store/types'
import Application from '~/assets/application/app'

declare module 'vue/types/vue' {
  interface Vue {
    $app: Application
    $store: Vuex.Store<RootState>
    $electron: any
    $slideUp: (elem: HTMLElement, duration: number) => any
    $slideDown: (elem: HTMLElement, duration: number) => any
  }
}
