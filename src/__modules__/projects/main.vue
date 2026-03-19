<template>
  <div class="g-column">
    <div ref="notepad_cont" class="notepad_cont">
      <template v-for="(item, stamp) in json">
        <item
          v-if="!hasFilter || `${stamp}` in filter"
          :key="stamp"
          ref="notepad_item"
          :item="json[stamp]"
          :is-last="stamp === lastStamp"
          @on-remove="onRemove"
          @on-last-rendered="isRendered = true"
        />
      </template>
    </div>
    <div ref="notepad_textarea" class="notepad_textarea">
      <textarea v-model="message" placeholder="New record" @keydown.enter.ctrl="send"></textarea>
      <div class="notepad_btns">
        <button @click.prevent="send">
          <div>
            <svg-icon icon="icon-send" width="29px" height="23px" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
<script src="./main.ts" lang="ts"></script>
<style lang="scss" scoped>
.notepad_cont {
  flex-basis: 100%;
  flex-grow: 1;
  padding-left: 6px;
  background-color: var(--grey);
  border-bottom: 1px solid var(--blue-gray_light);
  overflow-x: hidden;
  overflow-y: auto;
}

.notepad_textarea {
  display: flex;
  position: relative;
  flex-basis: 40%;
  flex-grow: 0;
  padding: 6px;
  background-color: var(--grey);

  textarea {
    flex-basis: 100%;
    flex-grow: 1;
  }

  .notepad_btns {
    display: flex;
    flex-direction: column;
    width: 45px;
    flex-grow: 2;
    flex-shrink: 0;
  }

  button {
    width: 45px;
    height: 100%;
    background-color: var(--blue-gray_light);
    opacity: 0.3;

    &:hover {
      opacity: 1;
    }

    div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .notepad_attachments {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 50%;
    opacity: 0.3;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
