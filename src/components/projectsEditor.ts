import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep, unset } from 'lodash'
import { IFilters, IJson, IJsonItem } from '~/domain/models'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { ArchivingCommand, DeleteProjectCommand, SetFilterCommand, SetJsonCommand, UpdateJsonCommand } from '~/domain/commands'
import { ArchivesQuery } from '~/domain/queries'

@Component({
  name: 'ProjectsEditor'
})
export default class ProjectsEditor extends Vue {
  @Prop()
  itemStamp!: string

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

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

  protected toggleLock(v: boolean): void {
    if(!v) {
      this.$electron.ipcRenderer.send('open-dialog-unlock-confirm')
      this.isDialog = true
    } else {
      this.isLock = v
    }
  }

  protected async archive() {
    await this.commandBus.do(new ArchivingCommand(this.itemStamp))
    this.removeHandler()
    await this.queryBus.exec(new ArchivesQuery())
  }

  protected remove() {
    this.$electron.ipcRenderer.send('open-dialog-remove-confirm')
    this.$electron.ipcRenderer.once('remove-is-confimed', () => {
      this.removeHandler()
    })
  }

  protected async removeHandler() {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, this.itemStamp)
    unset(buffFilter, this.itemStamp)
    this.commandBus.do(new SetJsonCommand(buffJson))
    this.commandBus.do(new SetFilterCommand(buffFilter))
    await this.commandBus.do(new DeleteProjectCommand(this.itemStamp))
    this.$emit('update:itemStamp', '')
  }

  protected async save() {
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
    this.commandBus.do(new SetJsonCommand({ ...this.json, ...o }))
    await this.commandBus.do(new UpdateJsonCommand(o))
    this.$emit('update:itemStamp', '')
  }

  protected hide() {
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
