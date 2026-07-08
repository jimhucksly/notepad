<template>
  <div class="g-column">
    <div ref="notepad_cont" class="notepad_cont">
      <template v-for="(item, stamp) in json">
        <item
          v-if="!hasFilter || `${stamp}` in filter"
          :key="stamp"
          ref="notepad_item"
          :item="json[stamp]"
          :is-last="stamp === lastStamp"
          @on-remove="onRemove"
          @on-last-rendered="isRendered = true"
        />
      </template>
    </div>
    <div ref="notepad_textarea" class="notepad_textarea">
      <div class="notepad_textarea-wrapper">
        <b-textarea v-model="message" placeholder="New record" hide-details @keydown.enter.ctrl="send"></b-textarea>
      </div>
      <div class="notepad_btns">
        <b-button icon color="primary">
          <b-icon>send</b-icon>
        </b-button>
      </div>
    </div>
  </div>
</template>
<script src="./main.ts" lang="ts"></script>
<style lang="scss" scoped src="./main.scss"></style>
