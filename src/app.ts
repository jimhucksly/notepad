import { Options, Vue } from 'vue-class-component'

@Options({
  template: `
    <router-view></router-view>
    <popup />
    <toasted />
  `
})
export default class AppComponent extends Vue {
  mounted() {
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      let selection = null
      let hasSelection = false
      if (window.getSelection) {
        const s = window.getSelection()
        selection = s ? s.toString() : ''
        hasSelection = selection ? !!selection.length : false
      }
      if (hasSelection) {
        this.$electron.ipcRenderer.send('context-menu-popup')
      }
    })
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css'
    document.getElementsByTagName('head')[0].appendChild(link)
  }
}
