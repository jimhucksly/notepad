<template>
  <div
    class="toasted-wrapper"
    :style="{
      'height': toasts.length ? 'auto': '0px'
    }"
  >
    <div
      v-for="item in toasts"
      :key="item.id"
      class="toasted-item"
      :class="{
        'toasted-item--success': isSuccessType(item),
        'toasted-item--error': isErrorType(item)
      }"
    >
      <span>{{ item.subject }}</span>
      <button class="toasted-close" @click="remove(item.id)"></button>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>

