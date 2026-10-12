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

  mounted() {
    this.$app.$queryBus.exec<EventsQuery, Array<IEvent>>(new EventsQuery());
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

  fetchData(searchTerm: string = ''): Array<{ key: string; title: string }> {
    if (!searchTerm) {
      return [];
    }
    const result: Array<{ key: string; title: string }> = [];
    Object.keys(this.items).forEach((key: string) => {
      const title = this.items[key].title.toLowerCase();
      const content = this.items[key].content.toLowerCase();
      if (title.indexOf(searchTerm) > -1 || content.indexOf(searchTerm) > -1) {
        result.push({
          key,
          title: this.items[key].title,
        });
      }
    });
    return result;
  }
}
