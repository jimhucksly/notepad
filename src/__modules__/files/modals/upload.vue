<template>
  <div>
    <b-progress
      :label="null"
      :value="percentage"
      size="s"
      @complete="onComplete"
    />
  </div>
</template>
<script src="./upload.ts"></script>
