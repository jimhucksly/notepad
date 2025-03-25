<template>
  <div class="todo_cont">
    <div v-if="isEmpty" class="empty_cont">
      No elements found
    </div>
    <template v-if="items">
      <div
        v-for="item in items"
        :key="item.id"
        class="todo_item"
        :data-id="item.id"
        @mousedown="onMouseDown($event, item.id)"
      >
        <div class="todo_item-header non-selectable">
          {{ item.date }}
        </div>
        <div class="todo_item-content non-selectable" v-html="getText(item.text)"></div>
      </div>
    </template>
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
<script src="./page.ts" lang="ts"></script>
<style lang="scss" scoped>
.todo_cont {
  padding: 3px;
  flex-basis: 100%;
  flex-grow: 1;
  background-color: var(--grey);
  overflow-x: hidden;
  overflow-y: auto;

  &.todo_cont--drag {
    .todo_item {
      user-select: none;
      -ms-user-select: none;
      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
    }
  }

  &:before {
    content: '';
    display: table;
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }

  .todo_item {
    width: 30%;
    margin: 3px;
    float: left;
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0px 0px 25px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .todo_item-header {
    background-color: var(--blue_light);
    color: #fff;
    padding: 6px;
    font-size: 0.8rem;
    text-align: right;
  }

  .todo_item-content {
    padding: 6px;
    height: 98px;
    font-size: 0.9rem;
    line-height: 1.1rem;
  }

  .todo_popup_overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 99;
  }

  .todo_popup {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 36px;
    left: 36px;
    bottom: 36px;
    right: 36px;
    background: #fff;
    box-shadow: 0px 0px 25px 2px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
    z-index: 101;

    .todo_popup-header {
      background-color: var(--blue_light);
      color: #fff;
      padding: 12px;
      text-align: right;
      flex-shrink: 0;
    }

    .todo_popup-content {
      padding: 12px 12px 0 12px;
      flex-basis: 100%;

      textarea {
        height: 100%;
      }
    }

    .todo_popup-footer {
      display: flex;
      justify-content: space-between;
      flex-shrink: 0;
      padding: 12px;
    }
  }
}
</style>

