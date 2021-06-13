import { cloneDeep, unset } from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import { SetJsonCommand, UpdateJsonCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IArchive, IFilters, IJson } from '~/domain/models'
import { ArchivesQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'

@Component({
  name: 'Projects'
})
export default class Projects extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setFilter') setFilter: (value: IFilters) => void

  @Getter('getJson') json: IJson
  @Getter('getFilter') filter: IFilters
  @Getter('getFsmState') fsmState: symbol

  selected = ''

  @Watch('fsmState') onFsmStateChanged() {
    if(this.fsmState !== FsmStates.ProjectsEditor) {
      this.selected = ''
    }
  }

  public clearCheck() {
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
      this.$app.goto(FsmStates.ProjectsEditor)
    } else {
      this.$app.goto(FsmStates.Projects)
    }
    this.selected = isChecked ? target.dataset?.stamp ?? '' : ''
    this.$store.commit('setSelectedProjectKey', this.selected)
  }

  toggleArchives() {
    if(this.fsmState === FsmStates.ProjectsArchives) {
      this.$app.goto(FsmStates.Projects)
      return
    }
    this.$app.goto(FsmStates.ProjectsArchives)
  }

  created() {
    try {
      this.queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery())
    } catch(e) {
      console.log(e)
    }
  }

  get isArchivesInit(): boolean {
    return this.fsmState === FsmStates.ProjectsArchives
  }
}
