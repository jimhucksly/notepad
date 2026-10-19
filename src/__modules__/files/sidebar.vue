<template>
  <v-container class="pa-4">
    <v-row>
      <v-col>
        <b-button @click="add">
          <b-icon>plus</b-icon>
        </b-button>
      </v-col>
    </v-row>
  </v-container>
  <!-- <div class="files g-column">

    <template v-if="fileSelected">
      <div class="file-info">
        <small class="file-info_label">File name:</small>
        <span class="file-info_name">{{ fileSelected.name }}</span>
      </div>
      <div class="file-info">
        <small class="file-info_label">File created:</small>
        <span class="file-info_name">{{ $dateFormat(fileSelected.createDateTime) }}</span>
      </div>
      <div class="file-info">
        <small class="file-info_label">File size:</small>
        <span class="file-info_name">{{ fileSelected.size }}</span>
      </div>
    </template> -->
  <!-- </div> -->
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style src="./sidebar.scss" lang="scss" scoped></style>
