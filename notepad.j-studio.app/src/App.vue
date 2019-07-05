<template>
  <div id="app">
    <router-view id="content"></router-view>
    <popup></popup>
  </div>
</template>
<script>

  import { remote } from 'electron'
  import Popup from '@/components/popup'

  const { Menu } = remote
  
  export default {
    name: 'notepad.j-studio.app',
    components: {
      Popup
    },
    mounted() {
      const MenuTemplate = [
        {
          label: 'File',
          submenu: [
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
      const appMenu = Menu.buildFromTemplate(MenuTemplate)
      Menu.setApplicationMenu(appMenu)
      document.getElementById('menu-button').addEventListener('click', (event) => {
        appMenu.popup(this.$electron.screen, event.x, event.y)
      })

      document.getElementById('minimize-button').addEventListener('click', () => {
        remote.getCurrentWindow().minimize()
      })

      document.getElementById('min-max-button').addEventListener('click', () => {
        const currentWindow = remote.getCurrentWindow()
        if(currentWindow.isMaximized()) {
          currentWindow.unmaximize()
        } else {
          currentWindow.maximize()
        }
      })

      document.getElementById('close-button').addEventListener('click', () => {
        remote.app.quit()
      })
    }
  }
</script>

<style>
  /* CSS */
</style>