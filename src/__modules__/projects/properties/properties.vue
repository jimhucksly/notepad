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
          <b-edit-text v-model="name" label="Name" label-on-top @enter="save" />
        </div>
      </div>
      <div class="form-group">
        <b-switch v-model="isLock" @change="toggleLock" label="Protected" reverse></b-switch>
      </div>
      <div class="form-group">
        <b-button text variant="flat" color="white" @click.prevent="archive">
          <b-icon>archive-outline</b-icon>
          <span>Archive</span>
        </b-button>
      </div>
      <div class="form-group">
        <b-button text variant="flat" color="white" @click.prevent="remove">
          <b-icon>delete-outline</b-icon>
          <span>Remove</span>
        </b-button>
      </div>
    </div>
    <div class="projects_editor_footer">
      <b-button :loading="savingProcess" @click="save">Save</b-button>
      <b-button variant="tonal" @click="emitHide">Cancel</b-button>
    </div>
  </div>
</template>
<script src="./properties.ts" lang="ts"></script>
<style lang="scss" scoped src="./properties.scss"></style>
