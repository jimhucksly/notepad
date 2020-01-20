import { Vue, Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
import { checkLinks, now, getFileType, dragAndDropLoader, downloadFile } from '~/helpers'
import Controls from '~/components/controls'
import File from '~/components/file'

@Component({
  name: 'Notepad'
})
export default class Notepad extends Vue {

  data() {
    return {
      message: '',
      new_message_flag: false
    }
  },
  components: {
    Controls,
    File
  },
  computed: {
    ...mapGetters({
      json: 'getJson',
      filter: 'getFilter',
      error: 'getError'
    }),
    hasFilter() {
      return !isEmpty(this.filter)
    }
  },
  watch: {
    hasFilter(flag) {
      if(flag) {
        this.$refs.notepad_cont.scrollTo(0, 0)
      } else {
        this.$nextTick(() => {
          this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
        })
      }
    }
  },
  methods: {
    send() {
      if(!this.message.length) return null
      this.new_message_flag = true
      const {date, stamp} = now()
      const o = {
        [stamp]: {
          key: stamp,
          date: date,
          name: '',
          lock: false,
          message: checkLinks(this.message)
        }
      }
      this.message = ''
      this.$store.dispatch('json', Object.assign({}, this.json, o))
      this.$nextTick(() => {
        this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
        this.$store.dispatch('action', {
          type: 'CREATE',
          data: o
        })
      })
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if(files.length === 0) return null
      const formData = new FormData()
      formData.append('file', files[0])
      formData.set('file', files[0])
      this.upload(formData, getFileType(files[0].name))
    },
    addFile(name, link, type) {
      this.new_message_flag = true
      const {date, stamp} = now()
      const o = {
        [stamp]: {
          key: stamp,
          date: date,
          name: name,
          lock: false,
          file: {
            name: name,
            link: link,
            type: type
          }
        }
      }
      this.$store.dispatch('json', Object.assign({}, this.json, o))
      this.$nextTick(() => {
        this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
        this.$store.dispatch('action', {
          type: 'CREATE',
          data: o
        })
      })
    },
    upload(file, fileType) {
      this.$store.dispatch('action', {
        type: 'FILE',
        data: {
          file: file
        }
      })
        .then(resp => {
          this.addFile(resp.filename, resp.link, fileType)
        })
        .catch(err => {
          console.error(err)
        })
    },
    read() {
      const self = this.$refs.notepad_cont
      const rect = self.getBoundingClientRect()
      const viewportHeight = rect.top + rect.height
      const unread = self.querySelectorAll('.unread')
      unread.forEach((el, i) => {
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
  },
  updated() {
    this.read()
  },
  mounted() {
    this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
    dragAndDropLoader('notepad_cont', 'hightlight', this.onFileChange)

    this.$refs.notepad_cont.addEventListener('click', (e) => {
      const isLink = e.target.tagName === 'A'
      const hasHref = e.target.href && e.target.href.length
      if(isLink && hasHref) {
        e.preventDefault()
        const href = e.target.href
        const stamp = e.target.dataset.stamp
        const item = this.$refs.notepad_item.find(item => item.dataset.stamp === stamp)
        if(item) {
          const loader = item.querySelector('.file_loader')
          const fileName = e.target.dataset.filename
          const finalPath = this.$store.getters['getDownloadsTargetPath'] + '\\' + fileName
          downloadFile(href, finalPath, loader)
        } else {
          this.$electron.shell.openExternal(e.target.href)
        }
      }
    })

    this.$refs.notepad_cont.addEventListener('scroll', (e) => {
      this.read()
    })
  }
}
