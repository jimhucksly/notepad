<template>
  <div class="links_cont">
    <div v-if="isEmpty" class="empty_cont">
      No elements found
    </div>
    <div class="links_area" v-if="links">
      <ul>
        <li v-for="(item, index) in links" :key="index">
          <a href="/" @click.prevent="open(item.url)">{{ getName(item, index) }}</a>
          <button @click="edit(item.id)">
            <svg-icon icon="linkIcon" width="16px" height="16px" />
          </button>
          <button @click="remove(item.id)">
            <svg-icon icon="removeIcon" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./links.ts" lang="ts"></script>
