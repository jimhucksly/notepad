<template>
  <div class="b-calendar" :class="{ 'b-calendar--events': op.eventsMode }">
    <!-- nav -->
    <div class="b-calendar__nav" v-if="!op.eventsMode">
      <button class="b-calendar__back" @click="btnPrevHandler"></button>
      <div class="b-calendar__header">{{ header }}</div>
      <button class="b-calendar__forward" @click="btnNextHandler"></button>
    </div>
    <!-- body -->
    <div class="b-calendar__body" ref="bofy">
      <!-- head -->
      <div class="b-calendar__head" v-if="isDaySelection">
        <div v-for="i in [0, 1, 2, 3, 4, 5, 6]" :key="i">
          {{ op.daysShort[i] }}
        </div>
      </div>
      <!-- weeks -->
      <div
        v-for="(el, i) in weeks"
        :key="i"
        class="b-calendar__week"
        :class="{
          'b-calendar__first-week': Number(i) === 0
        }"
      >
        <!-- days -->
        <div
          v-for="(d, j) in el.days"
          :key="d.date"
          :data-current="d.date"
          :disabled="d.isDisabled"
          :class="{
            'b-calendar__prev-month': d.isPrevMonth,
            'b-calendar__next-month': d.isNextMonth,
            'b-calendar__holiday': d.isHoliday,
            'b-calendar__today': d.isToday,
            'b-calendar__range-start': op.range && d.date === range[0],
            'b-calendar__range-end': op.range && d.date === range[1],
            'b-calendar__in-range': inRange(d.date),
            'b-calendar__range-hover': inRangeHover(d.date)
          }"
          @click="d.isDisabled ? null : daySelection(d.date)"
          @mouseover="$emit('active-date', d.date)"
        >
          <template v-if="op.eventsMode">
            <span>{{ `${Number(i) === 0 ? op.weekDays[j] + ', ' : ''}${d.num}` }}</span>
            <div>
              <template v-if="op.items">
                <strong>{{ getTitle(d.date) }} </strong>
                <p>{{ getContent(d.date) }} </p>
              </template>
            </div>
            <svg-icon icon="loader" width="30px" height="30px" />
          </template>
          <template v-else>
            <span>{{ d.num }}</span>
          </template>
        </div>
      </div>
      <!-- month -->
      <template v-if="isMonthSelection">
        <div
          v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]"
          :key="i"
          class="b-calendar__month"
          :class="{
            'b-calendar__today': i === baseMonth && currentDate.getFullYear() === baseYear
          }"
          @click="monthSelection(i)"
        >
          {{ op.month[i] }}
        </div>
      </template>
      <!-- year -->
      <template v-if="isYearSelection">
        <div
          v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8]"
          :key="i"
          class="b-calendar__year"
          :class="{
            'b-calendar__today': (currentDate.getFullYear() - 4 + i) === baseYear
          }"
          @click="yearSelection(currentDate.getFullYear() - 4 + i)"
        >
          {{ currentDate.getFullYear() - 4 + i }}
        </div>
      </template>
    </div>
    <!-- footer -->
    <div class="b-calendar__footer" v-if="!op.eventsMode">
      <button class="b-calendar__month-btn" @click="btnMonthHandler">Month</button>
      <button class="b-calendar__today-btn" @click="btnTodayHandler">Today</button>
      <button class="b-calendar__year-btn" @click="btnYearHandler">Year</button>
    </div>
  </div>
</template>
<script src="./instance.ts" lang="ts"></script>
