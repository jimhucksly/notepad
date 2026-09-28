<template>
  <div class="container">
    <div class="library_inner sidebar-scroll">
      <tree v-if="tree" :tree="tree" :level="1" />
    </div>
    <div
      class="library_files_btn"
      :class="{
        active: false,
      }"
      @click="toggleFiles"
    >
      Library Files
    </div>
  </div>
  <files :expanded="isFilesExpanded" @hide="toggleFiles" />
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style src="./sidebar.scss" lang="scss" scoped></style>
