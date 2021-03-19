<template>
  <div class="notepad_item_btns">
    <button
      v-if="collection.includes('save')"
      v-show="editableItems.includes(itemKey)"
      @click.prevent="save(itemKey)"
    >
      <svg-icon icon="saveIcon" />
    </button>
    <button
      v-if="collection.includes('edit')"
      v-show="!editableItems.includes(itemKey)"
      @click.prevent="edit(itemKey)"
    >
      <svg-icon icon="editIcon" />
    </button>
    <button
      v-if="collection.includes('remove')"
      @click.prevent="remove(itemKey)"
    >
      <svg-icon icon="removeIcon" />
    </button>
  </div>
</template>
<script src="./controls.ts" lang="ts"></script>
