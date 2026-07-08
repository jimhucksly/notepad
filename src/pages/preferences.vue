<template>
  <div class="preferences">
    <div class="title">Preferences</div>
    <form class="preferences_form">
      <!-- <div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              class="m-b-5"
              :class="{ error: errors.downloadsTargetPath }"
            >
              Downloads target path:
            </label>
            <input
              type="text"
              :class="{ error: errors.downloadsTargetPath }"
              v-model="preferences.downloadsTargetPath"
              name="downloadsTargetPath"
              readonly
              required
            >
            <span class="form-label-error" v-show="errors.downloadsTargetPath">
              Field can't be empty
            </span>
          </div>
          <div class="form-group-btn">
            <button class="btn btn-default" @click.prevent="openFolderDialog">Change</button>
          </div>
        </div>
      </div> -->
      <div class="form-group">
        <div class="form-group-inner flex-between items-center">
          <b-switch label="Run App when Windows startup" v-model="isAutoLaunchEnabled"></b-switch>
        </div>
      </div>
      <div v-if="isYandexApiTokenExist" class="form-group">
        <div class="form-group-inner flex-between items-center">
          <span class="b-label">
            <span class="b-label-content font-medium">
              Yandex.Disk Api Token received
            </span>
          </span>
          <div style="width: 100px">
            <b-button color="grey" variant="outlined" block @click.prevent="revoke">
              <b-icon>close-octagon-outline</b-icon>
              Revoke
            </b-button>
          </div>
        </div>
      </div>
      <div v-if="!isResetPasswordMode" class="form-group">
        <div class="form-group-inner flex-between items-center">
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
        </div>
      </div>
      <template v-else>
        <div class="form-group">
          <div class="form-group-inner flex-between items-center">
            <div class="col">
              <label class="m-b-5">Enter please the old password</label>
            </div>
            <div class="col">
              <input
                v-model="oldPass"
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
      </template>
    </form>
    <div class="btn_wrapper gap-2">
      <b-button variant="outlined" size="s" @click.prevent="cancel">Cancel</b-button>
      <b-button size="s" @click.prevent="save">Save</b-button>
    </div>
  </div>
</template>
<script src="./preferences.ts" lang="ts"></script>
