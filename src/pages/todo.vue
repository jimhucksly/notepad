<template>
  <div class="todo_cont">
    <div
      v-for="item in items"
      :key="item.id"
      class="todo_item"
      :data-id="item.id"
      @mousedown="onMouseDown($event, item.id)"
    >
      <div class="todo_item-header">
        {{ item.date }}
      </div>
      <div class="todo_item-content" v-html="getText(item.text)"></div>
    </div>
    <template v-if="isPopupShow">
      <div class="todo_popup_overlay" ref="overlay"></div>
      <div class="todo_popup" ref="popup">
        <div class="todo_popup-header">{{ itemSelected.date }}</div>
        <div class="todo_popup-content">
          <textarea v-model="itemSelected.text" placeholder="New record" ref="textarea"></textarea>
        </div>
        <div class="todo_popup-footer">
          <button class="btn btn-danger" @click="remove" ref="btn-remove">Remove</button>
          <div>
            <button class="btn btn-primary" @click="save" ref="btn-save">Save</button>
            <button class="btn btn-default m-l-15" @click="cancel" ref="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script src="./todo.ts" lang="ts"></script>
