<template>
  <div id="titlebar" class="title-bar">
    <template v-if="isAuth && yandexDiskAccessToken">
      <div class="menu-button-container">
        <button @click="toPreferences">Preferences</button>
      </div>
      <div v-if="isAuth" class="menu-button-container button--reload">
        <button @click="reload">Reload</button>
      </div>
      <div v-if="isAuth" class="menu-button-container button--about">
        <button @click="toAbout">About</button>
      </div>
    </template>
    <div class="app-name-container">
      <span class="titlebar-logo">
        <img src="assets/images/icons/24x24.png" alt="" />
      </span>
      <p>{{ title }}</p>
    </div>
    <div v-if="process" class="menu-button-container process">
      <loader small :full="false" /> <span class="p-l-5">{{ process.name }}</span>
    </div>
    <div v-if="isAuth && yandexDiskAccessToken" class="menu-button-container button--logout" @click="toAccount">
      <svg-icon icon="user" width="29" height="29" />
    </div>
    <div class="window-controls-container">
      <button class="minimize-button" @click="$electron.ipcRenderer.send('minimize')"></button>
      <button
        class="min-max-button"
        :class="{
          'is-maximized': isMaximized,
        }"
        @click="$electron.ipcRenderer.send('min-max')"
      ></button>
      <button class="close-button" @click="$electron.ipcRenderer.send('hide')"></button>
    </div>
  </div>
</template>
<script src="./titlebar.ts" lang="ts"></script>
