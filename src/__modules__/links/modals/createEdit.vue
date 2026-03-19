<template>
  <form>
    <div class="m-b-15">
      <input v-model="url" type="text" name="url" required placeholder="URL" :class="{ error: v?.url?.isInvalid }" />
      <span v-show="isSubmitted && v?.url?.isInvalid" class="form-label-error"> Url is incorrect </span>
    </div>
    <div class="m-b-15">
      <input
        v-model="linkName"
        type="text"
        name="linkName"
        required
        placeholder="Name"
        :class="{ error: v?.name?.isInvalid }"
      />
      <span v-show="isSubmitted && v?.name?.isInvalid" class="form-label-error"> Name is incorrect </span>
    </div>
  </form>
</template>
<script src="./createEdit.ts" lang="ts"></script>
