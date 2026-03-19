<template>
  <div class="projects_archives" :class="{ expanded: expanded }">
    <div class="projects_archives_title">Projects: Archives</div>
    <div class="projects_archives_inner">
      <ul>
        <li v-for="(o, index) in items" :key="index">
          {{ o.name }}
          <small>Created at: {{ getDate(o.date) }}</small>
          <i class="icon icon-restore" @click="restore(o)">
            <svg-icon icon="restoreIcon" />
          </i>
          <i class="icon icon-remove" @click="remove(o)">
            <svg-icon icon="removeIconSm" />
          </i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./archives.ts" lang="ts"></script>
<style lang="scss" scoped>
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
.projects_archives_title {
  display: flex;
  align-items: center;
  flex-basis: 54px;
  flex-shrink: 0;
}
</style>
