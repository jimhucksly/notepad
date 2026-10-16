<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col>
        <b-edit-text v-model="internalModel.url" placeholder="URL" required />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <b-edit-text  v-model="internalModel.name" placeholder="Name" required />
    </v-row>
  </v-container>
</template>
<script src="./createEdit.ts" lang="ts"></script>
