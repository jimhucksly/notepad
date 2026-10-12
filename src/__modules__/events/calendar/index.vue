<template>
  <div class="b-calendar-card">
    <div class="b-calendar-wrap" :class="{ 'b-calendar-range': op.range }">
      <!-- instances -->
      <calendar-instance
        v-for="(el, index) in op.range ? [1, 2] : [1]"
        :key="el"
        :index="el"
        :range="range"
        :active="active"
        :options="getOptions(index)"
        @day-selected="daySelected"
        @next-month="nextMonth"
        @prev-month="prevMonth"
        @active-date="setActiveDate"
        @set-month="setMonth(el, $event)"
        @set-year="setYear"
        @set-today="setToday"
        @set-header="$emit('set-header', $event)"
      />
    </div>
  </div>
</template>
<script src="./index.ts"></script>
