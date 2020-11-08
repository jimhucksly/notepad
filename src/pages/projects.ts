import { Vue, Component, Watch } from 'vue-property-decorator'
import { isEmpty } from 'lodash'
import { checkLinks, now, getFileType, dragAndDropLoader } from '~/helpers'
import NotepadItem from '~/components/notepadItem'
import { ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { SetJsonCommand, UploadFileCommand, UpdateJsonCommand } from '~/domain/commands'
import { IFilters, IJson } from '~/domain/models'

interface IUploadResponse {
  filename: string
  link: string
}

@Component({
  name: 'Notepad',
  components: {
    NotepadItem
  }
})
export default class Notepad extends Vue {
  message = ''
  newMsgFlag = false
  isRendered = false

  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  get json(): IJson {
    return this.$store.getters.getJson
  }
  get count(): number {
    return this.json ? Object.keys(this.json).length : 0
  }
  get lastStamp(): string {
    return this.count ? Object.keys(this.json)[this.count - 1] : ''
  }
  get filter(): IFilters {
    return this.$store.getters.getFilter
  }
  get isError(): boolean {
    return this.$store.getters.getError
  }
  get hasFilter(): boolean {
    return !isEmpty(this.filter)
  }

  @Watch('hasFilter')
  onHasFilterChanged(flag: boolean) {
    if(flag) {
      const notepadCont: any = this.$refs.notepad_cont
      notepadCont.scrollTo(0, 0)
    } else {
      this.$nextTick(() => {
        const notepadCont: any = this.$refs.notepad_cont
        notepadCont.scrollTop = notepadCont.scrollHeight
      })
    }
  }

  @Watch('isRendered')
  onIsRenderedChange(v: boolean) {
    this.$nextTick(() => {
      const notepadCont: any = this.$refs.notepad_cont
      notepadCont.scrollTop = notepadCont.scrollHeight
    })
  }

  protected send(): void | null {
    if(!this.message.length) return null
    this.newMsgFlag = true
    const { date, stamp } = now()
    const o: IJson = {
      [stamp]: {
        key: stamp,
        date,
        name: '',
        lock: false,
        message: checkLinks(this.message)
      }
    }
    this.message = ''
    this.commandBus.do(new SetJsonCommand({ ...this.json, ...o }))
    this.$nextTick(() => {
      const notepadCont: any = this.$refs.notepad_cont
      notepadCont.scrollTop = notepadCont.scrollHeight
      this.commandBus.do(new UpdateJsonCommand(o))
    })
  }

  protected onFileChange(e: any): void | null {
    const files = e.target.files || e.dataTransfer.files
    if(files.length === 0) return null
    const formData = new FormData()
    formData.append('file', files[0])
    formData.set('file', files[0])
    this.upload(formData, getFileType(files[0].name))
  }

  protected async upload(file: FormData, fileType: string) {
    try {
      const resp: IUploadResponse = await this.commandBus.do(new UploadFileCommand(file))
      this.addFile(resp.filename, resp.link, fileType)
    } catch(e) {
      console.error(e)
    }
  }

  protected addFile(name: string, link: string, type: string) {
    this.newMsgFlag = true
    const { date, stamp } = now()
    const o: IJson = {
      [stamp]: {
        key: stamp,
        date,
        name,
        lock: false,
        file: {
          name,
          link,
          type
        }
      }
    }
    this.commandBus.do(new SetJsonCommand({ ...this.json, ...o }))
    this.$nextTick(() => {
      const notepadCont: any = this.$refs.notepad_cont
      notepadCont.scrollTop = notepadCont.scrollHeight
      this.commandBus.do(new UpdateJsonCommand(o))
    })
  }

  protected read() {
    const self: any = this.$refs.notepad_cont
    const rect = self.getBoundingClientRect()
    const viewportHeight = rect.top + rect.height
    const unread = self.querySelectorAll('.unread')
    unread.forEach((el: any, i: number) => {
      const elRect = el.getBoundingClientRect()
      if(elRect.top < viewportHeight) {
        if(!el.classList.contains('.will-be-marked')) {
          setTimeout(() => {
            this.$store.dispatch('read', el.dataset.stamp)
            el.classList.remove('unread')
            el.classList.remove('will-be-marked')
            const hasStyle = el.attributes.getNamedItem('style')
            hasStyle && el.attributes.removeNamedItem('style')
          }, 2000)
        }
        el.classList.add('will-be-marked')
        el.style.transition = 'all 0.5s'
      }
    })
  }

  protected updated() {
    this.read()
  }

  mounted() {
    const notepadCont: any = this.$refs.notepad_cont
    dragAndDropLoader('notepad_cont', 'hightlight', this.onFileChange.bind(this))

    window.ondragstart = () => false

    notepadCont.addEventListener('scroll', (_: any) => {
      this.read()
    })
  }
}
