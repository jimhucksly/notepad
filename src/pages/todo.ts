import { cloneDeep } from 'lodash'
import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { DeleteTodoCommand, TodoOrderCommand, UpdateTodoCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { ITodo, ITodoItem, ITodoOrder } from '~/domain/models'
import { TodoQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import { indexOf, now } from '~/helpers'
import { Hub } from '~/plugins/hub'

const sortByOrder = (a: ITodoItem, b: ITodoItem) => {
  return a.order < b.order ? -1 : 1
}

@Options({
  beforeUnmount() {
    Hub.$off('todo-add', this.addTodoHandler)
  }
})
export default class Todo extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Getter('todo/getTodo') json: ITodo

  items: Array<ITodoItem> = []
  isPopupShow = false
  itemSelected: ITodoItem | null = null
  isDrag = false
  loading = false

  addTodoHandler: () => void

  get keys(): Array<string> {
    return this.items.map((item: ITodoItem) => item.id)
  }

  @Watch('json') onJsonChanged() {
    this.setItems()
  }

  onMouseDown(event: MouseEvent, id: string) {
    if(event.button > 0) {
      /**
       * если клик правой кнопкой мыши
       */
      return
    }

    document.onmouseup = () => {
      this.isDrag = false
      const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`)
      if(!elem) {
        return
      }
      elem.style.transition = 'all 0.1s'
      elem.style.transform = 'scale(0.95)'
      this.edit(id)
      setTimeout(() => {
        elem.style.transform = 'scale(1)'
        elem.removeAttribute('style')
      }, 100)
    }

    document.onmousemove = () => {
      this.isDrag = true
      this.move(event, id)
    }
  }

  move(event: MouseEvent, id: string): void {
    if(!this.isDrag) {
      return
    }
    const container: HTMLElement = document.querySelector('.todo_cont')
    const elemsClassName = 'todo_item'
    if(!container || container.childElementCount === 1) {
      return null
    }
    const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`)

    const startPos = {
      x: event.clientX,
      y: event.clientY
    }

    let dragItem: HTMLElement = null
    let avatar: HTMLElement = null

    const finishDrag = () => {
      if(!dragItem || !avatar) {
        return
      }
      dragItem.classList.remove('dragable')
      dragItem.removeAttribute('style')
      const dropableElems: NodeListOf<HTMLElement> = container.querySelectorAll('.dropable')
      dropableElems.forEach(el => {
        el.classList.remove('dropable')
        el.removeAttribute('style')
      })
      container.classList.remove('todo_cont--drag')
      container.insertBefore(dragItem, avatar)
      container.removeChild(avatar)
      document.onmousemove = null
      document.onmouseup = null
      dragItem = null
      avatar = null
      this.isDrag = false
      this.setOrder()
    }

    document.onmousemove = (ev: MouseEvent) => {
      if(Math.abs(ev.clientX - startPos.x) > 10 || Math.abs(ev.clientY - startPos.y) > 10) {
        container.classList.add('todo_cont--drag')

        avatar = document.createElement('div')
        avatar.style.display = 'block'
        avatar.style.float = 'left'
        avatar.style.width = elem.offsetWidth + 'px'
        avatar.style.height = elem.offsetHeight + 'px'
        avatar.style.margin = '3px'
        avatar.style.border = '1px dashed #333'
        avatar.style.opacity = '0.6'
        avatar.style.borderRadius = '6px'

        const rectElem: DOMRect = elem.getBoundingClientRect()
        const rectCont: DOMRect = container.getBoundingClientRect()
        const startX = rectElem.left - rectCont.left
        const startY = rectElem.top - rectCont.top

        container.insertBefore(avatar, elem)
        elem.style.position = 'absolute'
        elem.style.left = startX + 'px'
        elem.style.top = startY + 'px'
        elem.style.zIndex = '99'
        elem.style.opacity = '0.7'
        elem.style.transform = 'rotate(7deg)'

        const childNodes: NodeListOf<HTMLElement> = container.childNodes as NodeListOf<HTMLElement>
        childNodes.forEach(el => {
          if(el.classList) {
            const isAvatar = el.classList.contains('dragable-avatar')
            const isSelf = el.classList.contains('dragable')
            if(!isAvatar && !isSelf && el.classList.contains(elemsClassName)) el.classList.add('dropable')
          }
        })

        dragItem = elem

        document.onmousemove = (e: MouseEvent) => {
          const moveX = startPos.x - e.clientX
          const moveY = startPos.y - e.clientY

          dragItem.style.left = startX - moveX + 'px'
          dragItem.style.top = startY - moveY + 'px'

          const { clientX, clientY } = e
          dragItem.style.display = 'none'
          const el: Element | null = document.elementFromPoint(clientX, clientY)
          dragItem.style.display = 'block'
          if(!el) {
            return
          }
          const dropItem: HTMLElement | null = el.closest('.dropable')
          if(!dropItem) {
            return
          }
          const dropRect: DOMRect = dropItem.getBoundingClientRect()
          const dropCoords = {
            x: e.clientX - dropRect.left,
            y: e.clientY - dropRect.top
          }
          if(dropCoords.x < dropRect.width / 2) {
            const next: Element | null = dropItem.nextElementSibling
            if(next) {
              container.insertBefore(avatar, next)
            } else {
              container.appendChild(avatar)
            }
          } else {
            if(indexOf(dropItem) === container.childElementCount - 1) {
              container.appendChild(avatar)
            } else {
              container.insertBefore(avatar, dropItem)
            }
          }
        }
      }
    }

    document.onmouseup = () => {
      setTimeout(() => {
        finishDrag()
      }, 100)
    }
  }

  setOrder() {
    const result: ITodoOrder = {}
    const elems: NodeListOf<HTMLElement> = document.querySelectorAll('[data-id]')
    if(!elems.length) {
      return
    }
    elems.forEach((el: HTMLElement, index: number) => {
      const id = el.dataset.id
      if(id) {
        result[id] = index + 1
        const item = this.items.find((o: ITodoItem) => o.id === id)
        item && (item.order = index + 1)
      }
    })
    this.items = [...this.items]
    this.commandBus.do<TodoOrderCommand, void>(new TodoOrderCommand(result))
  }

  edit(id: string) {
    if(this.isDrag) {
      return
    }
    document.onmousemove = null
    document.onmouseup = null
    const o = this.items.find((item: ITodoItem) => item.id === id)
    this.itemSelected = o ? cloneDeep(o) : null
    if(this.itemSelected) {
      this.isPopupShow = true
      this.$nextTick(() => {
        const textarea = this.$refs.textarea as HTMLElement
        textarea.focus()
        textarea.addEventListener('keydown', (e: KeyboardEvent) => {
          if((e.code === 'KeyS' || e.key === 's' || e.key === 'ы') && e.ctrlKey) {
            e.preventDefault()
            this.save()
          }
        })
      })
    }
  }

  save() {
    if(this.itemSelected) {
      const id = this.itemSelected.id
      const o: ITodoItem | null = this.items.find((item: ITodoItem) => item.id === id) ?? null
      if(o) {
        o.text = this.itemSelected.text
        this.items = [...this.items]
        this.cancel()
        this.commandBus.do<UpdateTodoCommand, void>(new UpdateTodoCommand(o))
      }
    }
  }

  cancel() {
    this.isPopupShow = false
    this.itemSelected = null
  }

  async remove() {
    if(this.itemSelected) {
      const id = this.itemSelected.id
      this.items = this.items.filter((item: ITodoItem) => item.id !== id)
      this.cancel()
      await this.commandBus.do<DeleteTodoCommand, void>(new DeleteTodoCommand(id))
      this.setOrder()
    }
  }

  setItems() {
    this.items = Object.keys(this.json).map((key: string): ITodoItem => {
      const o: ITodoItem = {
        id: key,
        date: now(key).date,
        text: this.json[key].text,
        order: this.json[key].order
      }
      return o
    }).sort(sortByOrder)
  }

  addTodo() {
    const { date, stamp } = now()
    let sstamp: number = +stamp
    while(this.keys.includes(sstamp.toString())) {
      sstamp += 1
    }
    const o: ITodoItem = {
      id: sstamp.toString(),
      date,
      text: '',
      order: this.keys.length + 1
    }
    this.items.push(o)
    this.commandBus.do<UpdateTodoCommand, void>(new UpdateTodoCommand(o))
  }

  getText(text: string) {
    const split = text.split('\n').map(s => `<p>${s.replace(/[  ]+/g, ' ').trim()}</p>`)
    return split.join('')
  }

  get isEmpty() {
    return !this.loading && !this.items?.length
  }

  async mounted() {
    try {
      this.loading = true
      await this.queryBus.exec<TodoQuery, Array<ITodo>>(new TodoQuery())
      this.loading = false
      this.addTodoHandler = this.addTodo.bind(this)
      Hub.$on('todo-add', this.addTodoHandler)
    } catch(e) {
      /* eslint-disable no-console */
      console.log(e)
    }
  }
}
