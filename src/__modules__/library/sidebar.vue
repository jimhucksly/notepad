<template>
  <div class="markdown">
    <div class="library_inner">
      <tree v-if="tree" :tree="tree" :level="1" />
    </div>
    <div
      class="library_files_btn"
      :class="{
        active: false
      }"
      @click="toggleFiles"
    >
      Library Files
    </div>
  </div>
</template>
<script src="./sidebar.ts" lang="ts"></script>
