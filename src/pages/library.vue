<template>
  <div class="editor_wrapper" ref="editor_wrapper">
    <div class="editor_tabs">
      <div class="editor_tabs_item --tab-preview" :class="{ '--active': isPreview }" @click="toggle(true)">
        Preview
      </div>
      <div class="editor_tabs_item --tab-text" :class="{ '--active': !isPreview }" @click="toggle(false)">
        Text
      </div>
    </div>
    <button class="editor_save" v-if="isPreview" @click="save">
      <span class="fa fa-save"></span>
    </button>
    <div class="editor_content" v-if="isPreview && !updating" v-html="template"></div>
    <div class="editor_text" ref="editor_text" v-show="!isPreview"></div>
  </div>
</template>
<script src="./library.ts" lang="ts"></script>
