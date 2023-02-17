<template>
  <div id="drop-area">
    <file v-for="(item, i) in files" :item="item" :index="i" :key="item.id" />
  </div>
</template>
<script src="./files.ts" lang="ts"></script>
