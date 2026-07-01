<template>
  <div ref="projects" class="projects">
    <div class="projects_inner scroll-s scroll-transparent">
      <div
        v-for="item in json"
        :key="item.key"
        class="projects_item"
        data-role="projects-item"
        :data-stamp="item.key"
        :class="{
          lock: item.lock,
          active: filter[item.key],
          checked: item.key === selected,
        }"
        @click="toggleFilter($event, item.key)"
      >
        <div class="flex-start items-center gap-2">
          <b-checkbox size="s" :model-value="item.key === selected" @change="toggleCheck($event, item.key)" />
          <label>{{ item.name || item.key }}</label>
          <div class="projects_item_icon">
            <b-icon>lock</b-icon>
          </div>
        </div>
      </div>
    </div>
    <div
      class="projects_archive_btn"
      :class="{
        active: isArchivesExpaned,
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
<style lang="scss" scoped src="./sidebar.scss"></style>
