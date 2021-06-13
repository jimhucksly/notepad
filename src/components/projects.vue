<template>
  <div>
    <div class="projects_inner">
      <div
        class="projects_item"
        v-for="item in json"
        :key="item.key"
        :data-stamp="item.key"
        ref="projects_item"
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
                @change="toggleCheck"
                :data-stamp="item.key"
                :checked="item.key === selected"
              >
            </label>
          </span>
          <label>{{ item.name || item.key }}</label>
          <span class="projects_item_icon item_icon_lock">
            <svg-icon icon="lockIcon" />
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
<script src="./projects.ts" lang="ts"></script>
