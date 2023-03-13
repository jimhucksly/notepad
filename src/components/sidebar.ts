import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { AppComponents } from '~/application/app'
import { toStr } from '~/application/fsm'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
import JsonViewerBtns from '~/components/jsonViewerBtns'
import Library from '~/components/library'
import LibraryFiles from '~/components/libraryFiles'
import Projects from '~/components/projects'
import ProjectsArchives from '~/components/projectsArchives'
import ProjectsEditor from '~/components/projectsEditor'
import { UpdateLinksCommand } from '~/domain/commands'
import { IFile, ILink, IMenu } from '~/domain/models'
import { LinksQuery } from '~/domain/queries'
import { CreateEditQuery } from '~/domain/queries/createEdit.query'
import { uniqueid } from '~/helpers'
import { Hub } from '~/plugins/hub'

@Options({
  components: {
    Projects,
    ProjectsEditor,
    ProjectsArchives,
    Library,
    LibraryFiles,
    JsonViewerBtns
  }
})
export default class Sidebar extends Vue {
  @Getter('getHistory') history: Array<keyof IFsmStates>
  @Getter('getComponent') component: string
  @Getter('getMenu') menu: Array<IMenu>
  @Getter('getFsmState') fsmState: symbol
  @Getter('getSection') section: Record<string, boolean>

  isSwitcherMenuExpanded = false
  projectEditedItemKey = ''
  isLibraryFilesInit = false

  private isExpand = false

  fileSelected: IFile = null
  onFileSelectHandler: (file: IFile) => void

  filesCheck = false

  @Watch('isProjects') onIsProjectsChanged() {
    this.projectEditedItemKey = ''
  }

  @Watch('projectEditedItemKey') onProjectEditedItemKeyChanged(v: string) {
    if (!v) {
      const cont = this.$refs.projects as Projects
      cont.clearCheck()
    }
  }

  created() {
    this.onFileSelectHandler = this.onFileSelect.bind(this)
    Hub.$on('on-file-select', this.onFileSelectHandler)
  }

  beforeUnmount() {
    Hub.$off('on-file-select', this.onFileSelectHandler)
  }

  toggle() {
    if (this.$app.state === FsmStates.Preferences) {
      return
    }
    this.isExpand = !this.isExpand
    if (this.isExpand) {
      this.isSwitcherMenuExpanded = true
      document.onclick = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.switcher')) {
          this.isExpand = !this.isExpand
          this.isSwitcherMenuExpanded = false
          document.onclick = null
        }
      }
      document.onkeydown = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          this.isExpand = !this.isExpand
          this.isSwitcherMenuExpanded = false
          document.onclick = null
          document.onkeydown = null
        }
      }
    } else {
      document.onclick = null
      document.onkeydown = null
      this.isSwitcherMenuExpanded = false
    }
  }

  select(transition: symbol) {
    this.$app.goto(transition)
    this.toggle()
  }

  toggleLibraryFiles() {
    if (this.isLibraryFilesVisibility) {
      this.$app.goBack()
    } else {
      this.$app.goto(this.$app.states.LibraryFiles)
    }
  }

  async addLink() {
    const query = new CreateEditQuery<ILink>({
      component: 'create-edit-link',
      modal: {
        title: 'Add link',
        width: '30%'
      }
    })
    const result = await this.$app.$queryBus.exec<CreateEditQuery<ILink>, ILink>(query)
    if (!result) {
      return
    }
    if (!result.id) {
      result.id = uniqueid(6) as string
    }
    await this.$app.$commandBus.do(new UpdateLinksCommand(result))
    await this.$app.$queryBus.exec(new LinksQuery())
  }

  addTodo() {
    Hub.$emit('todo-add')
  }

  onFileChange(e: InputEvent) {
    Hub.$emit('on-file-change', e)
  }

  onFileRemove() {
    Hub.$emit('on-file-remove')
  }

  onFileSelect(file: IFile) {
    this.fileSelected = file
  }

  onFileCheck() {
    this.filesCheck = !this.filesCheck
    Hub.$emit('on-file-check', this.filesCheck)
  }

  onFileDownload() {
    Hub.$emit('on-file-download')
  }

  get mainSection() {
    const found = Object.entries(this.section).find(item => item[1])
    return found[0]
  }

  get current() {
    return this.menu.find(item => toStr(item.fsmState) === AppComponents[this.mainSection])
  }

  get isNotClickable() {
    return [FsmStates.Preferences, FsmStates.Account].includes(this.$app.state)
  }

  get isProjectEditorVisibility() {
    return this.history.includes('ProjectsEditor')
  }

  get isProjectArchivesVisibility() {
    return this.history.includes('ProjectsArchives')
  }

  get isLibraryFilesVisibility() {
    return this.history.includes('LibraryFiles')
  }
}
