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
    <div class="editor_content" v-if="isPreview" v-html="template"></div>
  </div>
</template>
<script src="./library.ts" lang="ts"></script>
