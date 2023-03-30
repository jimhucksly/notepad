<template>
  <form>
    <div class="m-b-15">
      <input
        type="text"
        name="url"
        required
        v-model="url"
        placeholder="URL"
        :class="{ error: v?.url?.isInvalid }"
      >
      <span class="form-label-error" v-show="isSubmitted && v?.url?.isInvalid">
        Url is incorrect
      </span>
    </div>
    <div class="m-b-15">
      <input
        type="text"
        name="linkName"
        required
        v-model="linkName"
        placeholder="Name"
        :class="{ error: v?.name?.isInvalid }"
      >
      <span class="form-label-error" v-show="isSubmitted && v?.name?.isInvalid">
        Name is incorrect
      </span>
    </div>
  </form>
</template>
<script src="./createEditLink.ts" lang="ts"></script>

