<template>
  <div
    class="projects_editor"
    :class="{
      expanded: expanded,
    }"
  >
    <div class="projects_editor_title">Projects: Item properties</div>
    <v-container class="pa-0 projects_editor_inner">
      <v-row no-gutters>
        <v-col class="pr-4">
          <b-edit-text v-model="name" label="Name" label-on-top required @enter="save" />
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-3">
        <v-col class="pr-4">
          <b-switch v-model="isLock" @change="toggleLock" label="Protected" reverse></b-switch>
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-3">
        <v-col class="pr-4">
          <b-button @click.prevent="archive">
            <b-icon>archive-outline</b-icon>
            <span>Archive</span>
          </b-button>
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-3">
        <v-col class="pr-4">
          <b-button @click.prevent="remove">
            <b-icon>delete-outline</b-icon>
            <span>Remove</span>
          </b-button>
        </v-col>
      </v-row>
    </v-container>
    <div class="projects_editor_footer">
      <b-button :loading="savingProcess" @click="save">Save</b-button>
      <b-button variant="tonal" @click="emitHide">Cancel</b-button>
    </div>
  </div>
</template>
<script src="./properties.ts" lang="ts"></script>
<style lang="scss" scoped src="./properties.scss"></style>
