<template>
  <div
    class="projects_editor"
    :class="{
      expanded: expanded,
    }"
  >
    <div class="projects_editor_title">Projects: Item properties</div>
    <div class="projects_editor_inner">
      <div class="form-group">
        <div class="form-group-inner">
          <label class="-m-t-10">Name</label>
          <div>
            <form>
              <input v-model="name" type="text" @keydown.enter.prevent="save" />
            </form>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-inner flex-between items-center">
          <label class="m-b-5">Protected</label>
          <b-checkbox v-model="isLock" @change="toggleLock" />
        </div>
      </div>
      <div class="form-group">
        <a href="" @click.prevent="archive">
          <i class="icon">
            <svg-icon icon="archiveIcon" />
          </i>
          <span>Archive</span>
        </a>
      </div>
      <div class="form-group">
        <a href="" class="--remove" @click.prevent="remove">
          <i class="icon">
            <svg-icon icon="removeIconSm" />
          </i>
          <span>Remove</span>
        </a>
      </div>
    </div>
    <div class="projects_editor_footer">
      <button class="btn btn-transparency m-r-15" @click="emitHide">Cancel</button>
      <b-btn primary label="Save" :processing="savingProcess" @click="save" />
    </div>
  </div>
</template>
<script src="./properties.ts" lang="ts"></script>
<style lang="scss" scoped>
.projects_editor {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 15px;
  background-color: var(--dark_darken-2);
  z-index: 8;
  transition: 0.3s;

  &.expanded {
    transform: translateX(100%);
  }

  .projects_editor_inner {
    flex-basis: 100%;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 15px;

    a {
      display: flex;
      text-decoration: none;
      color: #fff;
      font-size: 13px;

      &.--remove {
        color: var(--editor_red);

        span {
          border-color: var(--editor_red);
        }
      }

      span {
        display: block;
        border-bottom: 1px dashed #fff;
      }
    }

    .icon {
      display: block;
      width: 15px;
      height: 15px;
      margin-right: 6px;
    }
  }

  .form-group {
    .form-group-inner {
      label {
        color: #fff;
      }
    }
  }

  form {
    input[type='text'] {
      height: 20px;
      font-size: 13px;
    }
  }

  .projects_editor_footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-basis: 54px;
    flex-shrink: 0;
    padding-right: 15px;
  }
}
.projects_editor_title {
  display: flex;
  align-items: center;
  flex-basis: 54px;
  flex-shrink: 0;
}
</style>
