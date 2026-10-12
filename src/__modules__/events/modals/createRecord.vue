<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col>
        <b-edit-text v-model="model.title" label="Title" label-on-top clearable />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <b-textarea v-model="model.content" label="Content" label-on-top clearable />
    </v-row>
  </v-container>
</template>
<script src="./createRecord.ts"></script>
