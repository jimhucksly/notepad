<template>
  <form>
    <div class="m-b-15">
      <input
        type="text"
        ref="url"
        v-model="link.url"
        placeholder="URL"
        :class="{ 'input--error': errors.url }"
      >
      <span class="error-hint" v-if="errors.url">This field is required</span>
    </div>
    <div class="m-b-15">
      <input
        type="text"
        ref="name"
        v-model="link.name"
        placeholder="Name"
        :class="{ 'input--error': errors.name }"
      >
      <span class="error-hint" v-if="errors.name">This field is required</span>
    </div>
    <div class="flex-end">
      <button class="btn btn-primary" @click.prevent="save">Save</button>
    </div>
  </form>
</template>
<script src="./createEditLink.ts" lang="ts"></script>

