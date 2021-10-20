<template>
  <div class="json_viewer json_viewer_cont">
    <div class="json_viewer_src">
      <editor
        :value="content"
        lang="javascript"
        theme="twilight"
        width="100%"
        height="100%"
        @init="instance => editorInit(instance)"
        @input="$emit('input', $event)"
      />
      <div class="json_viewer_separator" @mousedown="drag($event)"></div>
    </div>
    <div class="json_viewer_res"></div>
    <div class="json_viewer_notice"></div>
  </div>
</template>
<script src="./jsonViewer.ts" lang="ts"></script>
