<template>
  <div ref="item" class="notepad_item" :data-stamp="item.key" :class="{ unread: item.unread }">
    <div>
      <div class="notepad_item_date">{{ item.date }}</div>
    </div>
    <div ref="content" class="notepad_item_content">
      <p @click.prevent="openLink($event)" v-html="message"></p>
    </div>
    <div class="notepad_item_btns">
      <button @click.prevent="edit">
        <svg-icon icon="editIcon" />
      </button>
      <button @click.prevent="remove">
        <svg-icon icon="removeIcon" />
      </button>
    </div>
  </div>
</template>
<script src="./item.ts" lang="ts"></script>
<style lang="scss" scoped src="./item.scss"></style>
