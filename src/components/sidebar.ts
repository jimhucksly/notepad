import { Vue, Component } from 'vue-property-decorator'
import SidebarSwitcher from '~/components/sidebarSwitcher'
import Projects from '~/components/projects'
import SidebarTree from '~/components/sidebarTree'

@Component({
  name: 'Sidebar',
  components: {
    SidebarSwitcher,
    Projects,
    SidebarTree
  }
})
export default class Sidebar extends Vue {
  isSwitcherMenuExpanded: boolean = false

  get isPreferences() {
    return this.$store.getters.isPreferencesShowed
  }
  get isProjects() {
    return this.$store.getters.isProjectsShowed
  }
  get isMarkdown() {
    return this.$store.getters.isMarkdownShowed
  }
  get mdTree() {
    return this.$store.getters.getMdTree
  }
}
