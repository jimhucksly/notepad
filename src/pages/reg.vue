<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <div class="form-auth">
        <div class="title">Registration</div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.login?.value?.length > 0,
                error: v?.login?.isInvalid
              }"
            >
              Login:
            </label>
            <input
              type="text"
              placeholder="Login"
              :class="{ error: v?.login?.isInvalid }"
              v-model="login"
              required
              name="login"
              @keyup.enter.prevent="submit"
            >
          </div>
          <div>
            <span class="form-label-error" v-show="isSubmitted && v?.login?.isInvalid">
              Login is incorrect
            </span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.pass?.value?.length > 0,
                error: v?.pass?.isInvalid
              }"
            >
              Password:
            </label>
            <input
              type="password"
              placeholder="Password"
              :class="{ error: v?.pass?.isInvalid }"
              v-model="pass"
              required
              name="pass"
              @keyup.enter.prevent="submit"
            >
          </div>
          <div>
            <span class="form-label-error" v-show="isSubmitted && v?.pass?.isInvalid">Password is incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.passRepeat?.value?.length > 0,
                error: v?.passRepeat?.isInvalid
              }"
            >
              Repeat password:
            </label>
            <input
              type="password"
              placeholder="Repeat password"
              :class="{ error: v?.passRepeat?.isInvalid }"
              v-model="passRepeat"
              required
              name="passRepeat"
              data-rule-target="pass"
              @keyup.enter.prevent="submit"
            >
          </div>
          <div>
            <span class="form-label-error" v-show="isSubmitted && v?.passRepeat?.isInvalid">Password is incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.name?.value?.length > 0,
                error: v?.name?.isInvalid
              }"
            >
              Your name:
            </label>
            <input
              type="text"
              placeholder="Your name"
              :class="{ error: v?.name?.isInvalid }"
              v-model="name"
              required
              name="name"
              @keyup.enter.prevent="submit"
            >
          </div>
          <div>
            <span class="form-label-error" v-show="isSubmitted && v?.name?.isInvalid">Name incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.email?.value?.length > 0,
                error: v?.email?.isInvalid
              }"
            >
              Your email:
            </label>
            <input
              type="text"
              placeholder="Your email"
              :class="{ error: v?.email?.isInvalid }"
              v-model="email"
              required
              name="email"
              @keyup.enter.prevent="submit"
            >
          </div>
          <div>
            <span class="form-label-error" v-show="isSubmitted && v?.email?.isInvalid">Email incorrect</span>
          </div>
        </div>
        <div>
          <input type="submit" style="display: none">
          <button class="btn btn-primary" @click.prevent="submit" ref="button">Sign Up</button>
        </div>
        <div class="flex-center p-y-10">
          <span class="signup" @click="goBack">Go back</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./reg.ts" lang="ts"></script>
