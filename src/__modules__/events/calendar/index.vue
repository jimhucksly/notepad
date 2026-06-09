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
      <template v-if="formShow">
        <!-- form overlay -->
        <div class="b-calendar-form-overlay" @click="formClear"></div>
        <!-- form -->
        <div class="b-calendar-form">
          <div class="b-calendar-form-close" @click.prevent="formClear"></div>
          <form>
            <input v-model="event[op.modelType.title]" type="text" placeholder="Title" />
            <input v-model="event[op.modelType.date]" type="text" :readonly="true" />
            <textarea v-model="event[op.modelType.content]" placeholder="Text"></textarea>
            <div class="flex-between shrink-0">
              <button
                class="btn btn-danger m-r-15"
                :disabled="!hasEvent(event[op.modelType.date])"
                @click.prevent="formRemove"
              >
                Remove
              </button>
              <button class="btn btn-primary" @click.prevent="formSave">Save</button>
            </div>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
