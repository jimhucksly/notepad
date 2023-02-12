import { cloneDeep, unset } from 'lodash'
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ArchivingCommand, DeleteProjectCommand, EditProjectCommand } from '~/domain/commands'
import { IArchive, IFilters, IProjects, IProjectsItem } from '~/domain/models'
import { ArchivesQuery } from '~/domain/queries'
import { ConfirmQuery } from '~/domain/queries/confirm.query'

export default class ProjectsEditor extends Vue {
  @Prop() expanded: boolean

  @Mutation('projects/setFilter') setFilter: (value: IFilters) => void
  @Mutation('projects/setJson') setJson: (value: IProjects) => void
  @Mutation('projects/setSelectedProjectKey') setSelectedProject: (value: string) => void

  @Getter('projects/getJson') json: IProjects
  @Getter('projects/getFilter') filter: IFilters
  @Getter('projects/getSelectedProjectKey') selected: string

  name = ''
  isLock = false
  isDialog = false
  savingProcess = false

  @Watch('expanded') onExpandedChanged() {
    if (!this.expanded) {
      this.setSelectedProject('')
    }
  }

  @Watch('item') onItemChanged(o: IProjectsItem) {
    if (o) {
      this.name = o.name
      this.isLock = o.lock
    } else {
      this.name = ''
      this.isLock = false
    }
  }

  get item(): IProjectsItem {
    if (!this.json) {
      return null
    }
    return this.json[this.selected]
  }

  get isFile(): boolean {
    return this.item && !!this.item.file
  }

  async toggleLock(): Promise<void> {
    if (!this.item) {
      return
    }
    const isLocked = this.item.lock
    const updateJson = () => {
      const o: IProjects = {
        [this.item.key]: {
          ...this.item,
          lock: !isLocked
        }
      }
      this.setJson({ ...this.json, ...o })
      this.$app.$commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
    }
    if (isLocked) {
      const isConfirm = await this.$app.$queryBus.exec(new ConfirmQuery(
        'Do you want to unlock this project?'
      ))
      if (!isConfirm) {
        this.isLock = !this.isLock
        return
      }
      updateJson()
    }
  }

  async archive() {
    const selected = this.selected
    this.$app.goBack()
    await this.$app.$commandBus.do<ArchivingCommand, void>(new ArchivingCommand(selected))
    await this.removeHandler(selected)
    await this.$app.$queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
  }

  async remove() {
    const isConfirm = await this.$app.$queryBus.exec(new ConfirmQuery(
      'Do you want to remove this project?'
    ))
    if (!isConfirm) {
      return
    }
    this.removeHandler()
  }

  async removeHandler(selected?: string) {
    await this.$app.$commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(selected || this.selected))
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, selected || this.selected)
    unset(buffFilter, selected || this.selected)
    this.setFilter(buffFilter)
    this.setJson(buffJson)
  }

  async save() {
    this.savingProcess = true
    const o: IProjects = {
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
    await this.$app.$commandBus.do<EditProjectCommand, void>(new EditProjectCommand(o))
    this.savingProcess = false
    this.$app.goBack()
  }

  hide() {
    this.$app.goBack()
  }
}
