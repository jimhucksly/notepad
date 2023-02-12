import { Watch } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import { cloneDeep, isEmpty, unset } from 'lodash'
import { checkLinks, now, getFileType, dragAndDropLoader } from '~/helpers'
import ProjectItem from '~/components/projectItem'
import { ReadCommand, UploadFileCommand, CreateProjectCommand, DeleteProjectCommand } from '~/domain/commands'
import { IFile, IFilters, IProjects } from '~/domain/models'
import { Getter, Mutation } from 'vuex-class'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import FsmStates from '~/application/fsm.states'

@Options({
  components: {
    ProjectItem
  },
  beforeUnmount() {
    const notepadCont = this.$refs.notepad_cont as HTMLElement
    notepadCont.removeEventListener('scroll', this.onScrollHandler)
  }
})
export default class Projects extends Vue {
  @Mutation('projects/setJson') setJson: (value: IProjects) => void
  @Mutation('projects/setFilter') setFilter: (value: IFilters) => void

  @Getter('projects/getJson') json: IProjects
  @Getter('projects/getFilter') filter: IFilters

  message = ''
  newMsgFlag = false
  isRendered = false
  removeStack: Array<string> = []

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

  @Watch('hasFilter') onHasFilterChanged(flag: boolean) {
    const notepadCont = this.$refs.notepad_cont as HTMLElement
    if (flag) {
      notepadCont.scrollTo(0, 0)
    } else {
      this.$nextTick(() => {
        notepadCont.scrollTop = notepadCont.scrollHeight
      })
    }
  }

  @Watch('isRendered') onIsRenderedChange() {
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement
      notepadCont.scrollTop = notepadCont.scrollHeight
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

  send() {
    if (!this.message.length) {
      return
    }
    this.newMsgFlag = true
    const { date, stamp } = now()
    const o: IProjects = {
      [stamp]: {
        key: stamp,
        date,
        name: '',
        lock: false,
        message: checkLinks(this.message)
      }
    }
    this.message = ''
    this.setJson({ ...this.json, ...o })
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement
      notepadCont.scrollTop = notepadCont.scrollHeight
      this.$app.$commandBus.do<CreateProjectCommand, boolean>(new CreateProjectCommand(o))
    })
  }

  onFileChange(e: InputEvent | DragEvent) {
    const target = e.target as HTMLInputElement
    let files = target.files
    if (!files?.length) {
      files = (e as DragEvent).dataTransfer.files
    }
    if (files?.length === 0) {
      return
    }
    const formData = new FormData()
    formData.append('file', files[0])
    formData.set('file', files[0])
    this.upload(formData, getFileType(files[0].name))
  }

  async upload(file: FormData, fileType: string) {
    try {
      const command = new CreateEditCommand({
        component: 'uploading-popup',
        componentProps: {},
        modal: {
          title: 'Uploading'
        },
        fsmState: FsmStates.Uploading
      })
      this.$app.$commandBus.do<CreateEditCommand<void>, void>(command)
      const newFile = await this.$app.$commandBus.do<UploadFileCommand, IFile>(new UploadFileCommand(file))
      this.$app.goBack()
      this.addFile(newFile.name, fileType)
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  addFile(name: string, type: string) {
    this.newMsgFlag = true
    const { date, stamp } = now()
    const o: IProjects = {
      [stamp]: {
        key: stamp,
        date,
        name,
        lock: false,
        file: {
          name,
          type
        }
      }
    }
    this.setJson({ ...this.json, ...o })
    this.$nextTick(() => {
      const notepadCont = this.$refs.notepad_cont as HTMLElement
      notepadCont.scrollTop = notepadCont.scrollHeight
      this.$app.$commandBus.do<CreateProjectCommand, boolean>(new CreateProjectCommand(o))
    })
  }

  read() {
    const self = this.$refs.notepad_cont as HTMLElement
    const rect = self.getBoundingClientRect()
    const viewportHeight = rect.top + rect.height
    const unread: NodeListOf<HTMLElement> = self.querySelectorAll('.unread')
    unread.forEach((el: HTMLElement) => {
      const elRect = el.getBoundingClientRect()
      if (elRect.top < viewportHeight) {
        if (!el.classList.contains('.will-be-marked')) {
          setTimeout(() => {
            this.$app.$commandBus.do<ReadCommand, void>(new ReadCommand(el.dataset.stamp))
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

  async onDelete(stamp: string) {
    const buffJson = cloneDeep(this.json)
    const buffFilter = cloneDeep(this.filter)
    unset(buffJson, stamp)
    unset(buffFilter, stamp)
    this.setFilter(buffFilter)
    this.setJson(buffJson)
    this.removeStack.push(stamp)
    if (this.removeStack[0] === stamp) {
      await this.$app.$commandBus.do<DeleteProjectCommand, void>(new DeleteProjectCommand(stamp))
      this.removeStack = this.removeStack.filter(el => el !== stamp)
      if (this.removeStack.length) {
        this.onDelete(this.removeStack[0])
      }
    }
  }
}
