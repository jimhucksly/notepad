<template>
  <div id="app">
    <router-view></router-view>
    <div class="popup popup-about" ref="about" v-show="aboutPopupShow">
      sdfsdfd
    </div>
  </div>
</template>
<script>

  import { remote } from 'electron'
  import { mapGetters } from 'vuex'
  const { Menu, MenuItem } = remote

  export default {
    name: 'notepad.j-studio.app',
    computed: {
      ...mapGetters({
        aboutPopupShow: 'getAboutPopupShow'
      })
    },
    mounted() {
      const _this = this
      const appMenu = new Menu()
      const menuItem = new MenuItem({
        label: 'About',
        click() { _this.$popup.open('about') }
      })
      appMenu.append(menuItem)
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