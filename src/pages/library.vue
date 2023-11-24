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
    <button class="editor_save" @click="save">
      <span class="fa fa-save"></span>
    </button>
    <div class="editor_content" v-if="isPreview" v-html="template"></div>
    <template v-if="ready">
      <md-editor
        v-show="!isPreview"
        v-model="value"
        :preview="false"
        :footers="[]"
        :toolbars="toolbars"
        no-mermaid
        no-katex
        language="ru-RU"
        ref="editor"
        class="d-flex"
        style="height: 100% !important"
      />
    </template>
  </div>
</template>
<script src="./library.ts" lang="ts"></script>
