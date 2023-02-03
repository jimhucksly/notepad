import { cloneDeep, unset } from 'lodash'
import { Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { IFsmStates } from '~/application/fsm.states'
import { _container } from '~/domain/container'
import { IQueryBus } from '~/domain/interfaces'
import { IArchive, IFilters, IJson } from '~/domain/models'
import { ArchivesQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'

export default class Projects extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Mutation('projects/setFilter') setFilter: (value: IFilters) => void
  @Mutation('projects/setSelectedProjectKey') setSelectedProject: (value: string) => void

  @Getter('projects/getJson') json: IJson
  @Getter('projects/getFilter') filter: IFilters
  @Getter('getFsmState') fsmState: symbol
  @Getter('getHistory') history: Array<keyof IFsmStates>

  selected = ''

  @Watch('fsmState') onFsmStateChanged() {
    if (this.fsmState !== this.$app.states.ProjectsEditor) {
      this.selected = ''
    }
  }

  public clearCheck() {
    const input: NodeListOf<Element> = document.querySelectorAll('input[type="checkbox"]:checked')
    if (input && input[0]) {
      (input[0] as HTMLInputElement).checked = false
    }
  }

  toggleFilter(e: MouseEvent, stamp: string): void | null {
    const items = this.$el.querySelectorAll('[data-role="projects-item"]')
    let item: HTMLElement = null
    items.forEach((el: HTMLElement) => {
      if (el.dataset.stamp === stamp) {
        item = el
      }
    })
    if (!item) {
      return
    }
    const target = e.target as HTMLElement
    if (target.closest('.projects_item_check')) {
      return null
    }
    if (target.tagName === 'DIV' || target.tagName === 'LABEL') {
      if (item.classList.contains('active')) {
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
    if (isChecked) {
      if (this.isArchivesInit) {
        this.$app.goBack()
      }
      this.$app.goto(this.$app.states.ProjectsEditor)
    } else {
      this.$app.goBack()
    }
    this.selected = isChecked ? target.dataset?.stamp ?? '' : ''
    this.setSelectedProject(this.selected)
  }

  toggleArchives() {
    if (this.isArchivesInit) {
      this.$app.goBack()
    } else {
      if (this.isEditorInit) {
        this.$app.goBack()
      }
      this.$app.goto(this.$app.states.ProjectsArchives)
    }
  }

  created() {
    try {
      this.queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  get isArchivesInit(): boolean {
    return this.history.includes('ProjectsArchives')
  }

  get isEditorInit(): boolean {
    return this.history.includes('ProjectsEditor')
  }
}
