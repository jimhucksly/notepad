import { Vue, Component, Prop } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { checkLinks } from '~/helpers'

@Component({
  name: 'Controls'
})

export default class Controls extends Vue {
  @Prop({ type: String, default: '' })
  readonly itemKey!: string

  @Prop({ type: Boolean, default: false })
  isLock!: false

  @Prop({ type: Array, default: () => [] })
  readonly collection!: string[]

  editableItems: string[] = []

  get json() {
    return this.$store.getters.getJson
  }
  get filter() {
    return this.$store.getters.getFilter
  }
  get refs() {
    return this.$parent.$refs
  }

  protected edit(event: any, stamp: string) {
    const item = this.$parent.$el
    if(item) {
      this.editableItems.push(stamp)
      const content = item.querySelector('.notepad_item_content')
      if(content) {
        const area = document.createElement('textarea')
        area.style.visibility = 'hidden'
        this.$emit("onWillEdit")
        content.appendChild(area)
        const div = document.createElement('div')
        div.innerHTML = this.json[stamp].message
        const urls = div.querySelectorAll('a')
        urls.length && urls.forEach((el: any) => {
          const href: string = el.href
          const p = document.createElement('p')
          p.innerHTML = href
          div.insertBefore(p, el)
          el.remove()
        })
        area.value = div.innerHTML.replace(/<br\/?>/g, '\n').replace(/<\/?p\/?>/g, '')
        area.style.height = area.scrollHeight * 1.1 + 'px'
        area.style.visibility = 'visible'
        area.addEventListener('keydown', (e: any) => {
          if(
            (e.code === 'Enter' ||
            e.key === 'Enter' ||
            e.code === 'KeyS' ||
            e.key === 's' ||
            e.key === 'ы') &&
            e.ctrlKey
          ) {
            e.preventDefault()
            this.save(e, stamp)
          }
        })
      }
    }
  }
  protected save(e: any, stamp: string) {
    const item = this.$parent.$el
    if(item) {
      const i = this.editableItems.findIndex((el: string) => el === stamp)
      this.editableItems.splice(i, 1)
      const content = item.querySelector('.notepad_item_content')
      if(content) {
        const textarea = content.querySelector('textarea')
        const value = textarea ? textarea.value.replace(/\n/g, '<br>') : ""
        this.$emit("onWillSave")
        textarea && content.removeChild(textarea)
        const o = {
          [stamp]: {
            key: stamp,
            date: this.json[stamp].date,
            name: this.json[stamp].name,
            lock: this.json[stamp].lock,
            message: checkLinks(value)
          }
        }
        this.$store.dispatch('json', { ...this.json, ...o })
        this.$nextTick(() => {
          this.$store.dispatch('action', {
            type: 'UPDATE',
            data: o
          })
        })
      }
    }
  }
  protected removeHandler(stamp: string) {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, stamp)
    unset(buffFilter, stamp)
    this.$store.dispatch('json', buffJson)
    this.$store.dispatch('filter', buffFilter)
    this.$store.dispatch('action', {
      type: 'DELETE',
      data: stamp
    })
  }
  protected remove(e: any, stamp: string) {
    if(this.isLock) {
      this.$electron.ipcRenderer.send('open-dialog-remove-confirm')
      this.$electron.ipcRenderer.once('remove-is-confimed', () => {
        this.removeHandler(stamp)
      })
    } else this.removeHandler(stamp)
  }
}
