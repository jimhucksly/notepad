<template>
  <ul
    v-if="tree && tree.length"
    :style="level > 1 ? 'display: none;' : false"
    >
    <li
      v-for="item in tree"
      v-if="item.name.trim() && item.slug.trim()"
      :key="item.id"
      :class="`level-${level}`"
      >
      <span
        :title="item.name"
        :ref="item.id"
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
        if(item.children && item.children.length) {
          const node = this.$refs[item.id][0]
          const ul = node.nextElementSibling
          const isExpanded = node.classList.contains('expanded')
          if(isExpanded) {
            node.classList.remove('expanded')
            this.$slideUp(ul, 200)
          } else {
            node.classList.add('expanded')
            this.$slideDown(ul, 200)
          }
        }
      }
    }
  }
}
</script>
