<template>
  <div class="popup" v-show="showPopup">
    <div class="popup-window" :style="`width: ${width}`">
      <div class="popup-title-bar">
        <span>{{ title }}</span>
        <div class="popup-close-btn" @click="close"></div>
      </div>
      <div class="popup-inner">
        <component
          v-if="component"
          :is="component"
          v-bind="props"
          @set-result="onSetResult"
        />
      </div>
    </div>


    <!-- <div class="popup-window popup-library-file-add" v-if="libraryFileAddPopupShow">
      <popup-title>
        Create a new Library file
        <close-btn @click="showLibraryFileAddPopup(false)" />
      </popup-title>
      <form>
        <div class="m-b-15">
          <input type="text" v-model="libraryFileTitle" placeholder="Title">
        </div>
        <div class="m-b-15">
          <input type="text" v-model="libraryFileName" placeholder="File name">
        </div>
        <div class="flex-end">
          <button class="btn btn-primary" @click.prevent="addLibraryFile">Save</button>
        </div>
      </form>
    </div> -->
  </div>
</template>
<script src="./popup.ts" lang="ts"></script>
