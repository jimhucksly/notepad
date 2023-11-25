<template>
  <div id="events_cont" class="events">
    <div class="events__top">
      <div class="events__btns">
        <button class="btn btn-primary events__btn-left" ref="button-prev" @click="prev">
          <span></span>
        </button>
        <div class="events__header" ref="header">{{ headerText }}</div>
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
  </div>
</template>
<script src="./main.ts" lang="ts"></script>
<style lang="scss" scoped>
.events {
  display: flex;
  flex-direction: column;
  background-color: var(--grey);

  .events__top {
    display: flex;
    flex-basis: 53px;
    flex-shrink: 0;
    padding: 0 10px;
  }
  .events__btns {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    button {
      position: relative;

      span {
        display: flex;
        position: absolute;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        &:after {
          content: '';
          display: block;
          width: 6px;
          height: 8px;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }
      }
    }

    .events__btn-left {
      width: 30px;
      height: 30px;
      span {
        &:after {
          border-right: 6px solid #fff;
        }
      }
    }
    .events__btn-right {
      width: 30px;
      height: 30px;
      span {
        &:after {
          border-left: 6px solid #fff;
        }
      }
    }
  }
  .events__header {
    padding: 0 15px;
    font-weight: 700;
    font-size: 0.9rem;
    width: 120px;
    text-align: center;
    white-space: nowrap;
  }
  .events__search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 2;

    form {
      position: relative;
      width: 100%;
      max-width: 300px;
    }

    svg {
      position: absolute;
      top: 5px;
      left: 0;
    }

    input {
      width: 100%;
      padding-left: 30px;
    }

    .events__search-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: -1px;
      border: 1px solid var(--blue-gray);
      background-color: #fff;
      z-index: 999;

      ul {
        li {
          cursor: pointer;
          font-size: 0.9rem;
          padding: 8px 4px;
          border-bottom: 1px solid var(--blue-gray);

          &:last-child {
            border-bottom-color: transparent;
          }

          &:hover {
            background-color: var(--blue-gray_light);
          }

          &.not-clickable {
            cursor: default;
            &:hover {
              background-color: #fff;
            }
          }
        }
      }
    }
  }
  .events__calendar {
    position: relative;
    flex-basis: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
