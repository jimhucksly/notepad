import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { AppComponents } from '~/application/app'
import { toStr } from '~/application/fsm'
import { IFsmStates } from '~/application/fsm.states'
import JsonViewerBtns from '~/components/jsonViewerBtns'
import Library from '~/components/library'
import LibraryFiles from '~/components/libraryFiles'
import LinksBtns from '~/components/linksBtns'
import Projects from '~/components/projects'
import ProjectsArchives from '~/components/projectsArchives'
import ProjectsEditor from '~/components/projectsEditor'
import SidebarSwitcher from '~/components/sidebarSwitcher'
import TodoBtns from '~/components/todoBtns'

@Options({
  components: {
    SidebarSwitcher,
    Projects,
    ProjectsEditor,
    ProjectsArchives,
    Library,
    LibraryFiles,
    JsonViewerBtns,
    LinksBtns,
    TodoBtns
  }
})
export default class Sidebar extends Vue {
  @Getter('getHistory') history: Array<keyof IFsmStates>
  @Getter('getComponent') component: string

  isSwitcherMenuExpanded = false
  projectEditedItemKey = ''
  isLibraryFilesInit = false

  @Watch('isProjects') onIsProjectsChanged() {
    this.projectEditedItemKey = ''
  }

  @Watch('projectEditedItemKey') onProjectEditedItemKeyChanged(v: string) {
    if (!v) {
      const cont = this.$refs.projects as Projects
      cont.clearCheck()
    }
  }

  toggleLibraryFiles() {
    if (this.isLibraryFilesVisibility) {
      this.$app.goBack()
    } else {
      this.$app.goto(this.$app.states.LibraryFiles)
    }
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

  get isAccount(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Account)]
  }

  get isPreferences(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Preferences)]
  }

  get isProjects(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Projects)]
  }

  get isLibrary(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Library)]
  }

  get isJsonViewer(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.JsonViewer)]
  }

  get isLinks(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Links)]
  }

  get isTodo(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Todo)]
  }

  get isEvents(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Events)]
  }

  get isFiles(): boolean {
    return this.component === AppComponents[toStr(this.$app.states.Files)]
  }
}
