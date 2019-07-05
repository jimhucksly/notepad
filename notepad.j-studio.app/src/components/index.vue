<template>
  <div id="content">
    <titlebar></titlebar>
    <main>
      <sidebar v-if="isAuth && !loading"></sidebar>
      <section>
        <loading v-if="loading"></loading>
        <template v-else>
          <auth v-if="!isAuth"></auth>
          <notepad v-else></notepad>
        </template>
      </section>
    </main>
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'
  import Titlebar from './titlebar'
  import Loading from './loading'
  import Auth from './auth'
  import Notepad from './notepad'
  import Sidebar from './sidebar'
  import storage from '@/plugins/storage'
  import { userDataFileName } from '@/constants'

  export default {
    name: 'Index',
    components: {
      Titlebar,
      Loading,
      Auth,
      Notepad,
      Sidebar
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
        this.$store.dispatch('loading', true)
        storage.isPathExists(p)
          .then(() => {
            return storage.isFileExists(p, userDataFileName)
          })
          .then(() => {
            return storage.get(p, userDataFileName, 'token')
          })
          .then((token) => {
            if(token) {
              this.$store.dispatch('auth', true)
              this.$store.dispatch('token', token)
              this.getJson()
            } else throw new Error()
          })
          .catch(() => {
            this.$store.dispatch('loading', false)
            this.$store.dispatch('auth', false)
          })
      },
      getJson() {
        this.$store.dispatch('action', {
          type: 'GET_JSON'
        })
      }
    },
    created() {
      const appPath = this.$electron.remote.app.getPath('userData')
      this.$store.dispatch('userDataPath', appPath)
      this.checkToken(appPath)
    }
  }

</script>