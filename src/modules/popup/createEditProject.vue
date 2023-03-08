<template>
  <div style="height: 100%">
    <editor
      :value="text"
      lang="text"
      width="100%"
      height="100%"
      @init="editorInit($event)"
      @input="$emit('input', $event)"
    />
  </div>
</template>
<script src="./createEditProject.ts" lang="ts"></script>
