<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <div class="form-auth">
        <div class="title">
          <p>Please check your email and</p>
          <p>enter the verify code here:</p>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.code?.value?.length > 0,
                error: v?.code?.isInvalid
              }"
            >
              Verify code:
            </label>
            <input
              type="text"
              placeholder="Verify code"
              :class="{ error: v?.code?.isInvalid }"
              v-model="code"
              required
              name="code"
              @keyup.enter.prevent="submit"
            >
          </div>
          <div>
            <span class="form-label-error" v-show="isSubmitted && v?.code?.isInvalid">
              Verify code is incorrect
            </span>
          </div>
        </div>
        <div>
          <input type="submit" style="display: none">
          <button class="btn btn-primary" @click.prevent="submit" ref="button">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./verify.ts" lang="ts"></script>
