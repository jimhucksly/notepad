<template>
  <div class="popup popup-about" ref="about" v-show="aboutPopupShow">
    <img src="../../static/icon_118x118.svg" alt="">
    <p>{{ appName }}</p>
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'

  export default {
    name: 'Popup',
    computed: {
      ...mapGetters({
        aboutPopupShow: 'getAboutPopupShow'
      }),
      appName() {
        return this.$electron.remote.app.getName()
      }
    }
  }
</script>