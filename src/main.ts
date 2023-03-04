import 'reflect-metadata'
import { createApp } from 'vue'
import '~/assets/css/simplemde.css'
import '~/assets/scss/main.scss'

import router from './router'
import store from './store'
import root from './app'

import Popup from '~/modules/popup'
import Toasted from '~/modules/toasted'
import LibraryTree from '~/modules/libraryTree'
import BCheckbox from '~/modules/bcheckbox'
import BBtn from '~/modules/bbtn'
import SvgIcon from '~/modules/svgIcon'
import Loader from '~/modules/loader'
import CreateEditLink from '~/modules/popup/createEditLink'
import AboutPopup from '~/modules/popup/about'
import ConfirmPopup from '~/modules/popup/confirm'
import CreateEditLibraryFile from '~/modules/popup/createEditLibraryFile'
import CodeInput from './modules/codeInput'

import AnimePlugin from '~/plugins/anime'
import ToastedPlugin from '~/plugins/toasted'
import AppPlugin from '~/plugins/app'
import ElectronPlugin from '~/plugins/electron'
import SocketPlugin from '~/plugins/socket'
import Validate from './plugins/validate'

const isDev = process.env.NODE_ENV === 'development'

const app = createApp(root)

app.component('popup', Popup)
app.component('toasted', Toasted)
app.component('create-edit-link', CreateEditLink)
app.component('library-tree', LibraryTree)
app.component('svg-icon', SvgIcon)
app.component('loader', Loader)
app.component('b-checkbox', BCheckbox)
app.component('b-btn', BBtn)
app.component('about-popup', AboutPopup)
app.component('create-edit-library-file', CreateEditLibraryFile)
app.component('confirm-popup', ConfirmPopup)
app.component('code-input', CodeInput)

app.use(store)
app.use(router)
app.use(AppPlugin)
app.use(ElectronPlugin)
app.use(AnimePlugin)
app.use(ToastedPlugin)
app.use(SocketPlugin, { store })
app.use(Validate)

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
