import { cloneDeep, unset } from 'lodash'
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ArchivingCommand, DeleteProjectCommand, EditProjectCommand } from '~/domain/commands'
import { IArchive, IFilters, IProjects, IProject } from '~/domain/models'
import { ArchivesQuery } from '~/domain/queries'
import { ConfirmQuery } from '~/domain/queries/confirm.query'

export default class ProjectsEditor extends Vue {
  @Prop() expanded: boolean

  @Mutation('projects/setFilter') setFilter: (value: IFilters) => void
  @Mutation('projects/setJson') setJson: (value: IProjects) => void
  @Mutation('projects/setSelectedProjectKey') setSelectedProject: (value: string) => void

  @Getter('projects/getProjects') json: IProjects
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

  @Watch('item') onItemChanged(o: IProject) {
    if (o) {
      this.name = o.name
      this.isLock = o.lock
    } else {
      this.name = ''
      this.isLock = false
    }
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
    await this.$app.$commandBus.do<ArchivingCommand, void>(new ArchivingCommand(this.selected))
    this.removeHandler()
    this.$app.$queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
    this.$app.goBack()
  }

  async remove() {
    const isConfirm = await this.$app.$queryBus.exec(new ConfirmQuery(
      'Do you want to remove this project?'
    ))
    if (!isConfirm) {
      return
    }
    await this.$app.$commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(this.selected))
    this.removeHandler()
  }

  removeHandler() {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, this.selected)
    unset(buffFilter, this.selected)
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
        message: this.item.message
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

  get item(): IProject {
    if (!this.json) {
      return null
    }
    return this.json[this.selected]
  }
}
