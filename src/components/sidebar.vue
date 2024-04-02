<template>
  <aside>
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
    <template v-for="item in components">
      <component :is="item.name" v-if="item.fsmState === mainSection" />
    </template>
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
