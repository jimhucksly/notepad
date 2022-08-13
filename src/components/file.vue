<template>
  <div class="notepad_item_file" ref="item_file_cont">
    <div class="file_icon">
      <i class="icon">
        <img :src="`assets/images/file_types_icons/${type}.svg`">
      </i>
    </div>
    <div class="file_link">
      <div>{{ fileName }}</div>
      <div>
        <span v-if="downloading" class="link">getting the link...</span>
        <span v-else @click.prevent="downloadFile" class="link">Download</span>
      </div>
    </div>
    <div>
      <div class="file_loader" ref="loader"><span></span></div>
    </div>
  </div>
</template>
<script src="./file.ts" lang="ts"></script>
