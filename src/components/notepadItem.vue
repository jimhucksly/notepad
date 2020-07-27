<template>
  <div class="notepad_item"
    :data-stamp="item.key"
    :class="{ unread: item.unread }">
    <div>
      <div class="notepad_item_date">{{ item.date }}</div>
    </div>
    <div class="notepad_item_content" ref="content">
      <file
        v-if="item.file !== undefined"
        ref="file"
        :item-key="item.key"
        :item-file="item.file"
        @onOpenFile="openFile"
        @onSaveFile="saveFile"
        >
      </file>
      <p v-else-if="!isEdit" v-html="message" @click.prevent="openLink($event)"></p>
    </div>
    <controls
      :item-key="item.key"
      :is-lock="item.lock"
      :collection="item.file ? ['remove'] : ['save', 'edit', 'remove']"
      @onWillEdit="isEdit = true"
      @onWillSave="isEdit = false"
      >
    </controls>
  </div>
</template>
<script src="./notepadItem.ts" lang="ts"></script>