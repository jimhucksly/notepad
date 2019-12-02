<template>
  <div class="switcher">
    <span>{{ legend }}</span>
    <button class="btn btn-default btn-sm" @click="swicth">{{ btnLegend }}</button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarSwitcher',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      isProjects: 'isProjectsShowed',
      isMarkdown: 'isMarkdownShowed'
    }),
    legend() {
      if(this.isProjects) return 'Projects'
      if(this.isMarkdown) return '.md'
      return ''
    },
    btnLegend() {
      if(this.isProjects) return '.md'
      if(this.isMarkdown) return 'Projects'
      return ''
    }
  },
  methods: {
    swicth() {
      this.$store.dispatch('projects')
      this.$store.dispatch('markdown')
    }
  }
}
</script>