import { Vue, Component, Watch } from 'vue-property-decorator'
import { isEmpty } from 'lodash'
import { checkLinks, now, getFileType, dragAndDropLoader } from '~/helpers'
import ProjectItem from '~/components/projectItem'
import { ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { SetJsonCommand, UploadFileCommand, UpdateJsonCommand, ReadCommand } from '~/domain/commands'
import { IFile, IFilters, IJson } from '~/domain/models'
import { Getter } from 'vuex-class'

@Component({
  name: 'Notepad',
  components: {
    ProjectItem
  }
})
export default class Notepad extends Vue {
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Getter('getJson') json: IJson
  @Getter('getFilter') filter: IFilters
  @Getter('getError') isError: boolean

  message = ''
  newMsgFlag = false
  isRendered = false

  onScrollHandler: () => void = null

  get count(): number {
    return this.json ? Object.keys(this.json).length : 0
  }
  get lastStamp(): string {
    return this.count ? Object.keys(this.json)[this.count - 1] : ''
  }
  get hasFilter(): boolean {
    return !isEmpty(this.filter)
  }

  @Watch('hasFilter')
  onHasFilterChanged(flag: boolean) {
    const notepadCont = this.$refs.notepad_cont as HTMLElement
    if(flag) {
      notepadCont.scrollTo(0, 0)
    } else {
      this.$nextTick(() => {
        notepadCont.scrollTop = notepadCont.scrollHeight
      })
    }
  }

  @Watch('isRendered')
  onIsRenderedChange() {
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement
      notepadCont.scrollTop = notepadCont.scrollHeight
    })
  }

  send() {
    if(!this.message.length) {
      return
    }
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
    this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand({ ...this.json, ...o }))
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement
      notepadCont.scrollTop = notepadCont.scrollHeight
      this.commandBus.do<UpdateJsonCommand, void>(new UpdateJsonCommand(o))
    })
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onFileChange(e: any) {
    const files = e.target.files || e.dataTransfer.files
    if(files.length === 0) {
      return
    }
    const formData = new FormData()
    formData.append('file', files[0])
    formData.set('file', files[0])
    this.upload(formData, getFileType(files[0].name))
  }

  async upload(file: FormData, fileType: string) {
    try {
      const newFile = await this.commandBus.do<UploadFileCommand, IFile>(new UploadFileCommand(file))
      this.addFile(newFile.name, newFile.link, fileType)
    } catch(e) {
      console.error(e)
    }
  }

  addFile(name: string, link: string, type: string) {
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
    this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand({ ...this.json, ...o }))
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement
      notepadCont.scrollTop = notepadCont.scrollHeight
      this.commandBus.do<UpdateJsonCommand, void>(new UpdateJsonCommand(o))
    })
  }

  read() {
    const self = this.$refs.notepad_cont as HTMLElement
    const rect = self.getBoundingClientRect()
    const viewportHeight = rect.top + rect.height
    const unread: NodeListOf<HTMLElement> = self.querySelectorAll('.unread')
    unread.forEach((el: HTMLElement) => {
      const elRect = el.getBoundingClientRect()
      if(elRect.top < viewportHeight) {
        if(!el.classList.contains('.will-be-marked')) {
          setTimeout(() => {
            this.commandBus.do<ReadCommand, void>(new ReadCommand(el.dataset.stamp))
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

  updated() {
    this.read()
  }

  mounted() {
    const notepadCont = this.$refs.notepad_cont as HTMLElement
    this.onScrollHandler = this.read.bind(this)
    notepadCont.addEventListener('scroll', this.onScrollHandler)

    dragAndDropLoader('notepad_cont', 'hightlight', this.onFileChange.bind(this))
    window.ondragstart = () => false
  }

  beforeDestroy() {
    const notepadCont = this.$refs.notepad_cont as HTMLElement
    notepadCont.removeEventListener('scroll', this.onScrollHandler)
  }
}
