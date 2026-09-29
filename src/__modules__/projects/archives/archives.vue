<template>
  <div class="projects_archives" :class="{ expanded: expanded }">
    <div class="projects_archives_title">Projects: Archives</div>
    <div class="projects_archives_inner sidebar-scroll">
      <ul>
        <li v-for="(o, index) in items" :key="index">
          <div class="basis-100">
            {{ o.name }}
            <small>Created at: {{ getDate(o.date) }}</small>
          </div>
          <div aria-role="controls">
            <b-button icon text @click="restore(o)">
              <b-icon>restore</b-icon>
            </b-button>
            <b-button icon text @click="remove(o)">
              <b-icon>delete</b-icon>
            </b-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./archives.ts" lang="ts"></script>
<style lang="scss" scoped src="./archives.scss"></style>
