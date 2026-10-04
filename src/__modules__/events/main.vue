<template>
  <v-card class="h-100 d-flex flex-column overflow-hidden">
    <v-card-title class="d-flex align-center">
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="6" class="d-flex gap-2">
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
          <v-col cols="6">
            <b-edit-text v-model="search" :readonly="bCalendarFormShow" hide-details>
              <template #prepend-inner>
                <b-icon>search</b-icon>
              </template>
            </b-edit-text>
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
          @form-toggle="bCalendarFormShow = $event"
        />
      </div>
    </v-card-text>
  </v-card>
  <!-- <div id="events_cont" class="events">
    <div class="events__top">
      <div class="events__btns">

      </div>
      <div class="events__search">
        <form ref="search-form">

          <div v-if="itemsFiltered.length" ref="search-results" class="events__search-dropdown">
            <ul>
              <li
                v-for="item in itemsFiltered"
                :key="item.key"
                :data-current="item.key"
                :class="{ 'not-clickable': item.key === '0' }"
                @click="itemSelected(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>

  </div> -->
</template>
<script src="./main.ts" lang="ts"></script>
<style src="./main.scss" lang="scss" scoped></style>
