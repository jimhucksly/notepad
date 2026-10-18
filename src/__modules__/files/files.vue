<template>
  <v-card>
    <v-card-title>
      fdgdgdf
    </v-card-title>
    <v-card-text id="drop-area">
      <file
        v-for="(item, i) in files"
        :key="item.id"
        :item="item"
        :index="i"
        :selected="item.id === selected"
        :rows="rows"
        @on-select="onSelect"
        @set-position="onUpdateRow"
      />
    </v-card-text>
  </v-card>
  <!-- <div id="upload-download-popup" v-if="uploading">
    <div class="label">
      <span>Uploading file...</span>
      <span class="percentage" ref="text"></span>
    </div>
    <div class="progress" ref="progress"></div>
  </div> -->
</template>
<script src="./files.ts" lang="ts"></script>
<style src="./files.scss" lang="scss" scoped></style>
