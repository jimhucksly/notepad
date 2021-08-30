<template>
  <div
    class="projects_editor"
    :class="{
      expanded: expanded
    }"
  >
    <div class="projects_editor_title">Projects: Item properties</div>
    <div class="projects_editor_inner">
      <div class="form-group">
        <div class="form-group-inner">
          <label class="-m-t-10">Name</label>
          <div>
            <form>
              <input type="text" v-model="name" @keydown.enter.prevent="save">
            </form>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-inner flex-between items-center">
          <label class="m-b-5">Protected</label>
          <b-checkbox :value="isLock" @input="toggleLock" />
        </div>
      </div>
      <div class="form-group" v-if="!isFile">
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
      <button
        class="btn btn-transparency m-r-15"
        @click="hide"
      >
        Cancel
      </button>
      <b-btn
        primary
        label="Save"
        @click="save"
        :processing="savingProcess"
      />
    </div>
  </div>
</template>
<script src="./projectsEditor.ts" lang="ts"></script>
