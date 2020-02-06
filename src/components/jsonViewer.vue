<template>
  <div class="json_viewer">
    <section>
      <editor
        v-model="content"
        @init="editorInit"
        :options="options"
        lang="javascript"
        theme="twilight"
        width="100%"
        height="100%"
      />
    </section>
    <section></section>
  </div>
</template>
<script src="./jsonViewer.ts" lang="ts"></script>
