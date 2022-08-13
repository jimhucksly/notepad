import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { EditProjectCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IFilters, IJson } from '~/domain/models'
import { ConfirmQuery } from '~/domain/queries/confirm.query'
import { TYPES } from '~/domain/types'
import { checkLinks, htmlToText } from '~/helpers'

export default class Controls extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Prop({ type: String, default: '' }) readonly itemKey: string
  @Prop({ type: Boolean, default: false }) isLock: false
  @Prop() readonly collection: string[]

  @Mutation('projects/setFilter') setFilter: (value: IFilters) => void
  @Mutation('projects/setJson') setJson: (value: IJson) => void

  @Getter('projects/getJson') json: IJson
  @Getter('projects/getFilter') filter: IFilters

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
        this.setJson({ ...this.json, ...o })
        this.$nextTick(() => {
          this.commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
        })
      }
    }
  }

  async remove(stamp: string) {
    if(this.isLock) {
      const isConfirm = await this.queryBus.exec(new ConfirmQuery(
        'Do you realy want to remove this project?'
      ))
      if(!isConfirm) {
        return
      }
    }
    this.$emit('on-will-delete', stamp)
  }
}
