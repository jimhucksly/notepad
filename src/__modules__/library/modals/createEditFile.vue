<template>
  <form>
    <div class="m-b-15">
      <input
        v-model="name"
        type="text"
        name="name"
        required
        placeholder="File name"
        :class="{ error: v?.name?.isInvalid }"
      />
      <span v-show="isSubmitted && v?.name?.isInvalid" class="form-label-error"> Name is incorrect </span>
    </div>
  </form>
</template>
<script src="./createEditFile.ts" lang="ts"></script>
