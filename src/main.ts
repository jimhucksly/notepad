import 'reflect-metadata'
import '~/assets/scss/main.scss'
import '~/assets/css/md-editor.css'

import { createApp, defineComponent } from 'vue'

import router from './router'
import { buildStore } from './store'
import { buildContainer } from './domain/container'
import root from './app'

import Titlebar from '~/components/titlebar'
import Popup from '~/modules/popup'
import Toasted from '~/modules/toasted'
import LibraryTree from '~/modules/libraryTree'
import BCheckbox from '~/modules/bcheckbox'
import BBtn from '~/modules/bbtn'
import SvgIcon from '~/modules/svgIcon'
import Loader from '~/modules/loader'
import AboutPopup from '~/modules/popup/about'
import CreateEditLibraryFile from '~/modules/popup/createEditLibraryFile'
import CreateEditProject from '~/modules/popup/createEditProject'
import CodeInput from '~/modules/codeInput'

import AnimePlugin from '~/plugins/anime'
import ToastedPlugin from '~/plugins/toasted'
import AppPlugin from '~/plugins/app'
import ElectronPlugin from '~/plugins/electron'
import SocketPlugin from '~/plugins/socket'
import Validate from '~/plugins/validate'
import { IManifest, IModuleMaifest } from './domain/interfaces'
import { ModuleTree, Store } from 'vuex'
import { IRootState } from './domain/models'
import { TYPES } from './domain/types'
import Application from './application/app'
import { createInterceptors } from './http'
import { registerModule } from './registerModule'

async function init() {
  try {
    const response: { json: () => Promise<IManifest>, status: number } = await fetch('/manifest.json')
    if (response.status === 404) {
      throw new Error('Menifest is not found')
    }
    const manifest: IManifest = await response.json()

    const isDev = process.env.NODE_ENV === 'development'

    const app = createApp(root)

    const storeModules: ModuleTree<IRootState> = {}

    for (const _module of manifest.main) {
      const path = _module.path + '/'
      const _manifest: IModuleMaifest = require('~/__modules__/' + path + 'manifest.json')
      if (_manifest) {
        const data = await registerModule(_module, _manifest, app)
        if (data && data.storeModule && data.namespace) {
          storeModules[data.namespace] = { ...data.storeModule }
        }
      }
    }

    const store = buildStore(storeModules)

    store.commit('setManifest', manifest)

    const container = buildContainer()
    container.bind<Store<IRootState>>(TYPES.Store).toConstantValue(store)

    app.component('titlebar', Titlebar)
    app.component('popup', Popup)
    app.component('toasted', Toasted)
    app.component('library-tree', LibraryTree)
    app.component('svg-icon', SvgIcon)
    app.component('loader', Loader)
    app.component('b-checkbox', BCheckbox)
    app.component('b-btn', BBtn)
    app.component('about-popup', AboutPopup)
    app.component('create-edit-project', CreateEditProject)
    app.component('create-edit-library-file', CreateEditLibraryFile)
    app.component('code-input', CodeInput)

    const $app: Application = container.get(TYPES.Application)

    app.use(store)
    app.use(router)
    app.use(AppPlugin, { app: $app })
    app.use(ElectronPlugin)
    app.use(AnimePlugin)
    app.use(ToastedPlugin)
    app.use(SocketPlugin, { store })
    app.use(Validate)

    createInterceptors(store)

    app.config.globalProperties.$dateFormat = (date: string | Date) => {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return date.toLocaleString('ru')
    }

    if (isDev && window && window.location) {
      (window as unknown as { reload: () => void }).reload = window.location.reload.bind(window.location)
    }

    app.mount('#app')
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e)
    const error = defineComponent({
      components: {
        Titlebar
      },
      data() {
        return {
          error: e.message || 'Unrecognized error'
        }
      },
      template: `
        <titlebar />
        <div class="flex-center items-center basis-100">Error: {{ error }}</div>
      `
    })
    const app = createApp(error)
    app.component('svg-icon', SvgIcon)
    app.component('loader', Loader)
    app.mount('#app')
  }
}

init()
