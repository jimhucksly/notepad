<template>
  <div class="title-bar">
    <div class="menu-button-container">
      <button 
        id="menu-button"
        class="menu-button">
        <i></i>
        <i></i>
        <i></i>
        </button>
    </div>
    <div class="app-name-container">
      <span class="titlebar-logo">
        <img src="../../static/icon_1024x1024.svg" alt="">
      </span>
      <p>{{ title }}</p>
    </div>
    <div class="window-controls-container">
      <button 
        id="minimize-button"
        class="minimize-button"></button>
      <button 
        id="min-max-button"
        class="min-max-button"></button>
      <button 
        id="close-button"
        class="close-button"></button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Titlebar',
    computed: {
      title() {
        return this.$electron.remote.getCurrentWindow().getTitle()
      }
    }
  }
</script>