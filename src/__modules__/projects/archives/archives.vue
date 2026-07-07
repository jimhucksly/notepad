<template>
  <div class="projects_archives" :class="{ expanded: expanded }">
    <div class="projects_archives_title">Projects: Archives</div>
    <div class="projects_archives_inner">
      <ul>
        <li v-for="(o, index) in items" :key="index">
          {{ o.name }}
          <small>Created at: {{ getDate(o.date) }}</small>
          <i class="icon icon-restore" @click="restore(o)">
            <b-icon>restore</b-icon>
          </i>
          <i class="icon icon-remove" @click="remove(o)">
            <b-icon>delete-outline</b-icon>
          </i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./archives.ts" lang="ts"></script>
<style lang="scss" scoped src="./archives.scss"></style>
