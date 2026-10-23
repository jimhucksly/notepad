<template>
  <v-card>
    <v-card-title>
      <v-container class="pa-0 w-100">
        <v-row no-gutters>
          <v-col class="items-center">
            <template v-if="selected">
              <div class="d-flex flex-column">
                <span class="text-body grey--text font-medium">{{ selected.name }}</span>
                <span class="text-body grey--text">{{ $dateFormat(selected.createDateTime) }} | {{ selected.size }}</span>
              </div>
            </template>
          </v-col>
          <v-col cols="auto" class="flex-end items-center gap-2">
            <div style="width: 380px;">
              <b-combobox
                :items="items"
                v-model="filter"
                placeholder="Filter"
                chips
                hide-details
              >
                <template #tag-overflow="{ limit, count }">
                  <b-chip :closable="false">
                    + {{ count - limit }}
                  </b-chip>
                </template>
              </b-combobox>
            </div>
            <b-button v-if="selected" variant="outlined" @click="download">
              <b-icon>download</b-icon>
              Download
            </b-button>
            <b-button v-if="selected" variant="outlined" color="error" @click="remove">
              <b-icon>delete</b-icon>
              Delete
            </b-button>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text id="drop-area">
      <file
        v-for="(item, i) in filtered"
        :key="item.id"
        :item="item"
        :index="i"
        :selected="item.id === selectedId"
        :rows="rows"
        @on-select="onSelect"
        @set-position="onUpdateRow"
      />
      <div v-if="!loading && filtered.length === 0" class="pa-3 flex-center font-medium text-body-s">
        No data to display
      </div>
    </v-card-text>
  </v-card>
</template>
<script src="./files.ts" lang="ts"></script>
<style src="./files.scss" lang="scss" scoped></style>
