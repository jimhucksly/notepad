<template>
  <div class="json_viewer json_viewer_cont">
    <div class="json_viewer_src">
      <editor
        :value="content"
        lang="javascript"
        theme="twilight"
        width="100%"
        height="100%"
        @init="editorInit($event)"
        @input="$emit('input', $event)"
      />
      <div class="json_viewer_separator items-center" @mousedown="drag($event)">
        <div>
          <div style="width: 100%; height: 3px" class="items-center" v-for="i in [1, 2, 3, 4, 5, 6, 7, 8]" :key="i">
            <i style="width: 1px; height: 2px; background-color: var(--white)"></i>
            <i style="width: 1px; height: 2px;"></i>
            <i style="width: 1px; height: 2px; background-color: var(--white)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="json_viewer_res"></div>
    <div class="json_viewer_notice"></div>
  </div>
</template>
<script src="./main.ts" lang="ts"></script>
