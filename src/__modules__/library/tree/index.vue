<template>
  <ul v-if="tree && tree.length" :style="level > 1 ? 'display: none;' : undefined">
    <template v-for="(item, index) in tree">
      <li v-if="item.name.trim() && item.slug.trim()" :key="index" :class="`level-${level}`">
        <span
          :title="item.name"
          :data-ref="item.id"
          :class="{
            tree_item_plus: item.children && item.children.length,
            'tree_item_minus tree_item_empty': (!item.children || !item.children.length) && level === 1,
            tree_item_node: (!item.children || !item.children.length) && level > 1,
            'tree_item_node--last': Number(index) === tree.length - 1,
          }"
          @click="selectNode(item)"
        >
          {{ item.name }}
        </span>
        <template v-if="item.children && item.children.length">
          <tree :tree="item.children" :level="level + 1" />
        </template>
      </li>
    </template>
  </ul>
  <div v-else></div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./tree.scss" lang="scss" scoped></style>
