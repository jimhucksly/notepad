<template>
  <div class="library_files" :class="{ expanded }">
    <div class="library_files_title">Library: Files</div>
    <div class="library_files_inner">
      <ul v-if="libraryFiles">
        <li v-for="file in libraryFiles" :key="file.id" :class="{ active: file.id === currentId }">
          <span>{{ file.name }}</span>
          <div aria-role="controls">
            <b-button icon text variant="text" @click="openFile(file)">
              <b-icon>book-open-page-variant</b-icon>
            </b-button>
            <b-button icon text variant="text" @click="removeFile(file)">
              <b-icon>delete</b-icon>
            </b-button>
          </div>
        </li>
      </ul>
      <b-button icon variant="flat" color="primary" class="ma-4" @click="add">
        <b-icon>plus</b-icon>
      </b-button>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./files.scss" lang="scss" scoped></style>
