<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <div class="form-auth">
        <div class="title">Reset password</div>
        <div class="form-group">
          <div v-if="isSubmitted">
            <p class="text-center">Your temporary password was beed sent on email:</p>
            <p class="text-center font-bold p-y-5">{{ email }}</p>
          </div>
          <div class="form-group-inner" v-else>
            <label
              :class="{
                active: email.length > 0
              }"
            >
              Your login or email:
            </label>
            <input
              type="text"
              placeholder="Your login or email"
              v-model="email"
              @keyup.enter.prevent="submit"
            >
          </div>
        </div>
        <div v-if="!isSubmitted">
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
