<template>
  <div id="drop-area">
    <file
      v-for="(item, i) in files"
      :key="item.id"
      :item="item"
      :index="i"
      :selected="item.id === selected"
      @on-select="onSelect"
    />
  </div>
</template>
<script src="./files.ts" lang="ts"></script>
