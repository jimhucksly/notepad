<template>
  <v-container class="page-wrapper">
    <!-- title -->
    <v-row>
      <v-col>
        <div class="font-semibold text-body-l">Account</div>
      </v-col>
    </v-row>
    <!-- content -->
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <span class="b-label">
              <span class="b-label-content">
                Login
              </span>
            </span>
          </v-col>
          <v-col cols="6" class="d-flex align-center">
            <span>{{ currentUser.login }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <span class="b-label">
              <span class="b-label-content">
                E-mail
              </span>
            </span>
          </v-col>
          <v-col cols="6" class="d-flex align-center">
            <span>{{ currentUser.email }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- footer -->
    <v-row>
      <v-col class="d-flex align-center justify-end gap-2">
        <b-button variant="outlined" size="s"  @click.prevent="cancel">Cancel</b-button>
        <b-button size="s"  @click.prevent="logout">Logout</b-button>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./account.ts" lang="ts"></script>
