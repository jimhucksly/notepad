<template>
  <div ref="editor_wrapper" class="editor_wrapper">
    <b-tabs v-if="ready" v-model="preview" :vertical="false">
      <b-tab index="1" heading="Preview" eager>
        <div class="editor_content" v-html="template"></div>
      </b-tab>
      <b-tab index="2" heading="Tex" eager>
        <md-editor
          ref="editor"
          v-model="value"
          :preview="false"
          :footers="[]"
          :toolbars="toolbars"
          no-mermaid
          no-katex
          language="ru-RU"
          class="d-flex"
          style="height: 100% !important"
        />
      </b-tab>
    </b-tabs>
    <b-button icon variant="text" class="editor_save" @click="save">
      <b-icon>content-save</b-icon>
    </b-button>
  </div>
</template>
<script src="./page.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
