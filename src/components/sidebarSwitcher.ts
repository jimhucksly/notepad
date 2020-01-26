import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'SidebarSwitcher',
})
export default class SidebarSwitcher extends Vue {
  [x: string]: any
  get isProjects() {
    return this.$store.getters['isProjectsShowed']
  }
  get isMarkdown() {
    return this.$store.getters['isMarkdown']
  }
  get legend() {
    if(this.isProjects) return 'Projects'
    if(this.isMarkdown) return '.md'
    return ''
  }
  get btnLegend() {
    if(this.isProjects) return '.md'
    if(this.isMarkdown) return 'Projects'
    return ''
  }

  protected swicth() {
    this.$store.dispatch('projects')
    this.$store.dispatch('markdown')
  }
}
