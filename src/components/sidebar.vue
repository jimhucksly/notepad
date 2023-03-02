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
    <json-viewer-btns
      v-show="section.JsonViewer"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <div class="links" v-show="section.Links" :style="{ opacity: isSwitcherMenuExpanded ? 0.4 : 1 }">
      <button @click="addLink">
        <svg-icon icon="btnAdd" width="32" height="23" />
      </button>
    </div>
    <div class="todo" v-show="section.Todo" :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}">
      <button @click="addTodo">
        <svg-icon icon="btnAdd" width="32" height="23" />
      </button>
    </div>
    <div class="files g-column" v-show="section.Files" :style="{ opacity: isSwitcherMenuExpanded ? 0.4 : 1 }">
      <div class="g-row m-b-35">
        <label class="button">
          <svg-icon icon="btnAdd" width="32" height="23" />
          <input type="file" @change="onFileChange">
        </label>
        <button @click="onFileDownload" class="m-l-5">
          <svg-icon icon="btnOpen" width="32" height="23" />
        </button>
        <button @click="onFileRemove" class="m-l-35">
          <svg-icon icon="btnClear" width="32" height="23" />
        </button>
      </div>
      <template v-if="fileSelected">
        <div class="file-info">
          <small class="file-info_label">File name:</small>
          <span class="file-info_name">{{ fileSelected.name }}</span>
        </div>
        <div class="file-info">
          <small class="file-info_label">File created:</small>
          <span class="file-info_name">{{ $dateFormat(fileSelected.createDateTime) }}</span>
        </div>
        <div class="file-info">
          <small class="file-info_label">File size:</small>
          <span class="file-info_name">{{ fileSelected.size }}</span>
        </div>
      </template>
    </div>
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
