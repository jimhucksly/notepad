import { Vue, Component, Watch } from 'vue-property-decorator'
import SidebarSwitcher from '~/components/sidebarSwitcher'
import Projects from '~/components/projects'
import ProjectsEditor from '~/components/ProjectsEditor'
import SidebarTree from '~/components/sidebarTree'
import JsonViewerBtns from '~/components/JsonViewerBtns'
import LinksBtns from '~/components/LinksBtns'
import TodoBtns from '~/components/TodoBtns'
import { identity } from 'lodash'

@Component({
  name: 'Sidebar',
  components: {
    SidebarSwitcher,
    Projects,
    ProjectsEditor,
    SidebarTree,
    JsonViewerBtns,
    LinksBtns,
    TodoBtns
  }
})
export default class Sidebar extends Vue {
  isSwitcherMenuExpanded: boolean = false

  projectEditedItemKey: string = ''

  get isPreferences() {
    return this.$store.getters.getIsPreferencesShow
  }
  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get isMarkdown() {
    return this.$store.getters.getIsMarkdownShow
  }
  get isJsonViewer() {
    return this.$store.getters.getIsJsonViewerShow
  }
  get isLinks() {
    return this.$store.getters.getIsLinksShow
  }
  get isTodo() {
    return this.$store.getters.getIsTodoShow
  }
  get mdTree() {
    return this.$store.getters.getMdTree
  }

  @Watch('isProjects')
  onIsProjectsChanged(v: boolean) {
    this.projectEditedItemKey = ''
  }

  @Watch('projectEditedItemKey')
  onProjectEditedItemKeyChanged(v: string) {
    if(!v) {
      const cont: any = this.$refs.projects
      cont.clearCheck()
    }
  }
}
