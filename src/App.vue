<template>
  <div id="app">
    <router-view id="content"></router-view>
    <popup></popup>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { remote } from 'electron'
import Popup from '@/components/popup'

const { Menu } = remote

export default {
  name: 'notepad.j-studio.app',
  components: {
    Popup
  },
  computed: {
    ...mapGetters({
      notification: 'getNotification'
    })
  },
  watch: {
    notification(flag) {
      if(flag) {
        this.$electron.ipcRenderer.send('set-icon-notification')
      }
    }
  },
  mounted() {
    const MenuTemplate = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Preferences...',
            click: () => {
              this.$electron.ipcRenderer.send('preferences-show')
              this.$store.dispatch('preferences', true)
            }
          },
          {
            label: 'Reload',
            click: () => {
              this.$store.dispatch('loading', true)
              this.$store.dispatch('action', {
                type: 'GET_JSON'
              })
              this.$store.dispatch('action', {
                type: 'GET_MD'
              })
            }
          },
          {
            label: 'Sign Out',
            click: () => {
              this.$store.dispatch('auth', false)
              this.$store.dispatch('token', null)
            }
          }
        ]
      },
      {
        label: 'About',
        click: () => this.$popup.open('about')
      }
    ]
    const ContextMenuTemplate = [
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }
    ]
    const appMenu = Menu.buildFromTemplate(MenuTemplate)
    window.appMenu = appMenu
    const contextMenu = Menu.buildFromTemplate(ContextMenuTemplate)
    Menu.setApplicationMenu(appMenu)

    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      const hasSelection = window.getSelection().toString().length > 0
      if(hasSelection) {
        contextMenu.popup(this.$electron.remote.screen, event.x, event.y)
      }
    })

    this.$store.dispatch('isDevelopment', process.env.NODE_ENV === 'development')
  },
  beforeDestroy() {
    this.$store.dispatch('interval', null)
  }
}
</script>