<template>
  <v-card class="h-100 d-flex flex-column overflow-hidden">
    <v-card-title class="d-flex align-center">
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="6" class="d-flex align-center gap-2">
            <b-button icon variant="outlined" @click="prev">
              <b-icon>chevron-left</b-icon>
            </b-button>
            <div ref="header" class="d-flex align-center">
              <span class="text-body-s font-weight-bold">{{ headerText }}</span>
            </div>
            <b-button icon variant="outlined" @click="next">
              <b-icon>chevron-right</b-icon>
            </b-button>
            <b-button color="grey" variant="outlined" @click="today">
              Today
            </b-button>
          </v-col>
          <v-col cols="6" class="d-flex align-center">
            <b-combobox v-model="selected" chips :fetch-data="fetchData" item-title="title" item-value="key" hide-details>
              <template #prepend-inner>
                <b-icon>search</b-icon>
              </template>
            </b-combobox>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text class="flex-basis-100 overflow-x-auto scroll-s">
      <div class="events__calendar">
        <b-calendar
          ref="calendar"
          :options="bCalendarOptions"
          @set-header="setHeader($event)"
          @save="save"
          @remove="remove"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
<script src="./main.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
