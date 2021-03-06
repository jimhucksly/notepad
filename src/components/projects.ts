import { Vue, Component, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { IArchive, IFilters, IJson } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { SetJsonCommand, UpdateJsonCommand } from '~/domain/commands'
import { ArchivesQuery } from '~/domain/queries'
import { Getter, Mutation } from 'vuex-class'

@Component({
  name: 'Projects'
})
export default class Projects extends Vue {
  checked = ''
  isArchivesInit = false

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setFilter') setFilter: (value: IFilters) => void

  @Getter('getIsProjectsShow') isProjects: boolean
  @Getter('getJson') json: IJson
  @Getter('getFilter') filter: IFilters

  @Watch('isProjects')
  onIsProjectsChanged(v: boolean) {
    this.checked = ''
    this.isArchivesInit = false
    this.$emit('on-archives', this.isArchivesInit)
  }

  public clearCheck() {
    this.checked = ''
    const input: NodeListOf<Element> = document.querySelectorAll('input[type="checkbox"]:checked')
    if(input && input[0]) {
      (input[0] as HTMLInputElement).checked = false
    }
  }

  toggleLock(e: InputEvent, stamp: string) {
    const items = this.$refs.projects_item as Array<HTMLElement>
    const item = items.find((el: HTMLElement) => el.dataset.stamp === stamp)
    if(!item) {
      return
    }
    const isLocked = item.classList.contains('lock')
    const updateJson = () => {
      const o: IJson = {
        [stamp]: {
          key: stamp,
          date: this.json[stamp].date,
          name: this.json[stamp].name,
          lock: !isLocked,
          message: this.json[stamp].message,
          file: this.json[stamp].file
        }
      }
      this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand({ ...this.json, ...o }))
      this.commandBus.do<UpdateJsonCommand, void>(new UpdateJsonCommand(o))
    }
    if(isLocked) {
      this.$electron.ipcRenderer.send('open-dialog-unlock-confirm')
      this.$electron.ipcRenderer.once('unlock-is-confimed', () => {
        item.classList.remove('lock')
        updateJson()
      })
    } else {
      item.classList.add('lock')
      updateJson()
    }
  }

  toggleFilter(e: MouseEvent, stamp: string): void | null {
    const items = this.$refs.projects_item as Array<HTMLElement>
    const item = items.find((el: HTMLElement) => el.dataset.stamp === stamp)
    if(!item) {
      return
    }
    const target = e.target as HTMLElement
    if(target.closest('.projects_item_check')) {
      return null
    }
    if(target.tagName === 'DIV' || target.tagName === 'LABEL') {
      if(item.classList.contains('active')) {
        const buff = cloneDeep(this.filter)
        unset(buff, stamp)
        this.setFilter({ ...buff })
      } else {
        this.setFilter({ ...this.filter, [stamp]: true })
      }
    }
  }

  toggleCheck(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const isChecked = target.checked
    if(isChecked) {
      this.isArchivesInit = false
      this.$emit('on-archives', false)
    }
    this.checked = isChecked ? target.dataset?.stamp ?? '' : ''
    this.$emit('on-edit', this.checked)
  }

  toggleArchives() {
    this.isArchivesInit = !this.isArchivesInit
    this.$emit('on-archives', this.isArchivesInit)
  }

  created() {
    try {
      this.queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
    } catch(e) {
      console.log(e)
    }
  }
}
