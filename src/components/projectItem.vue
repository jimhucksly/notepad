<template>
  <div class="notepad_item" ref="item" :data-stamp="item.key" :class="{ unread: item.unread }">
    <div>
      <div class="notepad_item_date">{{ item.date }}</div>
    </div>
    <div class="notepad_item_content" ref="content">
      <p v-html="message" @click.prevent="openLink($event)"></p>
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
<script src="./projectItem.ts" lang="ts"></script>
