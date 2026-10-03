<template>
  <v-card class="elevation-0">
    <v-card-title>
      <span>{{ internalModel.date }}</span>
    </v-card-title>
    <v-card-text>
      <b-textarea v-model="internalModel.text" placeholder="New record"></b-textarea>
    </v-card-text>
  </v-card>
</template>
<script src="./edit.ts"></script>
