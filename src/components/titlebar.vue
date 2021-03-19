<template>
  <div class="title-bar">
    <div class="menu-button-container">
      <button id="menu-button" class="menu-button">
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
      <button id="minimize-button" class="minimize-button"></button>
      <button id="min-max-button" class="min-max-button"></button>
      <button id="close-button" class="close-button"></button>
    </div>
  </div>
</template>
<script src="./titlebar.ts" lang="ts"></script>
