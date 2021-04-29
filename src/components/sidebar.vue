<template>
  <aside>
    <sidebar-switcher
      :legend="isPreferences ? 'Preferences' : ''"
      @on-expand="isSwitcherMenuExpanded = true"
      @on-hide="isSwitcherMenuExpanded = false"
    />
    <projects
      ref="projects"
      class="projects"
      v-show="!isPreferences && isProjects"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
      @on-edit="(stamp) => {
        isProjectsArchivesInit = false
        projectEditedItemKey = stamp
      }"
      @on-archives="(v) => {
        projectEditedItemKey = ''
        isProjectsArchivesInit = v
      }"
    />
    <projects-editor
      v-if="isProjectEditorVisibility"
      :item-stamp.sync="projectEditedItemKey"
    />
    <projects-archives
      v-if="isProjectArchivesVisibility"
      :init="isProjectsArchivesInit"
    />
    <library
      v-show="!isPreferences && isLibrary"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
      @on-files="(v) => {
        isLibraryFilesInit = v
      }"
    />
    <library-files
      v-if="isLibraryFilesVisibility"
      :init.sync="isLibraryFilesInit"
    />
    <json-viewer-btns
      class="json_viewer"
      v-show="!isPreferences && isJsonViewer"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <links-btns
      class="links"
      v-show="!isPreferences && isLinks"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <todo-btns
      class="todo"
      v-show="!isPreferences && isTodo"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
