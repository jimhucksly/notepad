<template>
  <div id="notepad_cont" :class="{ 'is-error' : error }">
    <div class="notepad_cont" ref="notepad_cont">
      <div class="notepad_item"
        v-if="!hasFilter || `${item.key}` in filter"
        v-for="(item, index) in json" 
        :data-stamp="item.key" 
        :key="item.key"
        ref="notepad_item"
        :class="{ unread: item.unread }">
        <div>
          <div class="notepad_item_date">{{ item.date }}</div>
        </div>
        <div class="notepad_item_content">
          <file 
            v-if="item.file !== undefined"
            :item-key="item.key" 
            :item-file="item.file">
          </file>
          <p v-html="item.message" v-else></p>
        </div>
        <controls 
          @post="post" 
          :item-key="item.key" 
          :collection="item.file ? ['remove'] : ['save', 'edit', 'remove']">
        </controls>
      </div>
    </div>
    <div class="notepad_textarea">
      <textarea placeholder="Сообщение" v-model="message" v-on:keydown.enter.ctrl="send"></textarea>
      <button @click.prevent="send"></button>
      <label class="notepad_attachments">
        <input type="file" @change="onFileChange">
      </label>
    </div>
  </div>
</template>
<script>

  import $ from 'jquery'
  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash'
  import { checkLinks, now, getFileType, dragAndDropLoader, downloadFile } from '@/helpers'
  import Controls from './controls'
  import File from './file'

  export default {
    name: 'Notepad',
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
        const formData = new FormData()
        formData.append('file', files[0])
        formData.set('file', files[0])
        this.upload(formData, getFileType(files[0].name))
      },
      addFile(name, link, type) {
        this.new_message_flag = true
        const {date, stamp} = now()
        this.$store.dispatch('json', Object.assign({}, this.json, {
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
        }))
        this.$nextTick(() => {
          this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
          this.post()
        })
      },
      post() {
        this.$store.dispatch('action', {
          type: 'SEND'
        })
          .then(() => {
          })
          .catch(err => {
            console.error(err)
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
        const $unread = $('.unread', self)
        $unread.each((i, el) => {
          if($(el).offset().top < viewportHeight) {
            if(!$(el).is('.will-be-marked')) {
              setTimeout(() => {
                this.$store.dispatch('read', el.dataset.stamp)
                $(el).removeClass('unread will-be-marked').removeAttr('style')
              }, 2000)
            }
            $(el).addClass('will-be-marked')
            $(el).css({transition: 'all 0.5s'})
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

      $(this.$refs.notepad_cont).on('click', 'a[href]', (e) => {
        e.preventDefault()
        if(e.target.download) {
          const href = e.target.href
          const stamp = e.target.dataset.stamp
          const item = this.$refs.notepad_item.find(item => item.dataset.stamp === stamp)
          if(item) {
            const loader = item.querySelector('.file_loader')
            const fileName = e.target.dataset.filename
            const finalPath = this.$store.getters['getDownloadsTargetPath'] + '\\' + fileName
            downloadFile(href, finalPath, loader)
          }
        } else {
          this.$electron.shell.openExternal(e.target.href)
        }
      })

      $(this.$refs.notepad_cont).on('scroll', (e) => this.read())
    }
  }

</script>

