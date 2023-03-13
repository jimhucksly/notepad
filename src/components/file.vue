<template>
  <div
    class="file"
    :class="{
      selected,
      checking,
      checked
    }"
    @click="onSelect"
  >
    <div class="file_icon">
      <i class="icon">
        <img :src="`assets/images/file_types_icons/${type}.svg`">
      </i>
    </div>
    <div class="file_name">
      {{ item.name }}
    </div>
    <div class="file_check">
      <label>
        <input type="checkbox" v-model="isChecked">
        <span>
          <svg-icon icon="checkIcon" width="14" height="10" style="color: var(--editor_green_darken-10)" />
        </span>
      </label>
    </div>
  </div>
</template>
<script src="./file.ts" lang="ts"></script>
