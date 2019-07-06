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

  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash'
  import { checkLinks, now, getFileType, dragAndDropLoader } from '@/helpers'
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
      this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
      dragAndDropLoader('notepad_cont', 'hightlight', this.onFileChange)
    }
  }

</script>

