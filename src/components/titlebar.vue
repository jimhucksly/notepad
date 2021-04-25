<template>
  <div class="title-bar">
    <div class="menu-button-container">
      <button id="menu-button" class="menu-button" @click="$electron.ipcRenderer.send('menu-popup')">
        <i></i>
        <i></i>
        <i></i>
      </button>
    </div>
    <div class="reload-button-container" v-if="isAuth && !preferencesShow">
      <button id="reload-button" class="reload-button" @click.prevent="reload">
        <span>
          <svg-icon icon="reloadIcon" />
        </span>
      </button>
    </div>
    <div class="app-name-container">
      <span class="titlebar-logo">
        <img src="static/icon.svg" alt="">
      </span>
      <p>{{ title }}</p>
    </div>
    <div class="window-controls-container">
      <button
        id="minimize-button"
        class="minimize-button"
        @click="$electron.ipcRenderer.send('minimize')"
      ></button>
      <button
        id="min-max-button"
        class="min-max-button"
        :class="{
          'is-maximized': isMaximized
        }"
        @click="$electron.ipcRenderer.send('min-max')"
      ></button>
      <button
        id="close-button"
        class="close-button"
        @click="$electron.ipcRenderer.send('hide')"
      ></button>
    </div>
  </div>
</template>
<script src="./titlebar.ts" lang="ts"></script>
