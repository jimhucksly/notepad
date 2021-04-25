<template>
  <div
    class="library_files"
    :class="{
      expanded: init
    }"
  >
    <div class="library_files_title">Library: Files</div>
    <div class="library_files_inner">
      <ul>
        <li>
          <span>SOLID</span>
          <div>
            <i
              class="icon icon-read"
            >
              <svg-icon icon="readIcon" />
            </i>
            <i
              class="icon icon-remove"
            >
              <svg-icon icon="removeIconSm" />
            </i>
          </div>
        </li>
        <li>
          <span>Алгоритмы</span>
        </li>
        <li>
          <span>Паттерны</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./libraryFiles.ts" lang="ts"></script>
