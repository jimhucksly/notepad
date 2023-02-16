<template>
  <aside>
    <sidebar-switcher
      @on-expand="isSwitcherMenuExpanded = true"
      @on-hide="isSwitcherMenuExpanded = false"
    />
    <projects
      ref="projects"
      class="projects"
      v-show="isProjects"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <projects-editor
      v-if="isProjects"
      v-show="!isSwitcherMenuExpanded || isProjectEditorVisibility"
      :expanded="isProjectEditorVisibility"
    />
    <projects-archives
      v-if="isProjects"
      v-show="!isSwitcherMenuExpanded || isProjectArchivesVisibility"
      :expanded="isProjectArchivesVisibility"
    />
    <library
      v-show="isLibrary"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <library-files
      v-if="isLibrary"
      v-show="!isSwitcherMenuExpanded || isLibraryFilesVisibility"
      :expanded="isLibraryFilesVisibility"
    />
    <json-viewer-btns
      v-show="isJsonViewer"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <links-btns
      v-show="isLinks"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <todo-btns
      v-show="isTodo"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
