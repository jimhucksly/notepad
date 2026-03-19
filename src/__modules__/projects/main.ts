import { cloneDeep, isEmpty, unset } from 'lodash';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { checkLinks, now } from '~/helpers';
import { CreateProjectCommand, DeleteProjectCommand, ReadCommand } from './commands/commands';
import Item from './item/item.vue';
import { IFilters, IProjects } from './models';
import { ArchivesQuery, ProjectsQuery } from './queries/queries';

@Options({
  components: {
    Item,
  },
  beforeUnmount() {
    const notepadCont = this.$refs.notepad_cont as HTMLElement;
    notepadCont.removeEventListener('scroll', this.onScrollHandler);
  },
})
export default class Projects extends Vue {
  @Mutation('Projects/setJson') setJson: (value: IProjects) => void;
  @Mutation('Projects/setFilter') setFilter: (value: IFilters) => void;

  @Getter('Projects/getProjects') json: IProjects;
  @Getter('Projects/getFilter') filter: IFilters;

  message = '';
  newMsgFlag = false;
  isRendered = false;
  removeStack: Array<string> = [];

  onScrollHandler: () => void = null;

  @Watch('hasFilter') onHasFilterChanged(flag: boolean) {
    const notepadCont = this.$refs.notepad_cont as HTMLElement;
    if (flag) {
      notepadCont.scrollTo(0, 0);
    } else {
      this.$nextTick(() => {
        notepadCont.scrollTop = notepadCont.scrollHeight;
      });
    }
  }

  @Watch('isRendered') onIsRenderedChange() {
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement;
      notepadCont.scrollTop = notepadCont.scrollHeight;
    });
  }

  updated() {
    this.read();
  }

  created() {
    this.fetchProjects();
  }

  mounted() {
    const notepadCont = this.$refs.notepad_cont as HTMLElement;
    this.onScrollHandler = this.read.bind(this);
    notepadCont.addEventListener('scroll', this.onScrollHandler);
    this.$app.$queryBus.exec(new ArchivesQuery());
  }

  send() {
    if (!this.message.length) {
      return;
    }
    this.newMsgFlag = true;
    const { date, stamp } = now();
    const o: IProjects = {
      [stamp]: {
        key: stamp,
        date,
        name: '',
        lock: false,
        message: checkLinks(this.message),
      },
    };
    this.message = '';
    this.setJson({ ...this.json, ...o });
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement;
      notepadCont.scrollTop = notepadCont.scrollHeight;
      this.$app.$commandBus.do<CreateProjectCommand, boolean>(new CreateProjectCommand(o));
    });
  }

  read() {
    const self = this.$refs.notepad_cont as HTMLElement;
    const rect = self.getBoundingClientRect();
    const viewportHeight = rect.top + rect.height;
    const unread: NodeListOf<HTMLElement> = self.querySelectorAll('.unread');
    unread.forEach((el: HTMLElement) => {
      const elRect = el.getBoundingClientRect();
      if (elRect.top < viewportHeight) {
        if (!el.classList.contains('.will-be-marked')) {
          setTimeout(() => {
            this.$app.$commandBus.do<ReadCommand, void>(new ReadCommand(el.dataset.stamp));
            el.classList.remove('unread');
            el.classList.remove('will-be-marked');
            const hasStyle = el.attributes.getNamedItem('style');
            if (hasStyle) {
              el.attributes.removeNamedItem('style');
            }
          }, 2000);
        }
        el.classList.add('will-be-marked');
        el.style.transition = 'all 0.5s';
      }
    });
  }

  async onRemove(stamp: string) {
    const buffJson = cloneDeep(this.json);
    const buffFilter = cloneDeep(this.filter);
    unset(buffJson, stamp);
    unset(buffFilter, stamp);
    this.setFilter(buffFilter);
    this.setJson(buffJson);
    this.removeStack.push(stamp);
    if (this.removeStack[0] === stamp) {
      await this.$app.$commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(stamp));
      this.removeStack = this.removeStack.filter(el => el !== stamp);
      if (this.removeStack.length) {
        this.onRemove(this.removeStack[0]);
      }
    }
  }

  private fetchProjects() {
    this.$app.$queryBus.exec(new ProjectsQuery());
  }

  get count(): number {
    return this.json ? Object.keys(this.json).length : 0;
  }

  get lastStamp(): string {
    return this.count ? Object.keys(this.json)[this.count - 1] : '';
  }

  get hasFilter(): boolean {
    return !isEmpty(this.filter);
  }
}
