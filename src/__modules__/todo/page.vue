<template>
  <div class="todo_cont">
    <div v-if="isEmpty" class="empty_cont">No elements found</div>
    <template v-if="items">
      <div
        v-for="item in items"
        :key="item.id"
        class="todo_item"
        :data-id="item.id"
        @mousedown="onMouseDown($event, item.id)"
      >
        <div class="todo_item-header non-selectable">
          <span>
            {{ item.date }}
          </span>
          <b-button icon text color="white" @click="remove(item)">
            <b-icon>close</b-icon>
          </b-button>
        </div>
        <div class="todo_item-content non-selectable" v-html="getText(item.text)"></div>
      </div>
    </template>
  </div>
</template>
<script src="./page.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
