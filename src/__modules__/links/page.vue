<template>
  <v-container class="links">
    <v-row v-if="isEmpty">
      <v-col class="empty_cont">
        No elements found
      </v-col>
    </v-row>
    <v-row v-if="links">
      <v-col class="h-100 overflow-hidden">
        <v-list class="h-100 overflow-y-auto" variant="plain">
          <v-list-item v-for="(item, index) in links" :key="index" @click.prevent="open(item.url)">
            <div class="links__list-item">
              <div class="d-flex align-center basis-100 gap-1">
                <span class="font-weight-bold text-body-s" style="color: var(--primary-d-4)">{{ index + 1 }}.</span>
                <span class="text-body-m">{{ item.name }}</span>
              </div>
              <div class="d-flex align-center justify-end gap-2">
                <b-button variant="text" icon color="primary" @click.stop="edit(item.id)">
                  <b-icon>link</b-icon>
                </b-button>
                <b-button variant="text" icon color="error" @click.stop="remove(item.id)">
                  <b-icon>delete</b-icon>
                </b-button>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./page.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
