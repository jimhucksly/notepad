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
            <code-input v-model="code" :count="6" :error="isError" />
          </div>
        </div>
        <div>
          <input type="submit" style="display: none" />
          <button ref="button" class="btn btn-primary" @click.prevent="submit">Send</button>
        </div>
        <div class="flex-center p-y-10">
          <span class="signup" @click="resend">Resend code</span>
        </div>
        <div class="flex-center">
          <span class="signup" @click="$app.goto($app.states.Reg)">I did not receive a verification code</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./verify.ts" lang="ts"></script>
