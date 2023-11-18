import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { FsmStates, toStr } from '~/application/app'
import Library from '~/components/library'
import LibraryFiles from '~/components/libraryFiles'
import Projects from '~/components/projects'
import ProjectsArchives from '~/components/projectsArchives'
import ProjectsEditor from '~/components/projectsEditor'
import { IManifest } from '~/domain/interfaces'
import { IMenu } from '~/domain/models'

@Options({
  components: {
    Projects,
    ProjectsEditor,
    ProjectsArchives,
    Library,
    LibraryFiles
  }
})
export default class Sidebar extends Vue {
  @Getter('getHistory') history: Array<keyof typeof FsmStates>
  @Getter('getComponent') component: string
  @Getter('getMenu') menu: Array<IMenu>
  @Getter('getFsmState') fsmState: symbol
  @Getter('getSection') section: Record<string, boolean>
  @Getter('getManifest') manifest: IManifest
  @Getter('getSections') sections: Record<string, string>

  isSwitcherMenuExpanded = false
  projectEditedItemKey = ''
  isLibraryFilesInit = false

  isExpand = false

  components: Array<{ name: string, fsmState: string }> = []

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
    if (this.manifest) {
      this.manifest.main.forEach(item => {
        this.components.push({
          name: item.name + '-Sidebar',
          fsmState: toStr(this.$app.states[item.name as keyof typeof this.$app.states])
        })
      })
    }
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

  get mainSection() {
    const found = Object.entries(this.section).find(item => item[1])
    return found[0]
  }

  get current() {
    return this.menu.find(item => toStr(item.fsmState) === this.mainSection)
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
