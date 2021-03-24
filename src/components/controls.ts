import { Vue, Component, Prop } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { checkLinks, htmlToText } from '~/helpers'
import { IFilters, IJson } from '~/domain/models'
import { ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import {
  SetJsonCommand,
  UpdateJsonCommand,
  DeleteProjectCommand
} from '~/domain/commands'
import { Getter, Mutation } from 'vuex-class'

@Component({
  name: 'Controls'
})

export default class Controls extends Vue {
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Prop({ type: String, default: '' }) readonly itemKey: string
  @Prop({ type: Boolean, default: false }) isLock: false
  @Prop() readonly collection: string[]

  @Mutation('setFilter') setFilter: (value: IFilters) => void

  @Getter('getJson') json: IJson
  @Getter('getFilter') filter: IFilters

  editableItems: string[] = []

  get refs() {
    return this.$parent.$refs
  }

  edit(stamp: string) {
    const item = this.$parent.$el
    if(item) {
      this.editableItems.push(stamp)
      const content = item.querySelector('.notepad_item_content')
      if(content) {
        const area = document.createElement('textarea')
        area.style.visibility = 'hidden'
        this.$emit('on-will-edit')
        content.appendChild(area)
        area.value = htmlToText(this.json[stamp].message)
        area.style.height = area.scrollHeight * 1.1 + 'px'
        area.style.visibility = 'visible'
        area.addEventListener('keydown', (e: KeyboardEvent) => {
          if(
            (e.code === 'Enter' ||
            e.key === 'Enter' ||
            e.code === 'KeyS' ||
            e.key === 's' ||
            e.key === 'ы') &&
            e.ctrlKey
          ) {
            e.preventDefault()
            this.save(stamp)
          }
        })
      }
    }
  }
  save(stamp: string) {
    const item = this.$parent.$el
    if(item) {
      const i = this.editableItems.findIndex((el: string) => el === stamp)
      this.editableItems.splice(i, 1)
      const content = item.querySelector('.notepad_item_content')
      if(content) {
        const textarea = content.querySelector('textarea')
        const value = textarea ? textarea.value : ''
        this.$emit('on-will-save')
        textarea && content.removeChild(textarea)
        const o: IJson = {
          [stamp]: {
            key: stamp,
            date: this.json[stamp].date,
            name: this.json[stamp].name,
            lock: this.json[stamp].lock,
            message: checkLinks(value)
          }
        }
        this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand({ ...this.json, ...o }))
        this.$nextTick(() => {
          this.commandBus.do<UpdateJsonCommand, void>(new UpdateJsonCommand(o))
        })
      }
    }
  }
  removeHandler(stamp: string) {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, stamp)
    unset(buffFilter, stamp)
    this.setFilter(buffFilter)
    this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand(buffJson))
    this.commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(stamp))
  }
  remove(stamp: string) {
    if(this.isLock) {
      this.$electron.ipcRenderer.send('open-dialog-remove-confirm')
      this.$electron.ipcRenderer.once('remove-is-confimed', () => {
        this.removeHandler(stamp)
      })
    } else this.removeHandler(stamp)
  }
}
