<template>
  <div class="json_viewer">
    <button @click="open">
      <svg-icon icon="btnOpen" width="32" height="23" />
    </button>
    <button @click="save">
      <svg-icon icon="btnSave" width="32" height="23" />
    </button>
    <button @click="clear" class="m-l-35">
      <svg-icon icon="btnClear" width="32" height="23" />
    </button>
  </div>
</template>
<script src="./jsonViewerBtns.ts" lang="ts"></script>
