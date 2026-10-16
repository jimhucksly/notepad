<template>
  <v-container class="pa-0" id="drop-area">
    <v-row no-gutters>
      <v-col cols="4" v-for="(item, i) in files" :key="item.id">
        <file
          :item="item"
          :index="i"
          :selected="item.id === selected"
          :checking="checking"
          :checked="checkeds.includes(item.id)"
          @on-select="onSelect"
          @on-check="onCheck"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- <div >

    <div v-if="uploading" id="upload-download-popup">
      <div class="label">
        <span>Uploading file...</span>
        <span ref="text" class="percentage"></span>
      </div>
      <div ref="progress" class="progress"></div>
    </div>
  </div> -->
</template>
<script src="./files.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
