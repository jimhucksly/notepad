<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col class="py-3">
        <span>{{ internalModel.date }}</span>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <b-textarea v-model="internalModel.text" placeholder="New record"></b-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./edit.ts"></script>
