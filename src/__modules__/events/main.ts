import { debounce } from 'lodash';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import BCalendarComponent, { IBCalendar } from './calendar';
import { DeleteEventCommand, UpdateEventCommand } from './commands/commands';
import { IEvent, IEvents } from './models';
import { EventsQuery } from './queries/queries';

interface IBCalendarOptions {
  eventsMode: boolean;
  items: IEvent | null;
  disableDaysBefore: boolean;
  setDate?: string;
  modelType?: {
    date: string;
    title: string;
    content: string;
  };
}

interface ISelected {
  key: string;
  title: string;
}

interface IFilteredItem {
  key: string;
  title: string;
}

@Options({
  components: {
    'b-calendar': BCalendarComponent,
  },
})
export default class Events extends Vue {
  @Getter('Events/getEvents') items: IEvents;

  bCalendarOptions: IBCalendarOptions = {
    eventsMode: true,
    items: null,
    disableDaysBefore: false,
    modelType: {
      date: 'date',
      title: 'title',
      content: 'content',
    },
  };
  bCalendarFormShow = false;

  headerText = '';
  search = '';
  itemsFiltered: Array<IFilteredItem> = [];

  @Watch('items') onItemsReceived(o: IEvent) {
    this.bCalendarOptions = {
      ...this.bCalendarOptions,
      items: o,
    };
    const elems: NodeListOf<Element> = document.querySelectorAll('.processing[data-current]');
    if (elems && elems.length) {
      elems.forEach(el => {
        el.classList.remove('processing');
      });
    }
  }

  private readonly debounced = debounce((v: string, context: Events): void => {
    context.itemsFiltered = [];
    if (!v) {
      return;
    }
    if (!context?.items) {
      context.itemsFiltered.push({
        key: '0',
        title: 'Nothing to show',
      });
      return;
    }
    Object.keys(context.items).forEach((key: string) => {
      const title = context.items[key].title.toLowerCase();
      const content = context.items[key].content.toLowerCase();
      if (title.indexOf(v) > -1 || content.indexOf(v) > -1) {
        context.itemsFiltered.push({
          key,
          title: context.items[key].title,
        });
      }
    });
    if (context.itemsFiltered.length === 0) {
      context.itemsFiltered.push({
        key: '0',
        title: 'Nothing to show',
      });
    }
    document.onkeydown = e => {
      if (e.code === 'Escape') {
        context.itemsFiltered = [];
        context.search = '';
        document.onclick = null;
        document.onkeydown = null;
      }
    };
    document.onclick = e => {
      e.preventDefault();
      const el = e.target as HTMLElement;
      if (el.closest('.events__search > form') === null) {
        context.itemsFiltered = [];
        context.search = '';
      }
    };
  }, 600);

  @Watch('search') onSearchChanged(val: string) {
    if (!val) {
      return;
    }
    this.debounced(val.toLowerCase(), this);
  }

  prev() {
    const elem = this.$refs.calendar as IBCalendar;
    elem.prevMonth();
  }
  next() {
    const elem = this.$refs.calendar as IBCalendar;
    elem.nextMonth();
  }
  today() {
    const elem = this.$refs.calendar as IBCalendar;
    elem.setToday();
  }

  setHeader(v: string) {
    this.headerText = v;
  }

  async save(event: IEvent) {
    const elem = document.querySelector('[data-current="' + event.date + '"]');
    if (elem) {
      elem.classList.add('processing');
    }
    await this.$app.$commandBus.do<UpdateEventCommand, void>(new UpdateEventCommand(event));
  }

  async remove(date: string) {
    const elem = document.querySelector('[data-current="' + date + '"]');
    if (elem) {
      elem.classList.add('processing');
    }
    await this.$app.$commandBus.do<DeleteEventCommand, void>(new DeleteEventCommand(date));
  }

  itemSelected(item: ISelected): void {
    if (item.key === '0') {
      //
    } else {
      this.bCalendarOptions = {
        ...this.bCalendarOptions,
        setDate: item.key,
      };
      this.itemsFiltered = [];
      this.search = '';
    }
  }

  mounted() {
    this.$app.$queryBus.exec<EventsQuery, Array<IEvent>>(new EventsQuery());
  }
}
