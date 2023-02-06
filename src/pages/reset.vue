<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <div class="form-auth">
        <div class="title">Reset password</div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.email?.value.length > 0,
                error: v?.email?.isInvalid
              }"
            >
              Your login or email:
            </label>
            <input
              type="text"
              placeholder="Your login or email"
              :class="{ error: v?.email?.isInvalid }"
              v-model="email"
              @keyup.enter.prevent="submit"
            >
          </div>
        </div>
        <div>
          <input type="submit" style="display: none">
          <button class="btn btn-primary" @click.prevent="submit" ref="button">Send</button>
        </div>
        <div class="flex-center p-y-10">
          <span class="signup" @click="$app.goto($app.states.Auth)">Go back</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./reset.ts" lang="ts"></script>
