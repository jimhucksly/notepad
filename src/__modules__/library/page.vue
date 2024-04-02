<template>
  <div class="editor_wrapper" ref="editor_wrapper">
    <b-tabs v-model="isPreview">
      <template #default="props">
        <b-tab :value="true" v-bind="props">Preview</b-tab>
        <b-tab :value="false" v-bind="props">Text</b-tab>
      </template>
    </b-tabs>
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
<script src="./page.ts" lang="ts"></script>
<style lang="scss" scoped>
.editor_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding: 5px;
  background-color: var(--dark);

  .editor-toolbar {
    height: 34px;

    .fa-save {
      cursor: pointer;
    }
  }

  .editor_save {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 34px;
    width: 50px;
    top: 5px;
    right: 5px;
    z-index: 99;
    color: var(--dark);
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    background-color: var(--white);

    :hover {
      background: #fcfcfc;
      border-color: #95a5a6;
    }

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      transform: translateY(1px);
      border: 1px solid transparent;
      border-radius: 3px;
    }
  }

  .CodeMirror {
    flex-basis: 100%;
    flex-grow: 1;
  }

  .editor-statusbar {
    flex-shrink: 0;
  }

  .CodeMirror-scroll {
    min-height: 100%;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .editor_content {
    flex-basis: 100%;
    padding: 10px;
    width: 100%;
    background-color: var(--white);
    overflow-x: hidden;
    overflow-y: auto;
  }

  .editor_text {
    position: relative;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-basis: 100%;
    background-color: var(--white);
    width: 100%;
    z-index: 2;

    .editor-toolbar {
      position: absolute;
      display: flex;
      align-items: center;
      top: -34px;
      right: 0;
      background-color: var(--white);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      z-index: 99;
    }
  }
}

:deep() {
  .editor_content {
    .md-anchor {
      visibility: hidden;
    }
    pre {
      margin-bottom: 10px;
      background: var(--blue_light-2);
      padding: 6px;
      line-height: 18px;
      border-radius: 6px;
      border: 1px solid var(--grey);
      color: var(--black);
    }
  }
}
</style>
