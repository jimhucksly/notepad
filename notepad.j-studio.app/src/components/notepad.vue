<template>
  <div id="notepad_cont">
    <div class="notepad_cont" ref="notepad_cont">
      <div class="notepad_item" v-for="(item, index) in json" :data-stamp="item.key" :key="item.key">
        <div>
          <div class="notepad_item_date">{{ item.date }}</div>
        </div>
        <div>
          <p v-html="item.message"></p>
        </div>
      </div>
    </div>
    <div class="notepad_textarea">
      <textarea placeholder="Сообщение" v-model="message" v-on:keydown.enter.ctrl="send"></textarea>
      <button @click.prevent="send"></button>
    </div>
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'
  import $ from 'jquery'
  import { checkLinks, now } from '@/helpers'

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
    mounted() {
      $(this.$refs.notepad_cont).on('click', 'a[href]', (e) => {
        e.preventDefault()
        this.$electron.shell.openExternal(e.target.href)
      })
    },
    methods: {
      send() {
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
        // this.post()
      }
    }
  }

</script>

