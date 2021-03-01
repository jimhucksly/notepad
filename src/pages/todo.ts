import { Vue, Component, Watch } from 'vue-property-decorator'
import { now, indexOf } from '~/helpers'
import { cloneDeep } from 'lodash'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { ITodo, ITodoOrder } from '~/domain/models'
import { TodoQuery } from '~/domain/queries'
import { TodoOrderCommand, UpdateTodoCommand, DeleteTodoCommand } from '~/domain/commands'

const sortByOrder = (a: ITodo, b: ITodo) => {
  return a.order < b.order ? -1 : 1
}

@Component({
  name: 'Todo'
})
export default class Todo extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  items: ITodo[] = []
  isPopupShow = false
  itemSelected: ITodo | null = null
  clickTimer: NodeJS.Timeout | null = null

  get json() {
    return this.$store.getters.getTodo
  }

  get keys() {
    return this.items.map((item: ITodo) => item.id)
  }

  @Watch('json')
  onJsonChanged() {
    this.setItems()
  }

  onMouseDown(event: MouseEvent, id: string) {
    if(event.button > 0) {
      /**
       * если клик правой кнопкой мыши
       */
      return
    }

    this.clickTimer = setTimeout(() => {
      this.move(event, id)
      document.onmouseup = null
      document.onmousemove = null
      clearTimeout(this.clickTimer)
    }, 600)

    document.onmouseup = () => {
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
      clearTimeout(this.clickTimer)
    }

    document.onmousemove = () => {
      this.move(event, id)
      document.onmouseup = null
      clearTimeout(this.clickTimer)
    }
  }

  move(event: MouseEvent, id: string): void {
    const container: HTMLElement | null = document.querySelector('.todo_cont')
    const elemsClassName = 'todo_item'
    if(!container || container.childElementCount === 1) return null
    const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`)

    const startPos = {
      x: event.clientX,
      y: event.clientY
    }

    document.onmousemove = (ev: MouseEvent) => {
      if(Math.abs(ev.clientX - startPos.x) > 10 || Math.abs(ev.clientY - startPos.y) > 10) {
        container.classList.add('todo_cont--drag')

        const avatar: HTMLElement = document.createElement('div')
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

        const dragItem = elem

        const finishDrag = () => {
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
          this.setOrder()
        }

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

        document.onmouseup = () => {
          finishDrag()
        }
      }
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
        const item = this.items.find((o: ITodo) => o.id === id)
        item && (item.order = index + 1)
      }
    })
    this.items = [...this.items]
    this.commandBus.do<TodoOrderCommand, void>(new TodoOrderCommand(result))
  }

  edit(id: string) {
    document.onmousemove = null
    document.onmouseup = null
    const o = this.items.find((item: ITodo) => item.id === id)
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
      const o: ITodo | null = this.items.find((item: ITodo) => item.id === id) ?? null
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
      this.items = this.items.filter((item: ITodo) => item.id !== id)
      this.cancel()
      await this.commandBus.do<DeleteTodoCommand, void>(new DeleteTodoCommand(id))
      this.setOrder()
    }
  }

  setItems() {
    this.items = Object.keys(this.json).map((key: string): ITodo => {
      const o: ITodo = {
        id: key,
        date: now(key).date,
        text: this.json[key].text,
        order: this.json[key].order
      }
      return o
    }).sort(sortByOrder)
  }

  async mounted() {
    await this.queryBus.exec<TodoQuery, Array<ITodo>>(new TodoQuery())

    this.$electron.ipcRenderer.on('todo-add', () => {
      const { date, stamp } = now()
      let sstamp: number = +stamp
      while(this.keys.includes(sstamp.toString())) {
        sstamp += 1
      }
      const o: ITodo = {
        id: sstamp.toString(),
        date,
        text: '',
        order: this.items.length + 1
      }
      this.items.push(o)
      this.commandBus.do<UpdateTodoCommand, void>(new UpdateTodoCommand(o))
    })
  }
}
