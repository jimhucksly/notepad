<template>
  <div class="popup" v-show="aboutPopupShow">
    <div class="popup-about">
      <popup-title>
        <close-btn @click="$popup.close('about')"></close-btn>
      </popup-title>
      <div class="m-b-20">
        <img src="../../static/icon_118x118.svg" alt="">
      </div>
      <div class="m-b-5">
        <p>{{ appName }}</p>
      </div>
      <div class="m-b-5">
        <p><small>v1.0.0</small></p>
      </div>
      <div>
        <p><small>&copy; Jimhucksly-Studio, {{ new Date().getFullYear() }}</small></p>
      </div>
    </div>
  </div>
</template>
<script>

  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  Vue.component('CloseBtn', {
    template: `<div class="popup-close-btn" @click="$emit('click')"></div>`
  })

  Vue.component('PopupTitle', {
    template: '<div class="popup-title-bar"><slot></slot></div>'
  })

  export default {
    name: 'Popup',
    computed: {
      ...mapGetters({
        aboutPopupShow: 'getAboutPopupShow'
      }),
      appName() {
        return this.$electron.remote.getCurrentWindow().getTitle()
      }
    }
  }
</script>