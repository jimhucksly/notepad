<template>
  <div id="notepad_cont">
    <div class="notepad_cont" ref="notepad_cont">
      <div class="notepad_item"
        v-if="!hasFilter || `${item.key}` in filter"
        v-for="(item, index) in json" 
        :data-stamp="item.key" 
        :key="item.key"
        ref="notepad_item">
        <div>
          <div class="notepad_item_date">{{ item.date }}</div>
        </div>
        <div class="notepad_item_content">
          <template v-if="item.file !== undefined">
            <div class="notepad_item_file">
              <div class="file_icon">
                <i class="icon">
                  <img :src="`../../static/file_types_icons/${item.file.type}.svg`">
                </i>
              </div>
              <div class="file_link">
                <div>{{ item.file.name }}</div>
                <div>
                  <a :href="item.file.link" target="_blank">Открыть</a>
                  <a :href="item.file.link" :data-filename="item.file.name" :data-stamp="item.key" download>Скачать</a>
                </div>                
              </div>
              <div>
                <div class="file_loader">
                  <span>56%</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <p v-html="item.message"></p>
          </template>
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

  export default {
    name: 'Notepad',
    data() {
      return {
        message: '',
        new_message_flag: false
      }
    },
    computed: {
      ...mapGetters({
        json: 'getJson',
        filter: 'getFilter'
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
    components: {
      Controls
    },
    methods: {
      send() {
        if(!this.message.length) return null
        this.new_message_flag = true
        const {date, stamp} = now()
        const o = Object.assign({}, this.json, {
          [stamp]: {
            key: stamp,
            date: date,
            message: checkLinks(this.message)
          }
        })
        this.message = ''
        this.$store.dispatch('json', o)
        this.$nextTick(() => {
          this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
          this.$refs.notepad_item[this.$refs.notepad_item.length - 1].classList.add('is-pending')
          this.post()
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
            file: {
              name: name,
              link: link,
              type: type
            }
          }
        }))
        this.$nextTick(() => {
          this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
          this.$refs.notepad_item[this.$refs.notepad_item.length - 1].classList.add('is-pending')
          this.post()
        })
      },
      post() {
        this.$store.dispatch('action', {
          type: 'SEND'
        })
          .then(() => {
            this.$refs.notepad_item[this.$refs.notepad_item.length - 1].classList.remove('is-pending')
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
      }
    },
    mounted() {
      $(this.$refs.notepad_cont).on('click', 'a[href]', (e) => {
        e.preventDefault()
        if($(e.target).is('[download]')) {
          const fileURL = e.target.href
          const stamp = e.target.dataset.stamp
          const item = this.$refs.notepad_item.find(item => item.dataset.stamp === stamp)
          const loader = item.querySelector('.file_loader')
          const fileName = e.target.dataset.filename
          const finalPath = this.$store.getters['getUserDataPath'] + '\\' + fileName
          downloadFile(fileURL, finalPath, loader)
        } else {
          this.$electron.shell.openExternal(e.target.href)
        }
      })
      this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
      dragAndDropLoader('notepad_cont', 'hightlight', this.onFileChange)
    }
  }

</script>

