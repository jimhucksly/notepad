<template>
  <div class="file" :class="{ selected }" @click="onSelect">
    <div class="file_icon">
      <i class="icon">
        <img :src="`assets/images/file_types_icons/${type}.svg`">
      </i>
    </div>
    <div class="file_name">
      {{ item.name }}
    </div>
  </div>
</template>
<script src="./file.ts" lang="ts"></script>
