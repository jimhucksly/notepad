<template>
  <ul
    v-if="tree && tree.length"
    :style="level > 1 ? 'display: none;' : false"
    >
    <li
      v-for="(item, index) in tree"
      v-if="item.name.trim() && item.slug.trim()"
      :key="index"
      :class="`level-${level}`"
      >
      <span
        :title="item.name"
        :class="{
          'tree_item_plus': item.children && item.children.length,
          'tree_item_minus' : !item.children || !item.children.length
        }"
        @click="selectNode(item)"
        >
        {{ item.name }}
      </span>
      <template v-if="item.children && item.children.length">
        <sidebar-tree :tree="item.children" :level="level + 1" />
      </template>
    </li>
  </ul>
  <div v-else></div>
</template>
<script>
import SidebarTree from '@/components/sidebarTree'

export default {
  name: 'SidebarTree',
  props: {
    tree: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 1
    }
  },
  componens: {
    SidebarTree
  },
  methods: {
    selectNode(item) {
      const editor = document.querySelector('.editor-preview')
      if(editor) {
        const link = editor.querySelector(`a[href*=${item.slug}]`)
        link && link.click()
      }
    }
  }
}
</script>
