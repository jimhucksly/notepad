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
              required
              name="login"
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
                active: v?.pass?.value?.length > 0,
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
              required
              name="pass"
              @keyup.enter.prevent="submit"
            />
          </div>
          <div>
            <span v-show="isSubmitted && v?.pass?.isInvalid" class="form-label-error">Password is incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.passRepeat?.value?.length > 0,
                error: v?.passRepeat?.isInvalid,
              }"
            >
              Repeat password:
            </label>
            <input
              v-model="passRepeat"
              type="password"
              placeholder="Repeat password"
              :class="{ error: v?.passRepeat?.isInvalid }"
              required
              name="passRepeat"
              data-rule-target="pass"
              @keyup.enter.prevent="submit"
            />
          </div>
          <div>
            <span v-show="isSubmitted && v?.passRepeat?.isInvalid" class="form-label-error">Password is incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.name?.value?.length > 0,
                error: v?.name?.isInvalid,
              }"
            >
              Your name:
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Your name"
              :class="{ error: v?.name?.isInvalid }"
              required
              name="name"
              @keyup.enter.prevent="submit"
            />
          </div>
          <div>
            <span v-show="isSubmitted && v?.name?.isInvalid" class="form-label-error">Name incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: v?.email?.value?.length > 0,
                error: v?.email?.isInvalid,
              }"
            >
              Your email:
            </label>
            <input
              v-model="email"
              type="text"
              placeholder="Your email"
              :class="{ error: v?.email?.isInvalid }"
              required
              name="email"
              @keyup.enter.prevent="submit"
            />
          </div>
          <div>
            <span v-show="isSubmitted && v?.email?.isInvalid" class="form-label-error">Email incorrect</span>
          </div>
        </div>
        <div>
          <input type="submit" style="display: none" />
          <button ref="button" class="btn btn-primary" @click.prevent="submit">Sign Up</button>
        </div>
        <div class="flex-center p-y-10">
          <span class="signup" @click="goBack">Go back</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./reg.ts" lang="ts"></script>
