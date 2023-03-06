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
        <div v-if="isConfirmWindowDialog">
          {{ props.question }}
        </div>
      </div>
      <div class="popup-actions flex-center">
        <button class="btn btn-primary" @click.prevent="onSetResult(true)">Yes</button>
        <button class="btn btn-default" @click.prevent="onSetResult(false)">No</button>
      </div>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
