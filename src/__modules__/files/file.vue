<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col class="pa-2">
        <v-row no-gutters>
           <v-col cols="auto" style="min-width: 45px; max-width: 45px;">
            <img :src="`assets/images/file_types_icons/${type}.svg`" />
          </v-col>
          <v-col>
            <div class="file_name">
              {{ item.name }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <!-- <div
    class="file"
    :class="{
      selected,
      checking,
      checked,
    }"
    @click="onSelect"
  >
    <div class="file_icon">
      <i class="icon">
        <img :src="`assets/images/file_types_icons/${type}.svg`" />
      </i>
    </div>

    <div class="file_check">
      <label>
        <input v-model="isChecked" type="checkbox" />
        <span>
          <b-icon>check</b-icon>
          <svg-icon icon="checkIcon" width="14" height="10" style="color: var(--editor_green_darken-10)" />
        </span>
      </label>
    </div>
  </div> -->
</template>
<script src="./file.ts" lang="ts"></script>
<style src="./file.scss" lang="scss" scoped></style>
