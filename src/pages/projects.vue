<template>
  <div id="notepad_cont" :class="{ 'is-error' : isError }">
    <div class="notepad_cont" ref="notepad_cont">
      <template v-for="(item, stamp) in json">
        <notepad-item
          :key="stamp"
          v-if="!hasFilter || `${stamp}` in filter"
          :item="json[stamp]"
          :is-last="stamp === lastStamp"
          ref="notepad_item"
          @on-last-rendered="isRendered = true"
        />
      </template>
    </div>
    <div class="notepad_textarea">
      <textarea placeholder="New record" v-model="message" @keydown.enter.ctrl="send"></textarea>
      <div class="notepad_btns">
        <label class="notepad_attachments">
          <input type="file" @change="onFileChange">
        </label>
        <button @click.prevent="send"></button>
      </div>
    </div>
  </div>
</template>
<script src="./projects.ts" lang="ts"></script>
