<template>
  <div class="g-column">
    <div class="notepad_cont" ref="notepad_cont">
      <template v-for="(item, stamp) in json">
        <project-item
          :key="stamp"
          v-if="!hasFilter || `${stamp}` in filter"
          :item="json[stamp]"
          :is-last="stamp === lastStamp"
          ref="notepad_item"
          @on-will-delete="onDelete"
          @on-last-rendered="isRendered = true"
        />
      </template>
    </div>
    <div class="notepad_textarea" ref="notepad_textarea">
      <textarea placeholder="New record" v-model="message" @keydown.enter.ctrl="send"></textarea>
      <div class="notepad_btns">
        <!-- <label class="notepad_attachments">
          <svg-icon icon="icon-attach" width="40px" height="40px" />
          <input type="file" @change="onFileChange">
        </label> -->
        <button @click.prevent="send">
          <div>
            <svg-icon icon="icon-send" width="29px" height="23px" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
<script src="./projects.ts" lang="ts"></script>
