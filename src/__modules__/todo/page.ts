import { eventBus } from '@dn-web/core';
import { ConfirmDialog, CreateEditDialog, DialogManager } from '@dn-web/ui';
import { isEqual } from 'lodash';
import cloneDeep from 'lodash-es/cloneDeep';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { indexOf, now } from '~/helpers';
import { DeleteTodoCommand, TodoOrderCommand, UpdateTodoCommand } from './commands/commands';
import { ITodo, ITodoItem, ITodoOrder } from './models';
import { TodoQuery } from './queries/queries';

const sortByOrder = (a: ITodoItem, b: ITodoItem) => (a.order < b.order ? -1 : 1);

@Options({
  beforeUnmount() {
    eventBus.$off('todo-add', this.addTodoHandler);
  },
})
export default class Todo extends Vue {
  @Getter('Todo/getTodo') json: ITodo;

  items: Array<ITodoItem> = [];
  order: Array<string> = [];
  isDrag = false;
  loading = false;

  @Watch('json') onJsonChanged() {
    this.setItems();
    this.setOrder();
  }

  async mounted() {
    try {
      this.loading = true;
      await this.$app.$queryBus.exec<TodoQuery, Array<ITodo>>(new TodoQuery());
      this.loading = false;
      eventBus.$on('todo-add', this.addTodo);
    } catch (e) {
      /* eslint-disable no-console */
      console.log(e);
    }
  }

  beforeUnmount() {
    eventBus.$off('todo-add', this.addTodo);
  }

  onMouseDown(event: MouseEvent, id: string) {
    if (event.button > 0) {
      /**
       * если клик правой кнопкой мыши
       */
      return;
    }

    const target = event.target as HTMLElement;
    const isButton = Boolean(target.closest('.v-btn'));
    if (isButton) {
      return;
    }

    document.onmousemove = () => {
      this.isDrag = true;
      this.move(event, id);
    };

    document.onmouseup = () => {
      this.isDrag = false;
      const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`);
      if (!elem) {
        return;
      }
      elem.style.transition = 'all 0.1s';
      elem.style.transform = 'scale(0.95)';
      this.edit(id);
      setTimeout(() => {
        elem.style.transform = 'scale(1)';
        elem.removeAttribute('style');
      }, 100);
    };
  }

  move(event: MouseEvent, id: string): void {
    if (!this.isDrag) {
      return;
    }
    const container: HTMLElement = document.querySelector('.todo_cont');
    const elemsClassName = 'todo_item';
    if (!container || container.childElementCount === 1) {
      return null;
    }
    const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`);

    const startPos = {
      x: event.clientX,
      y: event.clientY,
    };

    let dragItem: HTMLElement = null;
    let avatar: HTMLElement = null;

    const finishDrag = () => {
      if (dragItem) {
        dragItem.classList.remove('dragable');
        dragItem.removeAttribute('style');
        if (avatar) {
          const dropableElems: NodeListOf<HTMLElement> = container.querySelectorAll('.dropable');
          dropableElems.forEach(el => {
            el.classList.remove('dropable');
            el.removeAttribute('style');
          });
          container.classList.remove('todo_cont--drag');
          container.insertBefore(dragItem, avatar);
          container.removeChild(avatar);
        }
      }
      document.onmousemove = null;
      document.onmouseup = null;
      dragItem = null;
      avatar = null;
      this.isDrag = false;
      this.reorder();
    };

    document.onmousemove = (ev: MouseEvent) => {
      if (Math.abs(ev.clientX - startPos.x) > 10 || Math.abs(ev.clientY - startPos.y) > 10) {
        container.classList.add('todo_cont--drag');

        avatar = document.createElement('div');
        avatar.style.display = 'block';
        avatar.style.float = 'left';
        avatar.style.width = elem.offsetWidth + 'px';
        avatar.style.height = elem.offsetHeight + 'px';
        avatar.style.margin = '3px';
        avatar.style.border = '1px dashed #333';
        avatar.style.opacity = '0.6';
        avatar.style.borderRadius = '6px';

        const rectElem: DOMRect = elem.getBoundingClientRect();
        const rectCont: DOMRect = container.getBoundingClientRect();
        const startX = rectElem.left - rectCont.left;
        const startY = rectElem.top - rectCont.top;

        container.insertBefore(avatar, elem);
        elem.style.position = 'absolute';
        elem.style.left = startX + 'px';
        elem.style.top = startY + 'px';
        elem.style.zIndex = '99';
        elem.style.opacity = '0.7';
        elem.style.transform = 'rotate(5deg)';

        const childNodes: NodeListOf<HTMLElement> = container.childNodes as NodeListOf<HTMLElement>;
        childNodes.forEach(el => {
          if (el.classList) {
            const isAvatar = el.classList.contains('dragable-avatar');
            const isSelf = el.classList.contains('dragable');
            if (!isAvatar && !isSelf && el.classList.contains(elemsClassName)) {
              el.classList.add('dropable');
            }
          }
        });

        dragItem = elem;

        document.onmousemove = (e: MouseEvent) => {
          const moveX = startPos.x - e.clientX;
          const moveY = startPos.y - e.clientY;

          dragItem.style.left = startX - moveX + 'px';
          dragItem.style.top = startY - moveY + 'px';

          const { clientX, clientY } = e;
          dragItem.style.display = 'none';
          const el: Element | null = document.elementFromPoint(clientX, clientY);
          dragItem.style.display = 'block';
          if (!el) {
            return;
          }
          const dropItem: HTMLElement | null = el.closest('.dropable');
          if (!dropItem) {
            return;
          }
          const dropRect: DOMRect = dropItem.getBoundingClientRect();
          const dropCoords = {
            x: e.clientX - dropRect.left,
            y: e.clientY - dropRect.top,
          };
          if (dropCoords.x < dropRect.width / 2) {
            const next: Element | null = dropItem.nextElementSibling;
            if (next) {
              container.insertBefore(avatar, next);
            } else {
              container.appendChild(avatar);
            }
          } else if (indexOf(dropItem) === container.childElementCount - 1) {
            container.appendChild(avatar);
          } else {
            container.insertBefore(avatar, dropItem);
          }
        };
      }
    };

    document.onmouseup = () => {
      setTimeout(() => {
        finishDrag();
      }, 100);
    };
  }

  setItems() {
    this.items = Object.keys(this.json)
      .map((key: string): ITodoItem => {
        const o: ITodoItem = {
          id: key,
          date: now(key).date,
          text: this.json[key].text,
          order: this.json[key].order,
        };
        return o;
      })
      .sort(sortByOrder);
  }

  setOrder() {
    this.order = this.items.map(item => item.id);
  }

  reorder() {
    const result: ITodoOrder = {};
    const elems: NodeListOf<HTMLElement> = document.querySelectorAll('[data-id]');
    if (!elems.length) {
      return;
    }
    elems.forEach((el: HTMLElement, index: number) => {
      const id = el.dataset.id;
      if (id) {
        result[id] = index + 1;
        const item = this.items.find((o: ITodoItem) => o.id === id);
        if (item) {
          item.order = index + 1;
        }
      }
    });
    if (
      isEqual(
        this.order,
        Object.entries(result).map(el => el[0])
      )
    ) {
      return;
    }
    this.items = [...this.items.toSorted(sortByOrder)];
    this.setOrder();
    this.$app.$commandBus.do<TodoOrderCommand, void>(new TodoOrderCommand(result));
  }

  async edit(id: string) {
    if (this.isDrag) {
      return;
    }
    document.onmousemove = null;
    document.onmouseup = null;
    const o = this.items.find((item: ITodoItem) => item.id === id);
    const result = await DialogManager.exec<ITodoItem>(
      new CreateEditDialog({
        title: 'Edit todo item',
        component: 'Todo-Modal-edit',
        componentProps: {
          model: cloneDeep(o),
        },
        height: '60%',
        size: 'm',
      })
    );
    if (!result) {
      return;
    }
    this.save(result);
  }

  save(item: ITodoItem) {
    const id = item.id;
    const o: ITodoItem | null = this.items.find((i: ITodoItem) => i.id === id) ?? null;
    if (o) {
      o.text = item.text;
      this.items = [...this.items];
      this.$app.$commandBus.do<UpdateTodoCommand, void>(new UpdateTodoCommand(o));
    }
  }

  async remove(item: ITodoItem) {
    const isConfirm = await DialogManager.exec(
      new ConfirmDialog({
        title: 'Confirmation',
        content: 'Do you really want to delete this item from the todo list?',
      })
    );
    if (!isConfirm) {
      return;
    }
    this.items = this.items.filter((i: ITodoItem) => item.id !== i.id);
    await this.$app.$commandBus.do<DeleteTodoCommand, void>(new DeleteTodoCommand(item.id));
    this.reorder();
  }

  addTodo() {
    const { date, stamp } = now();
    let sstamp = Number(stamp);
    while (this.keys.includes(sstamp.toString())) {
      sstamp += 1;
    }
    const o: ITodoItem = {
      id: sstamp.toString(),
      date,
      text: '',
      order: this.keys.length + 1,
    };
    this.items.push(o);
    this.$app.$commandBus.do<UpdateTodoCommand, void>(new UpdateTodoCommand(o));
  }

  getText(text: string) {
    const split = text.split('\n').map(s => `<p>${s.replace(/\s/g, ' ').trim()}</p>`);
    return split.join('');
  }

  get keys(): Array<string> {
    return this.items.map((item: ITodoItem) => item.id);
  }

  get isEmpty() {
    return !this.loading && !this.items?.length;
  }
}
