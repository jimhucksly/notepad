import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { AppComponents } from '~/application/app'
import { toStr } from '~/application/fsm'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
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

  toggleLibraryFiles() {
    if(this.isLibraryFilesVisibility) {
      this.$app.goBack()
    } else {
      this.$app.goto(FsmStates.LibraryFiles)
    }
  }

  @Watch('isProjects') onIsProjectsChanged() {
    this.projectEditedItemKey = ''
  }

  @Watch('projectEditedItemKey') onProjectEditedItemKeyChanged(v: string) {
    if(!v) {
      const cont = this.$refs.projects as Projects
      cont.clearCheck()
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

  get isPreferences(): boolean {
    return this.component === AppComponents[toStr(FsmStates.Preferences)]
  }

  get isProjects(): boolean {
    return this.component === AppComponents[toStr(FsmStates.Projects)]
  }

  get isLibrary(): boolean {
    return this.component === AppComponents[toStr(FsmStates.Library)]
  }

  get isJsonViewer(): boolean {
    return this.component === AppComponents[toStr(FsmStates.JsonViewer)]
  }

  get isLinks(): boolean {
    return this.component === AppComponents[toStr(FsmStates.Links)]
  }

  get isTodo(): boolean {
    return this.component === AppComponents[toStr(FsmStates.Todo)]
  }

  get isEvents(): boolean {
    return this.component === AppComponents[toStr(FsmStates.Events)]
  }

  get switcherProps() {
    return {
      isPreferences: this.isPreferences,
      isProjects: this.isProjects,
      isLibrary: this.isLibrary,
      isEvents: this.isEvents,
      isJsonViewer: this.isJsonViewer,
      isLinks: this.isLinks,
      isTodo: this.isTodo
    }
  }
}
