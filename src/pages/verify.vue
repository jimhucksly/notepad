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
            <div class="verify-fields">
              <template v-for="i in [1, 2, 3, 4, 5, 6]">
                <input
                  type="text"
                  :id="'field-' + i"
                  v-model="values[`${i}`]"
                  @input="onInput($event, i)"
                  @keydown="onKeydown($event, i)"
                  :class="{ error: isError }"
                >
              </template>
            </div>
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
