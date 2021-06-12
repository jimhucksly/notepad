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
  @Getter('getFsmState') fsmState: string

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

  get isPreferences() {
    return this.fsmState === 'Preferences'
  }

  get isProjects(): boolean {
    return this.fsmState === 'Projects'
  }

  get isLibrary(): boolean {
    return this.fsmState === 'Library'
  }

  get isJsonViewer(): boolean {
    return this.fsmState === 'JsonViewer'
  }

  get isLinks(): boolean {
    return this.fsmState === 'Links'
  }

  get isTodo(): boolean {
    return this.fsmState === 'Todo'
  }
}
