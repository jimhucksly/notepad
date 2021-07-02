<template>
  <aside>
    <sidebar-switcher
      v-bind="switcherProps"
      @on-expand="isSwitcherMenuExpanded = true"
      @on-hide="isSwitcherMenuExpanded = false"
    />
    <projects
      ref="projects"
      class="projects"
      v-show="isProjects"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <projects-editor v-if="isProjects" :expanded="isProjectEditorVisibility" />
    <projects-archives v-if="isProjects" :expanded="isProjectArchivesVisibility" />
    <library
      v-show="isLibrary"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <library-files v-if="isLibraryFilesVisibility" />
    <json-viewer-btns
      class="json_viewer"
      v-show="isJsonViewer"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <links-btns
      class="links"
      v-show="isLinks"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <todo-btns
      class="todo"
      v-show="isTodo"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
