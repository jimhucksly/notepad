<template>
  <div class="auth_cont yd_cont">
    <div class="yd_cont_title">
      Connect please to your Yandex.Disk
    </div>
    <img src="assets/images/yd.png" width="170" height="110" alt="">
    <form class="form-auth">
      <template v-if="createYandexDiskStepOne">
        <button class="btn btn-default" @click.prevent="createYandexDiskPath">
          <strong>Go!</strong>
        </button>
      </template>
      <div class="form-group" v-if="createYandexDiskStepTwo">
        <div class="form-group-inner">
          <div class="title">
            <p>Please enter the access code here:</p>
          </div>
          <code-input v-model="yandexDiskResponseCode" :count="7" :error="isError" />
          <b-btn
            primary
            label="Apply"
            class="btn btn-primary m-t-10"
            :processing="yandexCodeApplyProcessing"
            @click="yandexCodeApply($event)"
          />
          <div class="flex-center p-y-10">
            <span class="signup" @click="$app.goto($app.states.Auth)">Go back</span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script src="./yandex.ts" lang="ts"></script>
