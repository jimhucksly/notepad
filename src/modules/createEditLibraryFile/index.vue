<template>
  <form>
    <div class="m-b-15">
      <input
        type="text"
        ref="title"
        v-model="file.title"
        placeholder="File title"
        :class="{ 'input--error': errors.title }"
      >
      <span class="error-hint" v-if="errors.title">This field is required</span>
    </div>
    <div class="m-b-15">
      <input
        type="text"
        ref="name"
        v-model="file.name"
        placeholder="File name"
        :class="{ 'input--error': errors.name }"
      >
      <span class="error-hint" v-if="errors.name">This field is required</span>
    </div>
    <div class="flex-end">
      <button class="btn btn-primary" @click.prevent="save">Save</button>
    </div>
  </form>
</template>
<script src="./index.ts" lang="ts"></script>
