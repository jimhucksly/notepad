<template>
  <div class="popup popup-about" ref="about" v-show="aboutPopupShow">
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
      <p><small>&copy; Jimhucksly-Studio, 2019</small></p>
    </div>
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
        return this.$electron.remote.getCurrentWindow().getTitle()
      }
    }
  }
</script>