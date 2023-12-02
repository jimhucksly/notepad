<template>
  <form>
    <div class="m-b-15">
      <input
        type="text"
        name="name"
        required
        v-model="name"
        placeholder="File name"
        :class="{ error: v?.name?.isInvalid }"
      >
      <span class="form-label-error" v-show="isSubmitted && v?.name?.isInvalid">
        Name is incorrect
      </span>
    </div>
  </form>
</template>
<script src="./createEditFile.ts" lang="ts"></script>
