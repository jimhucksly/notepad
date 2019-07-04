<template>
  <div id="notepad_cont">
    <div class="notepad_cont" ref="notepad_cont">
      <div class="notepad_item" v-for="(item, index) in json" :data-stamp="item.key" :key="item.key" ref="notepad_item">
        <div>
          <div class="notepad_item_date">{{ item.date }}</div>
        </div>
        <div class="notepad_item_content">
          <p v-html="item.message"></p>
        </div>
        <controls @post="post" :item-key="item.key"></controls>
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
  import { checkLinks, now } from '@/helpers'
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
        json: 'getJson'
      })
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
        // const files = e.target.files || e.dataTransfer.files
        // const formData = new FormData()
        // formData.append("file", files[0])
        // formData.set("file", files[0]);
        // this.$api.upload(formData)
        // .then(response => {
        //   this.addFile(response.filename, response.link, getFileType(files[0].name))
        // })
      },
      post() {
        console.log('post')
        this.$store.dispatch('action', {
          type: 'MESSAGE'
        })
          .then(() => {
            this.$refs.notepad_item[this.$refs.notepad_item.length - 1].classList.remove('is-pending')
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    mounted() {
      $(this.$refs.notepad_cont).on('click', 'a[href]', (e) => {
        e.preventDefault()
        this.$electron.shell.openExternal(e.target.href)
      })
      this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
    }
  }

</script>

