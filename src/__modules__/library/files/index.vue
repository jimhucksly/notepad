<template>
  <div class="library_files" :class="{ expanded }">
    <div class="library_files_title">Library: Files</div>
    <div class="library_files_inner">
      <ul v-if="libraryFiles">
        <li v-for="file in libraryFiles" :key="file.id" :class="{ active: file.id === currentId }">
          <span>{{ file.name }}</span>
          <div>
            <i class="icon icon-read" @click="openFile(file)">
              <svg-icon icon="readIcon" />
            </i>
            <i class="icon icon-remove" @click="removeFile(file)">
              <svg-icon icon="removeIconSm" />
            </i>
          </div>
        </li>
      </ul>
      <button @click="add">
        <svg-icon icon="btnAdd" width="32" height="23" />
      </button>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style lang="scss" scoped>
.library_files {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark_darken-2);
  z-index: 8;
  transition: 0.3s;

  &.expanded {
    transform: translateX(100%);
  }

  .library_files_title {
    display: flex;
    align-items: center;
    flex-basis: 54px;
    flex-shrink: 0;
    padding-left: 15px;
  }

  ul {
    li {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 9px 35px 9px 15px;
      color: var(--yellow_light);
      cursor: default;
      transition: 0.2s;

      &:hover {
        background-color: var(--dark_darken-1);

        .icon {
          display: block;
        }
      }

      &:before {
        content: '';
        display: none;
        position: absolute;
        top: 50%;
        left: 6px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background-color: var(--green_light);
      }

      &.active {
        &:before {
          display: block;
        }
      }

      .icon {
        position: absolute;
        top: 9px;
        display: none;
        width: 15px;
        height: 15px;
        cursor: pointer;
        transition: 0.2s;
        svg {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .icon-read {
        right: 36px;
      }

      .icon-remove {
        right: 15px;
      }
    }
  }

  button {
    width: 25px;
    height: 25px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.85;
    margin: 15px 5px 0px 15px;

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
