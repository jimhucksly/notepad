import { cloneDeep, unset } from 'lodash';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import Archives from './archives/archives';
import { IArchive, IFilters, IProjects } from './models';
import Properties from './properties/properties';
import { ArchivesQuery } from './queries/queries';

@Options({
  components: {
    Archives,
    Properties,
  },
})
export default class Projects extends Vue {
  @Mutation('Projects/setFilter') setFilter: (value: IFilters) => void;
  @Mutation('Projects/setSelectedProjectKey') setSelectedProject: (value: string) => void;

  @Getter('Projects/getProjects') json: IProjects;
  @Getter('Projects/getFilter') filter: IFilters;
  @Getter('getFsmState') fsmState: symbol;

  selected = '';

  isArchivesExpaned = false;
  isPropertiesExpanded = false;

  @Watch('isJsonLoaded') async onReady() {
    try {
      await this.$app.$queryBus.exec<ArchivesQuery, Array<IArchive>>(new ArchivesQuery());
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    }
  }

  public clearCheck() {
    const input: NodeListOf<Element> = document.querySelectorAll('input[type="checkbox"]:checked');
    if (input && input[0]) {
      (input[0] as HTMLInputElement).checked = false;
    }
  }

  toggleFilter(e: MouseEvent, stamp: string): void | null {
    const items = (this.$refs.projects as HTMLElement).querySelectorAll('[data-role="projects-item"]');
    let item: HTMLElement = null;
    items.forEach((el: HTMLElement) => {
      if (el.dataset.stamp === stamp) {
        item = el;
      }
    });
    if (!item) {
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest('.projects_item_check')) {
      return null;
    }
    if (target.tagName === 'DIV' || target.tagName === 'LABEL') {
      if (item.classList.contains('active')) {
        const buff = cloneDeep(this.filter);
        unset(buff, stamp);
        this.setFilter({ ...buff });
      } else {
        this.setFilter({ ...this.filter, [stamp]: true });
      }
    }
  }

  toggleCheck(e: InputEvent, key: string) {
    const flag = (e.target as HTMLInputElement).checked;
    this.isPropertiesExpanded = flag;
    this.isArchivesExpaned = false;
    if (flag) {
      this.selected = key;
      this.setSelectedProject(this.selected);
    } else {
      this.selected = null;
    }
  }

  toggleArchives() {
    if (this.isPropertiesExpanded) {
      this.onPropertiesHide();
    }
    this.isArchivesExpaned = !this.isArchivesExpaned;
  }

  onPropertiesHide() {
    const inputs = (this.$refs.projects as HTMLElement).querySelectorAll('input');
    for (const el of inputs) {
      if (el.dataset.stamp === this.selected) {
        el.click();
      }
    }
  }

  onArchivesHide() {
    this.isArchivesExpaned = !this.isArchivesExpaned;
  }

  get isJsonLoaded(): boolean {
    return Boolean(this.json);
  }
}
