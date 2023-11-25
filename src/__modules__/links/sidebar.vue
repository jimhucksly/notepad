<template>
  <div class="links">
    <button @click="addLink">
      <svg-icon icon="btnAdd" width="32" height="23" />
    </button>
  </div>
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style lang="scss" scoped>
.links {
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  padding-top: 5px;
  button {
    width: 32px;
    height: 25px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.85;

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
