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
<script src="./item.ts" lang="ts"></script>
<style lang="scss" scoped>
.notepad_item {
  position: relative;
  padding: 10px;
  font-size: 14px;
  line-height: 15px;
  background-color: #fff;
  margin-bottom: 7px;
  box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.1);
  border: 1px solid transparent;

  &.unread {
    background-color: var(--blue_light-2);
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  &:hover {
    .notepad_item_btns {
      display: flex;
    }
  }
}

.notepad_item_date {
  font-size: 11px;
  margin-bottom: 5px;
}

.notepad_item_content {
  font-family: var(--font-menlo);
  font-size: 11px;
  color: var(--dark);
  word-wrap: break-word;
  line-height: 19px;
}

.notepad_item_btns {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;

  button {
    display: block;
    width: 45px;
    height: 30px;
    border: none;
    background: var(--blue-gray_light);
    opacity: 0.3;
    border: 1px solid var(--blue-gray);

    svg {
      max-width: 65%;
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
