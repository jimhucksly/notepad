<template>
  <div class="projects">
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
      class="projects_archive"
      :class="{
        active: isArchivesInit
      }"
      @click="toggleArchives"
    >
      Archives
    </div>
  </div>
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

  .projects_archive {
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
}
.projects_editor {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 15px;
    background-color: var(--dark_darken-2);
    z-index: 8;
    transition: 0.3s;

    &.expanded {
      transform: translateX(100%);
    }

    .projects_editor_inner {
      flex-basis: 100%;
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding-right: 15px;

      a {
        display: flex;
        text-decoration: none;
        color: #fff;
        font-size: 13px;

        &.--remove {
          color: var(--editor_red);

          span {
            border-color: var(--editor_red);
          }
        }

        span {
          display: block;
          border-bottom: 1px dashed #fff;
        }
      }

      .icon {
        display: block;
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
    }

    .form-group {
      .form-group-inner {
        label {
          color: #fff;
        }
      }
    }

    form {
      input[type="text"] {
        height: 20px;
        font-size: 13px;
      }
    }

    .projects_editor_footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-basis: 54px;
      flex-shrink: 0;
      padding-right: 15px;
    }
  }

  .projects_editor_title,
  .projects_archives_title {
    display: flex;
    align-items: center;
    flex-basis: 54px;
    flex-shrink: 0;
  }

  .projects_archives {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 15px;
    background-color: var(--dark_darken-2);
    z-index: 8;
    transition: 0.3s;

    &.expanded {
      transform: translateX(100%);
    }
  }

  .projects_archives_inner {
    flex-basis: 100%;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;

    ul {
      li {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 9px 35px 9px 0px;
        color: var(--yellow_light);
        cursor: default;
        transition: 0.2s;

        &:first-child {
          padding-top: 0;
        }

        &:hover {
          .icon {
            display: block;
          }
        }

        small {
          display: block;
          margin-top: 4px;
          color: var(--blue-gray);
        }
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

    .icon-restore {
      right: 36px;
    }
    .icon-remove {
      right: 15px;
    }
  }
</style>
