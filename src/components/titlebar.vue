<template>
  <v-container id="titlebar" class="title-bar pa-0">
    <v-row no-gutters>
      <v-col v-if="isAuth && yandexDiskAccessToken" class="d-flex align-center">
        <button class="title-bar__button" @click="toPreferences">
          <span style="color: var(--primary-l-4)">Preferences</span>
        </button>
        <button class="title-bar__button" @click="reload">
          <span style="color: var(--primary-l-4)">Reload</span>
        </button>
        <button class="title-bar__button" @click="toAbout">
          <span style="color: var(--primary-l-4)">About</span>
        </button>
      </v-col>
      <v-col class="d-flex align-center justify-center" style="flex-basis: 50%; position: relative;">
        <span class="titlebar-logo">
          <img src="assets/images/icons/24x24.png" alt="" />
        </span>
        <p>{{ title }}</p>
        <div v-if="process" class="title-bar__process">
          <b-loader small :full="false" /> <span class="p-l-5">{{ process.name }}</span>
        </div>
        <div class="title-bar__account">
          <b-button v-if="isAuth && yandexDiskAccessToken" variant="text" text icon size="m" @click="toAccount">
            <b-icon path="assets/images" width="29" height="29">user</b-icon>
          </b-button>
        </div>
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <button class="title-bar__button title-bar__button--minimize" @click="$electron.ipcRenderer.send('minimize')"></button>
        <button
          class="title-bar__button title-bar__button--min-max"
          :class="[isMaximized ? 'title-bar__button--to-min' : 'title-bar__button--to-max']"
          @click="$electron.ipcRenderer.send('min-max')"
        ></button>
        <button class="close-button" @click="$electron.ipcRenderer.send('hide')"></button>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./titlebar.ts" lang="ts"></script>
