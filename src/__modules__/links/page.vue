<template>
  <v-container class="links_cont">
    <v-row v-if="isEmpty">
      <v-col class="empty_cont">
        No elements found
      </v-col>
    </v-row>
    <v-row v-if="links">
      <v-col class="h-100 overflow-hidden">
        <v-list class="h-100 overflow-y-auto">
          <v-list-item v-for="(item, index) in links" :key="index" @click.prevent="open(item.url)">
            <span class="text-body-s">{{ getName(item, index) }}</span>
            <button @click="edit(item.id)">
              <svg-icon icon="linkIcon" width="16px" height="16px" />
            </button>
            <button @click="remove(item.id)">
              <svg-icon icon="removeIcon" />
            </button>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./page.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
