<template>
  <div>
    <titlebar></titlebar>
    <main>
      <loading v-if="loading"></loading>
      <template v-else>
        <auth v-if="!isAuth"></auth>
        <notepad v-else></notepad>
      </template>
    </main>
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'
  import storage from 'electron-storage'
  import path from 'path'
  import Titlebar from './titlebar'
  import Loading from './loading'
  import Auth from './auth'
  import Notepad from './notepad'

  export default {
    name: 'Index',
    components: {
      Titlebar,
      Loading,
      Auth,
      Notepad
    },
    computed: {
      ...mapGetters({
        loading: 'getLoading',
        isAuth: 'getAuth',
        token: 'getToken'
      })
    },
    methods: {
      checkToken(p) {
        storage.isPathExists(p)
          .then(isDoes => {
            storage.get(path.resolve(p, 'app'))
              .then(data => console.log(data))
          })
      }
    },
    mounted() {
      if(this.token && this.isAuth) {
        this.$store.dispatch('action', {
          type: 'GET_JSON'
        })
      } else {
        this.$store.dispatch('loading', false)
        this.$store.dispatch('auth', false)
        this.$store.dispatch('token', null)
      }
    },
    created() {
      this.$store.dispatch('loading', true)
      const appPath = this.$electron.remote.app.getPath('userData')
      this.$store.dispatch('userDataPath', appPath)
      this.checkToken(appPath)
    }
  }

</script>