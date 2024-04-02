<template>
  <div class="projects" ref="projects">
    <div class="projects_inner">
      <div
        v-for="item in json"
        :key="item.key"
        class="projects_item"
        data-role="projects-item"
        :data-stamp="item.key"
        :class="{
          lock: item.lock,
          active: filter[item.key],
          checked: item.key === selected
        }"
        @click="toggleFilter($event, item.key)"
      >
        <div>
          <span class="projects_item_check">
            <label>
              <input
                type="checkbox"
                :data-stamp="item.key"
                :checked="item.key === selected"
                @change="toggleCheck"
              >
            </label>
          </span>
          <label>{{ item.name || item.key }}</label>
          <span class="projects_item_icon item_icon_lock">
            <svg-icon icon="lockIcon" width="8" height="13" />
          </span>
        </div>
      </div>
    </div>
    <div
      class="projects_archive_btn"
      :class="{
        active: isArchivesExpaned
      }"
      @click="toggleArchives"
    >
      Archives
    </div>
  </div>
  <archives :expanded="isArchivesExpaned" @on-hide="onArchivesHide" />
  <properties :expanded="isPropertiesExpanded" @on-hide="onPropertiesHide" />
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style lang="scss" scoped>
.projects {
  position: relative;
  flex-basis: 100%;
  flex-grow: 1;
  padding-top: 5px;
  padding-bottom: 54px;
  background-color: var(--dark);
  overflow: hidden;
  z-index: 9;

  .projects_inner {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .projects_item {
    position: relative;
    padding: 3px 0;
    color: var(--yellow_light);
    cursor: pointer;
    white-space: nowrap;
    transition: 0.2s;

    & > div {
      width: 100%;
      height: 100%;
      padding: 6px 35px 6px 35px;
    }

    label {
      display: block;
      max-width: 100%;
      height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      cursor: pointer;
      -moz-user-select: none;
      -khtml-user-select: none;
      user-select: none;
      z-index: 10;
    }

    input[type="text"] {
      display: none;
      position: relative;
      border: 1px solid var(--blue-gray_light);
      background-color: transparent;
      color: var(--yellow);
      width: 100%;
      height: 20px;
      margin-left: -7px;
      z-index: 10;
    }

    .projects_item_icon {
      position: absolute;
      z-index: 10;

      svg {
        width: 100%;
        height: 100%;
      }

      &.item_icon_lock {
        display: none;
        top: 9px;
        right: 15px;
        width: 12px;
        height: 12px;
      }
    }

    .projects_item_check {
      display: none;
      position: absolute;
      top: 9px;
      left: 15px;
      width: 13px;
      height: 13px;
      border: 1px solid #888;
      border-radius: 3px;
      cursor: pointer;
      transition: 0.2s;

      input[type="checkbox"] {
        display: none;
      }

      label {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    &.active {
      & > div {
        background-color: var(--magenta_light);
      }

      &:hover {
        background-color: transparent;
        & > div {
          background-color: var(--magenta_light);
        }
      }
    }

    &.lock {
      .item_icon_lock {
        display: block;
      }
    }

    &.checked {
      &:not(.active) {
        background-color: var(--dark_darken-2);
      }

      .projects_item_check {
        display: block;

        &:after {
          content: '';
          display: block;
          position: absolute;
          top: 1px;
          left: 1px;
          width: 9px;
          height: 9px;
          border-radius: 2px;
          background-color: var(--yellow);
        }
      }
    }

    &:hover {
      background-color: var(--dark_darken-1);
      color: var(--yellow);

      .projects_item_check {
        display: block;
      }
    }
  }
}
.projects_archive_btn {
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
      border-color: var(--dark_lighten);
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
</style>
