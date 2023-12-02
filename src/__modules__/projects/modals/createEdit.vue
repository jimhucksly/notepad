<template>
  <div style="height: 100%" class="project-editor">
    <textarea id="editor"></textarea>
  </div>
</template>
<script src="./createEdit.ts" lang="ts"></script>
<style lang="scss" scoped>
.project-editor {
  font-family: var(--font-menlo);
  font-size: 11px;
  line-height: 19px;
  overflow: hidden;

  .CodeMirror {
    height: 100%;
  }

  .CodeMirror-scroll {
    overflow-y: auto;
  }
}
</style>
