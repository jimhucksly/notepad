import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { IArchive, IFilters, IJson, IJsonItem } from '~/domain/models'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { ArchivingCommand, DeleteProjectCommand, EditProjectCommand } from '~/domain/commands'
import { ArchivesQuery } from '~/domain/queries'
import { Getter, Mutation } from 'vuex-class'
import { ConfirmQuery } from '~/domain/queries/confirm.query'

@Component({
  name: 'ProjectsEditor'
})
export default class ProjectsEditor extends Vue {
  @Prop() expanded: boolean

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setFilter') setFilter: (value: IFilters) => void

  @Getter('getJson') json: IJson
  @Getter('getFilter') filter: IFilters
  @Getter('getSelectedProjectKey') selected: string

  name = ''
  isLock = false
  isDialog = false

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
    const isLocked = this.item.lock
    const updateJson = () => {
      const o: IJson = {
        [this.item.key]: {
          ...this.item,
          lock: !isLocked
        }
      }
      this.$store.commit('setJson', { ...this.json, ...o })
      this.commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
    }
    if(isLocked) {
      const isConfirm = await this.queryBus.exec(new ConfirmQuery(
        'Do you want to unlock this project?'
      ))
      if(!isConfirm) {
        return
      }
    }
    updateJson()
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
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, this.selected)
    unset(buffFilter, this.selected)
    this.setFilter(buffFilter)
    this.$store.commit('setJson', buffJson)
    await this.commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(this.selected))
    this.$app.goBack()
  }

  async save() {
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
    this.$store.commit('setJson', { ...this.json, ...o })
    await this.commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
    this.$app.goBack()
  }

  hide() {
    this.$app.goBack()
  }
}
