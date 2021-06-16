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
    <!-- <div class="popup-window popup-uploading" v-if="uploadingPopupShow">
      <popup-title>
        <close-btn @click="showUploadingPopup(false)" />
      </popup-title>
    </div> -->
    <!-- <div class="popup-window popup-link-add" v-if="linkAddPopupShow">
      <popup-title>
        Add link
        <close-btn @click="showAddLinkPopup(false)" />
      </popup-title>
      <form>
        <div class="m-b-15">
          <input type="text" v-model="linkUrl" placeholder="URL">
        </div>
        <div class="m-b-15">
          <input type="text" v-model="linkName" placeholder="Name">
        </div>
        <div class="flex-end">
          <button class="btn btn-primary" @click.prevent="addLink">Save</button>
        </div>
      </form>
    </div> -->
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
