<template>
  <div class="popup" v-show="showPopup">
    <div class="popup-window" :style="`width: ${width}`">
      <div class="popup-title-bar">
        <span>{{ title }}</span>
        <div class="popup-close-btn" @click="close"></div>
      </div>
      <div class="popup-inner">
        <component
          v-if="component"
          :is="component"
          v-bind="props"
          @set-result="onSetResult"
        />
      </div>
    </div>
  </div>
</template>
<script src="./popup.ts" lang="ts"></script>
