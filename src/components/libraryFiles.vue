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
        <li v-for="file in libraryFiles" :class="{ active: file.id === currentId }">
          <span>{{ file.title }}</span>
          <div>
            <i class="icon icon-read" @click="openFile(file.id)">
              <svg-icon icon="readIcon" />
            </i>
            <i class="icon icon-remove" @click="removeFile(file.id)">
              <svg-icon icon="removeIconSm" />
            </i>
          </div>
        </li>
      </ul>
      <button @click="add">
        <svg-icon icon="btnAdd" width="32" height="23" />
      </button>
    </div>
  </div>
</template>
<script src="./libraryFiles.ts" lang="ts"></script>
