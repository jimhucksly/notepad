<template>
  <div
    class="projects_archives"
    :class="{
      expanded: expanded
    }"
  >
    <div class="projects_archives_title">Projects: Archives</div>
    <div class="projects_archives_inner">
      <ul>
        <li v-for="(o, index) in items" :key="index">
          {{ o.name }}
          <small>Created at: {{ getDate(o.date) }}</small>
          <i
            class="icon icon-restore"
            @click="restore(o)"
          >
            <svg-icon icon="restoreIcon" />
          </i>
          <i
            class="icon icon-remove"
            @click="remove(o)"
          >
            <svg-icon icon="removeIconSm" />
          </i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./projectsArchives.ts" lang="ts"></script>
