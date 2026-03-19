<template>
  <div class="json_viewer">
    <button @click="open">
      <svg-icon icon="btnOpen" width="32" height="23" />
    </button>
    <button @click="save">
      <svg-icon icon="btnSave" width="32" height="23" />
    </button>
    <button class="m-l-35" @click="clear">
      <svg-icon icon="btnClear" width="32" height="23" />
    </button>
  </div>
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style lang="scss" scoped>
.json_viewer {
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  padding-top: 5px;
  button {
    width: 33px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.85;
    margin-right: 5px;

    &:hover {
      opacity: 1;
    }

    &:active {
      opacity: 1;
      transform: scale(0.85);
    }
  }
}
</style>
