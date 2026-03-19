<template>
  <div class="container">
    <div class="library_inner">
      <tree v-if="tree" :tree="tree" :level="1" />
    </div>
    <div
      class="library_files_btn"
      :class="{
        active: false,
      }"
      @click="toggleFiles"
    >
      Library Files
    </div>
  </div>
  <files :expanded="isFilesExpanded" @hide="toggleFiles" />
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style lang="scss" scoped>
.container {
  position: relative;
  flex-basis: 100%;
  flex-grow: 1;
  padding-top: 5px;
  padding-bottom: 54px;
  background-color: var(--dark);
  z-index: 9;

  .library_inner {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .library_files_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 54px;
    padding-left: 35px;
    flex-shrink: 0;
    color: var(--yellow_light);
    border-top: 1px solid var(--dark_light);
    cursor: pointer;

    &:hover {
      &:after {
        border-color: var(--blue-gray);
      }
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -5px;
      right: 15px;
      width: 9px;
      height: 9px;
      border-top: 2px solid var(--dark_light);
      border-right: 2px solid var(--dark_light);
      transform: rotate(45deg);
      transition: 0.2s;
    }

    &.active {
      background-color: var(--dark_darken-2);
    }
  }
}
</style>
