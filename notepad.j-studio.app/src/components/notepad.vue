<template>
  <div id="notepad_cont">
    <div class="notepad_cont">
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
    </div>
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'

  export default {
    name: 'Notepad',
    data() {
      return {
        message: ''
      }
    },
    computed: {
      ...mapGetters({
        json: 'getJson'
      })
    },
    methods: {
      send() {

      }
    }
  }

</script>

