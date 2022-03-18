import { cloneDeep, unset } from 'lodash'
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ArchivingCommand, DeleteProjectCommand, EditProjectCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IArchive, IFilters, IJson, IJsonItem } from '~/domain/models'
import { ArchivesQuery } from '~/domain/queries'
import { ConfirmQuery } from '~/domain/queries/confirm.query'
import { TYPES } from '~/domain/types'

export default class ProjectsEditor extends Vue {
  @Prop() expanded: boolean

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('projects/setFilter') setFilter: (value: IFilters) => void
  @Mutation('projects/setJson') setJson: (value: IJson) => void

  @Getter('projects/getJson') json: IJson
  @Getter('projects/getFilter') filter: IFilters
  @Getter('projects/getSelectedProjectKey') selected: string

  name = ''
  isLock = false
  isDialog = false
  savingProcess = false

  @Watch('item') onItemChanged(o: IJsonItem) {
    if(o) {
      this.name = o.name
      this.isLock = o.lock
    } else {
      this.name = ''
      this.isLock = false
    }
  }

  get item(): IJsonItem {
    if(!this.json) {
      return null
    }
    return this.json[this.selected]
  }

  get isFile(): boolean {
    return this.item && !!this.item.file
  }

  async toggleLock(): Promise<void> {
    if(!this.item) {
      return
    }
    const isLocked = this.item.lock
    const updateJson = () => {
      const o: IJson = {
        [this.item.key]: {
          ...this.item,
          lock: !isLocked
        }
      }
      this.setJson({ ...this.json, ...o })
      this.commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
    }
    if(isLocked) {
      const isConfirm = await this.queryBus.exec(new ConfirmQuery(
        'Do you want to unlock this project?'
      ))
      if(!isConfirm) {
        this.isLock = !this.isLock
        return
      }
      updateJson()
    }
  }

  async archive() {
    await this.commandBus.do<ArchivingCommand, void>(new ArchivingCommand(this.selected))
    this.$app.goBack()
    await this.removeHandler()
    await this.queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
  }

  async remove() {
    const isConfirm = await this.queryBus.exec(new ConfirmQuery(
      'Do you want to remove this project?'
    ))
    if(!isConfirm) {
      return
    }
    this.removeHandler()
  }

  async removeHandler() {
    await this.commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(this.selected))
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, this.selected)
    unset(buffFilter, this.selected)
    this.setFilter(buffFilter)
    this.setJson(buffJson)
    this.$app.goBack()
  }

  async save() {
    this.savingProcess = true
    const o: IJson = {
      [this.selected]: {
        key: this.selected,
        date: this.item.date,
        name: this.name,
        lock: this.isLock,
        message: this.item.message,
        file: this.item.file
      }
    }
    this.setJson({ ...this.json, ...o })
    await this.commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
    this.savingProcess = false
    this.$app.goBack()
  }

  hide() {
    this.$app.goBack()
  }
}
