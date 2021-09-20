<template>
  <div class="title-bar">
    <div class="menu-button-container" v-if="isAuth">
      <button @click="toPreferences">Preferences</button>
    </div>
    <div class="menu-button-container button--reload" v-if="isAuth">
      <button @click="reload">Reload</button>
    </div>
    <div class="menu-button-container button--about" v-if="isAuth">
      <button @click="toAbout">About</button>
    </div>
    <div class="app-name-container">
      <span class="titlebar-logo">
        <img src="static/icon.svg" alt="">
      </span>
      <p>{{ title }}</p>
    </div>
    <div class="menu-button-container process" v-if="process">
      <loader small :full="false" /> <span class="p-l-5 ">{{ process.name }}</span>
    </div>
    <div class="menu-button-container button--logout" v-if="isAuth">
      <button @click="logout">Log Out</button>
    </div>
    <div class="window-controls-container">
      <button class="minimize-button" @click="$electron.ipcRenderer.send('minimize')"></button>
      <button
        class="min-max-button"
        :class="{
          'is-maximized': isMaximized
        }"
        @click="$electron.ipcRenderer.send('min-max')"
      ></button>
      <button class="close-button" @click="$electron.ipcRenderer.send('hide')"></button>
    </div>
  </div>
</template>
<script src="./titlebar.ts" lang="ts"></script>
