<template>
  <div ref="item" class="notepad_item" :data-stamp="item.key" :class="{ unread: item.unread }">
    <div>
      <div class="notepad_item_date">{{ item.date }}</div>
    </div>
    <div ref="content" class="notepad_item_content">
      <p @click.prevent="openLink($event)" v-html="message"></p>
    </div>
    <div class="notepad_item_btns">
      <b-button icon variant="tonal" @click.prevent="edit">
        <b-icon>pencil</b-icon>
      </b-button>
      <b-button icon variant="tonal" @click.prevent="remove">
        <b-icon>delete</b-icon>
      </b-button>
    </div>
  </div>
</template>
<script src="./item.ts" lang="ts"></script>
<style lang="scss" scoped src="./item.scss"></style>
