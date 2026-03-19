<template>
  <ul v-if="tree && tree.length" :style="level > 1 ? 'display: none;' : undefined">
    <template v-for="(item, index) in tree">
      <li v-if="item.name.trim() && item.slug.trim()" :key="index" :class="`level-${level}`">
        <span
          :title="item.name"
          :data-ref="item.id"
          :class="{
            tree_item_plus: item.children && item.children.length,
            'tree_item_minus tree_item_empty': (!item.children || !item.children.length) && level === 1,
            tree_item_node: (!item.children || !item.children.length) && level > 1,
            'tree_item_node--last': Number(index) === tree.length - 1,
          }"
          @click="selectNode(item)"
        >
          {{ item.name }}
        </span>
        <template v-if="item.children && item.children.length">
          <tree :tree="item.children" :level="level + 1" />
        </template>
      </li>
    </template>
  </ul>
  <div v-else></div>
</template>
<script src="./index.ts" lang="ts"></script>
<style lang="scss" scoped>
ul {
  li {
    display: flex;
    flex-direction: column;

    span {
      position: relative;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 6px 15px 6px 35px;
      cursor: pointer;
      color: var(--blue-gray);

      &:hover {
        background-color: var(--dark_darken-1);
        color: var(--blue-gray_light);
        &.tree_item_plus,
        &.tree_item_minus:not(.tree_item_empty) {
          &:before {
            opacity: 0.9;
          }
        }
      }

      &.tree_item_plus {
        &:before {
          content: '+';
          position: absolute;
          top: 7px;
          left: 15px;
          display: flex;
          justify-content: center;
          width: 12px;
          height: 12px;
          color: var(--yellow_light);
          border: 1px solid var(--yellow_light);
          line-height: 8px;
          opacity: 0.7;
        }
      }
      &.tree_item_minus {
        &:before {
          position: absolute;
          top: 7px;
          left: 15px;
          content: '-';
          display: flex;
          justify-content: center;
          width: 12px;
          height: 12px;
          font-weight: 700;
          line-height: 8px;
          opacity: 0.7;
        }
        &:not(.tree_item_node):not(.tree_item_empty) {
          &:before {
            color: var(--yellow_light);
            border: 1px solid var(--yellow_light);
          }
        }
        &:not(.tree_item_node).tree_item_empty {
          &:before {
            color: var(--red_light);
            border: 1px solid var(--red_light);
            opacity: 0.4;
          }
        }
      }
      &.tree_item_node {
        &:before {
          content: '';
          position: absolute;
          top: 12px;
          display: block;
          height: 1px;
          width: 21px;
          background-color: var(--green_light);
          opacity: 0.7;
        }
      }
    }

    &.level-1 {
      font-size: 14px;
    }
    &.level-2 {
      font-size: 13px;
      ul {
        position: relative;
        &:before {
          content: '';
          position: absolute;
          top: 0px;
          left: 21px;
          display: block;
          width: 1px;
          height: 100%;
          background-color: var(--green_light);
          z-index: 10;
          opacity: 0.5;
        }
      }
      span {
        padding-left: 46px;
        &.tree_item_plus,
        &.tree_item_minus {
          &:before {
            left: 25px;
          }
        }
        &.tree_item_node {
          &:before {
            left: 22px;
          }
        }

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 21px;
          display: block;
          width: 1px;
          height: 100%;
          background-color: var(--green_light);
          opacity: 0.5;
        }

        &.tree_item_node--last {
          &:after {
            height: 50%;
          }
          & + ul {
            &:before {
              top: -12px;
            }
          }
        }
      }
    }
    &.level-3 {
      font-size: 12px;
      span {
        padding-left: 60px;
        &.tree_item_plus,
        &.tree_item_minus {
          &:before {
            left: 22px;
          }
        }
        &.tree_item_node {
          &:before {
            left: 32px;
          }
        }

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 31px;
          display: block;
          width: 6px;
          height: 100%;
          border-left: 1px solid var(--green_light);
          background-color: transparent;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
