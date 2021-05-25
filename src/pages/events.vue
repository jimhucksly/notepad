<template>
  <div id="events_cont" class="events">
    <div class="events__top">
      <div class="events__btns">
        <button class="btn btn-primary events__btn-left" ref="button-prev" @click="prev">
          <span></span>
        </button>
        <div class="events__header" ref="header">{{ header }}</div>
        <button class="btn btn-primary events__btn-right" ref="button-next" @click="next">
          <span></span>
        </button>
        <button class="btn btn-primary m-l-15" ref="button-today" @click="today">Today</button>
      </div>
      <div class="events__search">
        <form ref="search-form">
          <div class="items-center blue--text">
            <svg-icon icon="searchIcon" width="28" height="20" />
            <input
              type="text"
              v-model="search"
              :readonly="bCalendarFormShow"
            >
          </div>
          <div class="events__search-dropdown" ref="search-results" v-if="itemsFiltered.length">
            <ul>
              <li
                v-for="item in itemsFiltered"
                :key="item.key"
                :data-current="item.key"
                :class="{ 'not-clickable': item.key === 0 }"
                @click="itemSelected(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
    <div class="events__calendar">
      <b-calendar
        ref="calendar"
        :options="bCalendarOptions"
        @set-header="setHeader"
        @save="save"
        @remove="remove"
        @form-toggle="(v) => { bCalendarFormShow = v }"
      />
    </div>
  </div>
</template>
<script src="./events.ts" lang="ts"></script>
