import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { IArchive, IFilters, IJson, IJsonItem } from '~/domain/models'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { ArchivingCommand, DeleteProjectCommand, SetJsonCommand, UpdateJsonCommand } from '~/domain/commands'
import { ArchivesQuery } from '~/domain/queries'
import { Mutation } from 'vuex-class'

@Component({
  name: 'ProjectsEditor'
})
export default class ProjectsEditor extends Vue {
  @Prop()
  itemStamp!: string

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setFilter') setFilter: (value: IFilters) => void

  name = ''
  isLock = false
  isDialog = false

  get json(): IJson {
    return this.$store.getters.getJson
  }

  get filter(): IFilters {
    return this.$store.getters.getFilter
  }

  get item(): IJsonItem {
    return this.json[this.itemStamp] || null
  }

  get isFile(): boolean {
    return this.item && !!this.item.file
  }

  @Watch('item')
  onItemChanged(o: IJsonItem) {
    if(o) {
      this.name = o.name
      this.isLock = o.lock
    } else {
      this.name = ''
      this.isLock = false
    }
  }

  toggleLock(v: boolean): void {
    if(!v) {
      this.$electron.ipcRenderer.send('open-dialog-unlock-confirm')
      this.isDialog = true
    } else {
      this.isLock = v
    }
  }

  async archive() {
    await this.commandBus.do<ArchivingCommand, void>(new ArchivingCommand(this.itemStamp))
    this.removeHandler()
    await this.queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
  }

  remove() {
    this.$electron.ipcRenderer.send('open-dialog-remove-confirm')
    this.$electron.ipcRenderer.once('remove-is-confimed', () => {
      this.removeHandler()
    })
  }

  async removeHandler() {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, this.itemStamp)
    unset(buffFilter, this.itemStamp)
    this.setFilter(buffFilter)
    this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand(buffJson))
    await this.commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(this.itemStamp))
    this.$emit('update:itemStamp', '')
  }

  async save() {
    const o: IJson = {
      [this.itemStamp]: {
        key: this.itemStamp,
        date: this.item.date,
        name: this.name,
        lock: this.isLock,
        message: this.item.message,
        file: this.item.file
      }
    }
    this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand({ ...this.json, ...o }))
    await this.commandBus.do<UpdateJsonCommand, void>(new UpdateJsonCommand(o))
    this.$emit('update:itemStamp', '')
  }

  hide() {
    this.$emit('update:itemStamp', '')
  }

  mounted() {
    this.$electron.ipcRenderer.on('unlock-is-confimed', () => {
      this.isLock = false
      this.$nextTick(() => {
        this.isDialog = false
      })
    })

    this.$electron.ipcRenderer.on('unlock-is-unconfimed', () => {
      this.isDialog = false
    })
  }
}
