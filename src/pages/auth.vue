<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <div class="form-auth">
        <div class="title">Sign In</div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.login?.value.length > 0,
                error: v?.login?.isInvalid,
              }"
            >
              Login:
            </label>
            <input
              v-model="login"
              type="text"
              placeholder="Login"
              :class="{ error: v?.login?.isInvalid }"
              name="login"
              required
              @keyup.enter.prevent="submit"
            />
          </div>
          <div>
            <span v-show="isSubmitted && v?.login?.isInvalid" class="form-label-error"> Login is incorrect </span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.pass?.value.length > 0,
                error: v?.pass?.isInvalid,
              }"
            >
              Password:
            </label>
            <input
              v-model="pass"
              type="password"
              placeholder="Password"
              :class="{ error: v?.pass?.isInvalid }"
              name="pass"
              required
              @keyup.enter.prevent="submit"
            />
          </div>
          <div>
            <span v-show="isSubmitted && v?.pass?.isInvalid" class="form-label-error"> Password is incorrect </span>
          </div>
        </div>
        <div>
          <input type="submit" style="display: none" />
          <button ref="button" class="btn btn-primary" @click.prevent="submit">Go!</button>
        </div>
        <div class="flex-center p-y-10">
          <span class="signup" @click="$app.goto($app.states.Reg)">Sign Up</span>
        </div>
        <div class="flex-center">
          <span class="signup" @click="$app.goto($app.states.Reset)">Forgot password?</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./auth.ts" lang="ts"></script>
