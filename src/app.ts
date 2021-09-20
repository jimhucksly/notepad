/* eslint-disable-next-line */
/// <reference path="../typings/vue.d.ts" />
import { Vue, Component } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'

@Component({
  name: 'App'
})
export default class App extends Vue {
  mounted() {
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      let selection = null
      let hasSelection = false
      if(window.getSelection) {
        const s = window.getSelection()
        selection = s ? s.toString() : ''
        hasSelection = selection ? !!selection.length : false
      }
      if(hasSelection) {
        this.$electron.ipcRenderer.send('context-menu-popup')
      }
    })
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        attrs: {
          id: 'app'
        }
      },
      [
        h(
          'router-view',
          {
            attrs: {
              id: 'content'
            }
          }
        ),
        h(
          'popup'
        ),
        h(
          'toasted'
        )
      ]
    )
  }
}
