<template>
  <div id="drop-area">
    <file
      v-for="(item, i) in files"
      :key="item.id"
      :item="item"
      :index="i"
      :selected="item.id === selected"
      @on-select="onSelect"
    />
    <div id="upload-download-popup" v-if="uploading">
      <div class="label">
        <span>Uploading file...</span>
        <span class="percentage" ref="text"></span>
      </div>
      <div class="progress" ref="progress"></div>
    </div>
  </div>
</template>
<script src="./files.ts" lang="ts"></script>
