<template>
  <div
    v-if="current"
    class="switcher"
    :class="{
      'switcher--expanded': isExpand,
      'switcher--not-clickable': isNotClickable
    }"
  >
    <span class="switcher__legend" @click="toggle">
      {{ current.nameAlt }}
      <i class="switcher__legend_caret"></i>
    </span>
    <div class="switcher__menu">
      <ul>
        <li
          v-for="(item, index) in menu"
          :key="index"
          :class="{ active: item.id === current.id }"
          @click="select(item.fsmState)"
        >
          {{ item.nameAlt }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./sidebarSwitcher.ts" lang="ts"></script>
