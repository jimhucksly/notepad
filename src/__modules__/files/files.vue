<template>
  <v-card>
    <v-card-title>
      <v-container class="pa-0 w-100">
        <v-row>
          <v-col class="items-center">
            <template v-if="selected">
              <div class="d-flex flex-column">
                <span class="text-body grey--text font-medium">{{ selected.name }}</span>
                <span class="text-body grey--text">{{ $dateFormat(selected.createDateTime) }} | {{ selected.size }}</span>
              </div>
            </template>
          </v-col>
          <v-col cols="auto" class="flex-end">
            <b-button v-if="selected" variant="outlined">
              <b-icon>download</b-icon>
              Download
            </b-button>
          </v-col>
        </v-row>
      </v-container>
      <div></div>
      <div class="d-flex justify-end w-100">

      </div>
    </v-card-title>
    <v-card-text id="drop-area">
      <file
        v-for="(item, i) in files"
        :key="item.id"
        :item="item"
        :index="i"
        :selected="item.id === selectedId"
        :rows="rows"
        @on-select="onSelect"
        @set-position="onUpdateRow"
      />
    </v-card-text>
  </v-card>
  <!-- <div id="upload-download-popup" v-if="uploading">
    <div class="label">
      <span>Uploading file...</span>
      <span class="percentage" ref="text"></span>
    </div>
    <div class="progress" ref="progress"></div>
  </div> -->
</template>
<script src="./files.ts" lang="ts"></script>
<style src="./files.scss" lang="scss" scoped></style>
