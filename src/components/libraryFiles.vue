<template>
  <div
    class="library_files"
    :class="{
      expanded: init
    }"
  >
    <div class="library_files_title">Library: Files</div>
    <div class="library_files_inner">
      <ul v-if="libraryFiles">
        <li v-for="file in libraryFiles">
          <span>{{ file.name }}</span>
          <div>
            <i class="icon icon-read" @click="openFile(file.id)">
              <svg-icon icon="readIcon" />
            </i>
            <i
              class="icon icon-remove"
            >
              <svg-icon icon="removeIconSm" />
            </i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./libraryFiles.ts" lang="ts"></script>
