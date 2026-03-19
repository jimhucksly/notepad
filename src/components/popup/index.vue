<template>
  <div v-show="showPopup" class="popup">
    <div class="popup-window" :style="`width: ${width}; height: ${height}`">
      <div class="popup-title-bar">
        <span>{{ title }}</span>
        <div class="popup-close-btn" @click="close"></div>
      </div>
      <div class="popup-inner">
        <component
          :is="component"
          v-if="component"
          v-bind="props"
          @set-result="onSetResult"
          @cancel="close"
          @popup-component-created="instance = $event"
        />
        <div v-else-if="isConfirmWindowDialog">
          {{ props.question }}
        </div>
      </div>
      <div v-if="isConfirmWindowDialog" class="popup-actions flex-center">
        <button class="btn btn-primary" @click.prevent="onSetResult(true)">Yes</button>
        <button class="btn btn-default" @click.prevent="onSetResult(false)">No</button>
      </div>
      <div v-if="isCreateEditDialog" class="popup-actions flex-end">
        <button class="btn btn-primary" @click.prevent="save">Save</button>
      </div>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
