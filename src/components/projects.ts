import { Vue, Component, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { IFilters, IJson } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { SetFilterCommand, SetJsonCommand, UpdateJsonCommand } from '~/domain/commands'
import { ArchivesQuery } from '~/domain/queries'

@Component({
  name: 'Projects'
})
export default class Projects extends Vue {
  checked = ''
  isArchivesInit = false

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  get isProjects(): boolean {
    return this.$store.getters.getIsProjectsShow
  }
  get json(): IJson {
    return this.$store.getters.getJson
  }
  get filter(): IFilters {
    return this.$store.getters.getFilter
  }

  @Watch('isProjects')
  onIsProjectsChanged(v: boolean) {
    this.checked = ''
    this.isArchivesInit = false
    this.$emit('on-archives', this.isArchivesInit)
  }

  protected toggleLock(e: any, stamp: string) {
    const items: any = this.$refs.projects_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
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
      this.commandBus.do(new SetJsonCommand({ ...this.json, ...o }))
      this.commandBus.do(new UpdateJsonCommand(o))
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
  protected toggleFilter(e: MouseEvent, stamp: string): void | null {
    const items: any = this.$refs.projects_item
    const item = items.find((el: any) => el.dataset.stamp === stamp)
    const target = e.target as HTMLElement
    if(target.closest('.projects_item_check')) {
      return null
    }
    if(target.tagName === 'DIV' || target.tagName === 'LABEL') {
      if(item.classList.contains('active')) {
        const buff = cloneDeep(this.filter)
        unset(buff, stamp)
        this.commandBus.do(new SetFilterCommand({ ...buff }))
      } else {
        this.commandBus.do(new SetFilterCommand({ ...this.filter, [stamp]: true }))
      }
    }
  }
  protected toggleCheck(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const isChecked = target.checked
    if(isChecked) {
      this.isArchivesInit = false
      this.$emit('on-archives', false)
    }
    this.checked = isChecked ? target.dataset?.stamp || '' : ''
    this.$emit('on-edit', this.checked)
  }
  protected clearCheck() {
    this.checked = ''
    const input: any = document.querySelectorAll('input[type="checkbox"]:checked')
    if(input && input[0]) {
      input[0].checked = false
    }
  }
  protected toggleArchives() {
    this.isArchivesInit = !this.isArchivesInit
    this.$emit('on-archives', this.isArchivesInit)
  }

  async created() {
    await this.queryBus.exec(new ArchivesQuery())
  }
}
