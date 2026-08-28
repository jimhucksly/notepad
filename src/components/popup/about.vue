<template>
  <div>
    <div class="m-b-20 flex-center">
      <img src="assets/images/icon.svg" alt="app-icon" style="width: 150px" />
    </div>
    <div class="m-b-5 flex-center">
      <p>{{ appName }}</p>
    </div>
    <div class="m-b-5 flex-center">
      <p><small>v1.0.0</small></p>
    </div>
    <div class="m-b-5 flex-center">
      <p>
        <small>&copy;{{ author }}, {{ new Date().getFullYear() }}</small>
      </p>
    </div>
  </div>
</template>
<script src="./about.ts" lang="ts"></script>
