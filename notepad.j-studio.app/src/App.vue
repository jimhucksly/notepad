<template>
  <div id="app">
    <router-view id="content"></router-view>
    <popup></popup>
  </div>
</template>
<script>

  import { remote } from 'electron'
  import Popup from '@/components/popup'

  const { Menu, MenuItem } = remote
  
  export default {
    name: 'notepad.j-studio.app',
    components: {
      Popup
    },
    mounted() {
      const appMenu = new Menu()
      const menuItemSignOut = new MenuItem({
        label: 'Sign Out',
        click: () => {
          this.$store.dispatch('auth', false)
          this.$store.dispatch('token', null)
        }
      })
      const menuItemAbout = new MenuItem({
        label: 'About',
        click: () => this.$popup.open('about')
      })
      appMenu.append(menuItemSignOut)
      appMenu.append(menuItemAbout)
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