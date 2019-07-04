<template>
  <div id="notepad_cont">
    <div class="notepad_cont" ref="notepad_cont">
      <div class="notepad_item" v-for="(item, index) in json" :data-stamp="item.key" :key="item.key" ref="notepad_item">
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
                  <a :href="item.file.link" :data-filename="item.file.name" download>Скачать</a></div>
              </div>
            </div>
          </template>
          <template v-else>
            <p v-html="item.message"></p>
          </template>
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
  import request from 'request'
  import fs from 'fs'
  import path from 'path'
  import { checkLinks, now, getFileType } from '@/helpers'
  import Controls from './controls'

  const downloadFile = (fileUrl, targetPath) => {
    let receivedBytes = 0
    let totalBytes = 0

    const req = request({
      method: 'GET',
      uri: fileUrl
    })

    const baseFileName = path.parse(targetPath).base
    const baseFileDir = path.parse(targetPath).dir

    const canSave = (targetPath) => {
      return new Promise((resolve, reject) => {
        fs.access(targetPath, (err) => {
          if(err) {
            console.log('can save')
            return resolve()
          } else {
            console.log('file exists')
            return reject(new Error('file exists'))
          }
        })
      })
    }

    const checkTargetPath = (target) => {
      canSave(target)
        .then(() => {
          let out = fs.createWriteStream(target)
          req.pipe(out)
          req.on('response', (data) => {
            totalBytes = parseInt(data.headers['content-length'])
          })
          req.on('data', (chunk) => {
            receivedBytes += chunk.length
            showProgress(receivedBytes, totalBytes)
          })
          // req.on('end', () => {
          //     alert("File succesfully downloaded")
          // })
        })
        .catch(() => {
          const filename = baseFileName.replace(/\./g, `(${++index}).`)
          const final = path.resolve(baseFileDir, filename)
          checkTargetPath(final)
        })
    }

    let index = 0

    checkTargetPath(targetPath)
  }

  const showProgress = (received, total) => {
    let percentage = (received * 100) / total
    console.log(`${percentage}% | ${received} bytes out of ${total} bytes.`)
  }

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
          const fileName = e.target.dataset.filename
          const finalPath = 'C:\\Users\\Jimhucksly\\Desktop\\' + fileName
          downloadFile(fileURL, finalPath)
        } else {
          this.$electron.shell.openExternal(e.target.href)
        }
      })
      this.$refs.notepad_cont.scrollTop = this.$refs.notepad_cont.scrollHeight
    }
  }

</script>

