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
    <projects
      ref="projects"
      class="projects"
      v-show="section.Projects"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <projects-editor
      v-if="section.Projects"
      v-show="!isSwitcherMenuExpanded || isProjectEditorVisibility"
      :expanded="isProjectEditorVisibility"
    />
    <projects-archives
      v-if="section.Projects"
      v-show="!isSwitcherMenuExpanded || isProjectArchivesVisibility"
      :expanded="isProjectArchivesVisibility"
    />
    <library
      v-show="section.Library"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <library-files
      v-if="section.Library"
      v-show="!isSwitcherMenuExpanded || isLibraryFilesVisibility"
      :expanded="isLibraryFilesVisibility"
    />
    <template v-for="item in components">
      <component :is="item.name" v-if="item.fsmState === mainSection" />
    </template>
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
