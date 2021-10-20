<template>
  <div>
    <h6>{{ question }}</h6>
    <div class="flex-center p-y-10">
      <button
        class="btn btn-primary btn-md m-r-5"
        @click="ok"
      >
        Yes
      </button>
      <button
        class="btn btn-default btn-md m-l-5"
        @click="no"
      >
        No
      </button>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>

