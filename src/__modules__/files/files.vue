<template>
  <div id="drop-area">
    <file
      v-for="(item, i) in files"
      :key="item.id"
      :item="item"
      :index="i"
      :selected="item.id === selected"
      :checking="checking"
      :checked="checkeds.includes(item.id)"
      @on-select="onSelect"
      @on-check="onCheck"
    />
    <div v-if="uploading" id="upload-download-popup">
      <div class="label">
        <span>Uploading file...</span>
        <span ref="text" class="percentage"></span>
      </div>
      <div ref="progress" class="progress"></div>
    </div>
  </div>
</template>
<script src="./files.ts" lang="ts"></script>
