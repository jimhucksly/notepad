import { Vue, Component, Watch } from 'vue-property-decorator'
import SidebarSwitcher from '~/components/sidebarSwitcher'
import Projects from '~/components/projects'
import ProjectsEditor from '~/components/projectsEditor'
import ProjectsArchives from '~/components/projectsArchives'
import Library from '~/components/library'
import LibraryFiles from '~/components/libraryFiles'
import JsonViewerBtns from '~/components/jsonViewerBtns'
import LinksBtns from '~/components/linksBtns'
import TodoBtns from '~/components/todoBtns'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'

@Component({
  name: 'Sidebar',
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
  @Getter('getFsmState') fsmState: symbol

  isSwitcherMenuExpanded = false
  projectEditedItemKey = ''
  isProjectsArchivesInit = false
  isLibraryFilesInit = false

  get isProjectEditorVisibility() {
    if(this.isPreferences || !this.isProjects) {
      return false
    }
    if(this.isSwitcherMenuExpanded) {
      return !!this.projectEditedItemKey
    }
    return true
  }
  get isProjectArchivesVisibility() {
    if(this.isPreferences || !this.isProjects) {
      return false
    }
    if(this.isSwitcherMenuExpanded) {
      return this.isProjectsArchivesInit
    }
    return true
  }

  get isLibraryFilesVisibility() {
    if(!this.isLibrary) {
      this.isLibraryFilesInit = false
      return false
    }
    if(this.isSwitcherMenuExpanded) {
      return this.isLibraryFilesInit
    }
    return true
  }

  @Watch('isProjects')
  onIsProjectsChanged(v: boolean) {
    this.projectEditedItemKey = ''
  }

  @Watch('projectEditedItemKey')
  onProjectEditedItemKeyChanged(v: string) {
    if(!v) {
      const cont = this.$refs.projects as Projects
      cont.clearCheck()
    }
  }

  get isPreferences(): boolean {
    return this.fsmState === FsmStates.Preferences
  }

  get isProjects(): boolean {
    return this.fsmState === FsmStates.Projects
  }

  get isLibrary(): boolean {
    return this.fsmState === FsmStates.Library
  }

  get isJsonViewer(): boolean {
    return this.fsmState === FsmStates.JsonViewer
  }

  get isLinks(): boolean {
    return this.fsmState === FsmStates.Links
  }

  get isTodo(): boolean {
    return this.fsmState === FsmStates.Todo
  }
}
