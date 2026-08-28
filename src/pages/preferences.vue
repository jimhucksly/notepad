<template>
  <v-container class="page-wrapper">
    <!-- title -->
    <v-row>
      <v-col>
        <div class="font-semibold text-body-l">Preferences</div>
      </v-col>
    </v-row>
    <!-- content -->
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col>
            <b-switch label="Run App when Windows startup" v-model="isAutoLaunchEnabled"></b-switch>
          </v-col>
        </v-row>
        <v-row v-if="isYandexApiTokenExist">
          <v-col cols="6">
            <span class="b-label">
              <span class="b-label-content font-medium">
                Yandex.Disk Api Token received
              </span>
            </span>
          </v-col>
          <v-col cols="6">
            <div style="width: 100px">
              <b-button color="grey" variant="outlined" block @click.prevent="revoke">
                <b-icon>close-octagon-outline</b-icon>
                Revoke
              </b-button>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="!isResetPasswordMode && !$electron">
          <v-col>
            <span class="b-label">
              <span class="b-label-content font-medium">
                Reset password
              </span>
            </span>
            <div style="width: 100px">
              <b-button color="grey" variant="outlined" block @click.prevent="isResetPasswordMode = true">
                <b-icon>shield-key-outline</b-icon>
                Reset
              </b-button>
            </div>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <div>
              <b-edit-text type="password" v-model="oldPass" label="Enter please the old password" :label-size="4"></b-edit-text>
            </div>
            <div class="form-group">
              <div class="form-group-inner flex-between items-center">
                <div class="col">
                  <label class="m-b-5"></label>
                </div>
                <div class="col">
                  <input

                    type="password"
                    name="oldPass"
                    required
                    :class="{ error: v?.oldPass?.isInvalid }"
                  />
                  <span v-show="isSubmitted && v?.oldPass?.isInvalid" class="form-label-error">
                    {{ errorMessage || 'This field is required' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="form-group-inner flex-between items-center">
                <div class="col">
                  <label class="m-b-5">New Password</label>
                </div>
                <div class="col">
                  <input
                    v-model="newPass"
                    type="password"
                    name="newPass"
                    required
                    :class="{ error: v?.newPass?.isInvalid }"
                  />
                  <span v-show="isSubmitted && v?.newPass?.isInvalid" class="form-label-error">
                    This field is required
                  </span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="form-group-inner flex-between items-center">
                <div class="col">
                  <label class="m-b-5">Repeat new password</label>
                </div>
                <div class="col">
                  <input
                    v-model="repeatNewPass"
                    type="password"
                    name="repeatNewPass"
                    data-rule-target="newPass"
                    required
                    :class="{ error: v?.repeatNewPass?.isInvalid }"
                  />
                  <span v-show="isSubmitted && v?.repeatNewPass?.isInvalid" class="form-label-error">
                    This field is required
                  </span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- footer -->
    <v-row>
      <v-col class="d-flex align-center justify-end gap-2">
        <b-button variant="outlined" size="s" @click.prevent="cancel">Cancel</b-button>
        <b-button size="s" @click.prevent="save">Save</b-button>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./preferences.ts" lang="ts"></script>
