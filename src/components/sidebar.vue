<template>
  <aside>
    <sidebar-switcher
      :legend="isPreferences ? 'Preferences' : ''"
      @onExpand="isSwitcherMenuExpanded = true"
      @onHide="isSwitcherMenuExpanded = false"
    />
    <projects
      class="projects"
      v-show="!isPreferences && isProjects"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <div
      class="markdown"
      v-show="!isPreferences && isMarkdown"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
      >
      <sidebar-tree :tree="mdTree" />
    </div>
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
