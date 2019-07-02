<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <form class="form-auth">
        <div class="title">Sign In</div>
        <div class="form-group">
          <div class="form-group-inner">
            <label 
              :class="{ 
                active: login.length > 0,
                error: !!errors.login 
              }">Login:</label>
            <input type="text" placeholder="Login" :class="{ error: !!errors.login }" v-model="login">
          </div>
          <div>
            <span class="form-label-error" v-show="!!errors.login && !!login.length">Login is incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label 
              :class="{ 
                active: pass.length > 0,
                error: !!errors.pass
                }">Password:</label>
            <input type="password" placeholder="Password" :class="{ error: !!errors.pass }" v-model="pass">
          </div>
          <div>
            <span class="form-label-error" v-show="!!errors.pass && !!pass.length">Password is incorrect</span>
          </div>
        </div>
        <div>
          <button class="btn btn-primary" @click="submit">Go!</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>

  import isEmpty from 'lodash/isEmpty'

  export default {
    name: 'Auth',
    data() {
      return {
        login: '',
        pass: '',
        errors: {
          login: 0,
          pass: 0
        }
      }
    },
    watch: {
      login(val) {
        this.errors.login = val.length > 0 ? 0 : 1
      },
      pass(val) {
        this.errors.pass = val.length > 0 ? 0 : 1
      }
    },
    methods: {
      validate() {
        if(this.login.length === 0) {
          this.errors.login = 1
        }
        if(this.pass.length === 0) {
          this.errors.pass = 1
        }
        return Object.keys(this.errors).map(key => this.errors[key]).reduce((a, b) => a + b) === 0
      },
      submit() {
        if(this.validate()) {
          this.$store.dispatch('action', {
            type: 'AUTH',
            data: {
              login: this.login,
              password: this.pass
            }
          })
            .then(resp => {
              this.$store.dispatch('token', resp.token)
              this.$store.dispatch('auth', true)
            })
            .catch(err => {
              const data = err.response.data
              if(!isEmpty(data.message)) {
                this.errors = Object.assign({}, data.message)
                this.errors.login = this.errors.login ? 1 : 0
                this.errors.pass = this.errors.pass ? 1 : 0
                this.validate()
              }
            })
        }
      }
    }
  }

</script>