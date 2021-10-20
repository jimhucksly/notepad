<template>
  <ul
    v-if="tree && tree.length"
    :style="level > 1 ? 'display: none;' : false"
  >
    <template v-for="(item, index) in tree">
      <li
        :key="index"
        v-if="item.name.trim() && item.slug.trim()"
        :class="`level-${level}`"
      >
        <span
          :title="item.name"
          :ref="item.id"
          :class="{
            'tree_item_plus': item.children && item.children.length,
            'tree_item_minus tree_item_empty' : (!item.children || !item.children.length) && level === 1,
            'tree_item_node': (!item.children || !item.children.length) && level > 1,
            'tree_item_node--last': index === tree.length - 1
          }"
          @click="selectNode(item)"
        >
          {{ item.name }}
        </span>
        <template v-if="item.children && item.children.length">
          <library-tree :tree="item.children" :level="level + 1" />
        </template>
      </li>
    </template>
  </ul>
  <div v-else></div>
</template>
<script src="./index.ts" lang="ts"></script>
