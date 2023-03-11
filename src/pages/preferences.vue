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
          <label class="m-b-5">Run App when Windows startup</label>
          <b-checkbox v-model="isAutoLaunchEnabled" />
        </div>
      </div>
      <div class="form-group" v-if="isYandexApiTokenExist">
        <div class="form-group-inner flex-between items-center">
          <label class="m-b-5">Yandex.Disk Api Token received</label>
          <button class="btn btn-default" @click.prevent="revoke">Revoke</button>
        </div>
      </div>
      <div class="form-group" v-if="!isResetPasswordMode">
        <div class="form-group-inner flex-between items-center">
          <label class="m-b-5">Reset password</label>
          <button class="btn btn-default" @click.prevent="isResetPasswordMode = true">Reset</button>
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
                type="password"
                v-model="oldPass"
                name="oldPass"
                required
                :class="{ error: v?.oldPass?.isInvalid }"
              >
              <span class="form-label-error" v-show="isSubmitted && v?.oldPass?.isInvalid">
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
                type="password"
                v-model="newPass"
                name="newPass"
                required
                :class="{ error: v?.newPass?.isInvalid }"
              >
              <span class="form-label-error" v-show="isSubmitted && v?.newPass?.isInvalid">
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
                type="password"
                v-model="repeatNewPass"
                name="repeatNewPass"
                data-rule-target="newPass"
                required
                :class="{ error: v?.repeatNewPass?.isInvalid }"
              >
              <span class="form-label-error" v-show="isSubmitted && v?.repeatNewPass?.isInvalid">
                This field is required
              </span>
            </div>
          </div>
        </div>
      </template>
    </form>
    <div class="btn_wrapper">
      <button class="btn btn-primary" @click.prevent="save">Save</button>
      <button class="btn btn-default m-l-15" @click.prevent="cancel">Cancel</button>
    </div>
  </div>
</template>
<script src="./preferences.ts" lang="ts"></script>
