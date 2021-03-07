import { Vue, Component, Watch } from 'vue-property-decorator'
import SidebarSwitcher from '~/components/sidebarSwitcher'
import Projects from '~/components/projects'
import ProjectsEditor from '~/components/projectsEditor'
import ProjectsArchives from '~/components/projectsArchives'
import SidebarTree from '~/components/sidebarTree'
import JsonViewerBtns from '~/components/jsonViewerBtns'
import LinksBtns from '~/components/linksBtns'
import TodoBtns from '~/components/todoBtns'
import { Getter } from 'vuex-class'
import { ITreeItem } from '~/domain/models'

@Component({
  name: 'Sidebar',
  components: {
    SidebarSwitcher,
    Projects,
    ProjectsEditor,
    ProjectsArchives,
    SidebarTree,
    JsonViewerBtns,
    LinksBtns,
    TodoBtns
  }
})
export default class Sidebar extends Vue {
  @Getter('getIsPreferencesShow') isPreferences: boolean
  @Getter('getIsProjectsShow') isProjects: boolean
  @Getter('getIsLibraryShow') isLibrary: boolean
  @Getter('getIsJsonViewerShow') isJsonViewer: boolean
  @Getter('getIsLinksShow') isLinks: boolean
  @Getter('getIsTodoShow') isTodo: boolean
  @Getter('getLibraryTree') mdTree: Array<ITreeItem>

  isSwitcherMenuExpanded = false
  projectEditedItemKey = ''
  isProjectsArchivesInit = false

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
}
