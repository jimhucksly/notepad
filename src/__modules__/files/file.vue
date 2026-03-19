<template>
  <div
    class="file"
    :class="{
      selected,
      checking,
      checked,
    }"
    @click="onSelect"
  >
    <div class="file_icon">
      <i class="icon">
        <img :src="`assets/images/file_types_icons/${type}.svg`" />
      </i>
    </div>
    <div class="file_name">
      {{ item.name }}
    </div>
    <div class="file_check">
      <label>
        <input v-model="isChecked" type="checkbox" />
        <span>
          <svg-icon icon="checkIcon" width="14" height="10" style="color: var(--editor_green_darken-10)" />
        </span>
      </label>
    </div>
  </div>
</template>
<script src="./file.ts" lang="ts"></script>
<style lang="scss" scoped>
.file {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 65px;
  padding: 3px;
  min-height: 65px;
  max-height: 110px;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;

  &.selected {
    border: 1px solid var(--black_light);
    background-color: var(--blue_light-op-02);
  }
  &.checking {
    .file_icon,
    .file_name {
      opacity: 0.6;
    }
    .file_check {
      display: block;
    }
  }

  &.checked {
    .file_icon,
    .file_name {
      opacity: 0.8;
    }
    .file_check {
      span {
        background-color: rgba(255, 255, 255, 1);
        border-color: var(--editor_green_darken-10);
        box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.2);
        svg {
          display: block;
        }
      }
    }
  }

  .file_icon {
    display: flex;
    align-items: center;
    width: 100%;
    height: 45px;
    flex-shrink: 0;

    .icon {
      display: block;
      text-align: center;
      width: 100%;
      height: 100%;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .file_name {
    display: inline-block;
    font-size: 11px;
    color: var(--blue);
    text-align: center;
    padding: 3px 0;
    width: 100%;
    line-height: 13px;
    overflow: hidden;
    white-space: pre-line;
    word-wrap: break-word;
  }

  .file_loader {
    display: none;
    position: relative;
    height: 13px;
    background-color: var(--blue);
    margin-left: 15px;

    span {
      display: block;
      position: absolute;
      width: 15px;
      height: 15px;
      top: 0;
      right: -18px;
      font-size: 11px;
      color: var(--dark);
      white-space: nowrap;

      &.error {
        color: var(--red);
      }
    }
  }
  .file_check {
    display: none;
    position: absolute;
    top: 13px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    z-index: 10;

    input[type='checkbox'] {
      display: none;
    }

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 23px;
      height: 23px;
      border: 1px solid var(--dark);
      border-radius: 4px;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.1);
      svg {
        display: none;
      }
    }
  }
}
</style>
