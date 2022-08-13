<template>
  <div class="notepad_item" :data-stamp="item.key" :class="{ unread: item.unread }">
    <div>
      <div class="notepad_item_date">{{ item.date }}</div>
    </div>
    <div class="notepad_item_content" ref="content">
      <file
        v-if="item.file !== undefined"
        ref="file"
        :item-key="item.key"
        :item-file="item.file"
      />
      <p v-else-if="!isEdit" v-html="message" @click.prevent="openLink($event)"></p>
    </div>
    <controls
      :item-key="item.key"
      :is-lock="item.lock"
      :collection="item.file ? ['remove'] : ['save', 'edit', 'remove']"
      @on-will-edit="isEdit = true"
      @on-will-save="isEdit = false"
      @on-will-delete="$emit('on-will-delete', $event)"
    />
  </div>
</template>
<script src="./projectItem.ts" lang="ts"></script>
