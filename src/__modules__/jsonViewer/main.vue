<template>
  <div class="json_viewer json_viewer_cont">
    <div class="json_viewer_src">
      <editor
        :value="content"
        lang="javascript"
        theme="twilight"
        width="100%"
        height="100%"
        @init="editorInit($event)"
        @input="$emit('input', $event)"
      />
      <div class="json_viewer_separator items-center" @mousedown="drag($event)">
        <div>
          <div style="width: 100%; height: 3px" class="items-center" v-for="i in [1, 2, 3, 4, 5, 6, 7, 8]" :key="i">
            <i style="width: 1px; height: 2px; background-color: var(--white)"></i>
            <i style="width: 1px; height: 2px;"></i>
            <i style="width: 1px; height: 2px; background-color: var(--white)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="json_viewer_res"></div>
    <div class="json_viewer_notice"></div>
  </div>
</template>
<script src="./main.ts" lang="ts"></script>
<style lang="scss" scoped>
.json_viewer {
  position: relative;
  display: flex;
  width: 100%;

  .json_viewer_notice {
    display: none;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 300px;
    height: 25px;
    color: #fff;
    background-color: rgba(var(----editor_green), 0.6);
    border-radius: 5px;
  }

  .json_viewer_src,
  .json_viewer_res {
    position: relative;
    flex-basis: 50%;
  }

  .json_viewer_separator {
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 100%;
    background-color: var(--dark_darken-2);
    border-left: 1px solid var(--blue-gray);
    border-right: 1px solid var(--blue-gray);
    z-index: 999;
    cursor: e-resize;
  }

  .json_viewer_res {
    padding: 6px;
    background-color: var(--editor_dark);
    max-height: 100%;
    overflow: auto;
  }
}
:deep() {
  .json-formatter-constructor-name {
    color: #fff;
  }

  .json-formatter-row.json-formatter-open {
    & > .json-formatter-toggler-link {
      .json-formatter-toggler {
        opacity: 1;
        &:after {
          display: none;
        }
        &:before {
          content: '' !important;
          position: absolute;
          top: 4px;
          left: 1px;
          width: 7px;
          height: 1px;
          background-color: var(--editor_blue);
        }
      }
    }
  }

  .json-formatter-toggler-link {
    display: flex;
    align-items: center;
  }

  .json-formatter-toggler {
    position: relative;
    width: 11px;
    height: 11px;
    margin-right: 8px;
    border: 1px solid var(--editor_blue);

    &:after {
      content: '' !important;
      position: absolute;
      top: 1px;
      left: 4px;
      width: 1px;
      height: 7px;
      background-color: var(--editor_blue);
      opacity: 0.8;
    }
    &:before {
      content: '' !important;
      position: absolute;
      top: 4px;
      left: 1px;
      width: 7px;
      height: 1px;
      background-color: var(--editor_blue);
      opacity: 0.8;
    }
  }

  .json-formatter-row {
    padding: 1px 0;
    font-size: 1.1rem;

    .json-formatter-children {
      padding-left: 10px;
    }

    .json-formatter-key {
      color: var(--editor_yellow);
    }

    .json-formatter-bracket {
      color:var(--white);
    }

    .json-formatter-number {
      color: var(--editor_blue);
    }

    .json-formatter-null,
    .json-formatter-boolean {
      color: var(--editor_red);
    }

    .json-formatter-string {
      color: var(--editor_green);
    }

    .json-formatter-empty {
      color: var(--blue-gray_light);
    }
  }
}

</style>
