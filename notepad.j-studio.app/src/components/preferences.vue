<template>
  <div class="preferences">
    <div class="title">Preferences</div>
    <form ref="form">
      <div>
        <div class="form-group">
          <div class="form-group-inner">
            <label class="m-b-5"
              :class="{ error: errors.downloadsTargetPath }"
              >
              Downloads target path:</label>
            <input type="text"
              :class="{ error: errors.downloadsTargetPath }"
              v-model="preferences.downloadsTargetPath" 
              name="downloadsTargetPath"
              readonly 
              required>
            <span class="form-label-error"
              v-show="errors.downloadsTargetPath">
              Field can't be empty
            </span>
          </div>
          <div class="form-group-btn">
            <button class="btn btn-default" @click.prevent="openFolderDialog">Change</button>
          </div>
        </div>
      </div>
    </form>
    <div class="btn_wrapper">
      <button class="btn btn-primary" @click.prevent="save">Save</button>
      <button class="btn btn-default m-l-15" @click.prevent="cancel">Cancel</button>
    </div>
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'
  import storage from '@/plugins/storage'

  export default {
    name: 'Preferences',
    data() {
      return {
        preferences: {
          downloadsTargetPath: ''
        },
        defaults: {
          downloadsTargetPath: ''
        },
        errors: {
          downloadsTargetPath: 0
        }
      }
    },
    computed: {
      ...mapGetters({
        userDataPath: 'getUserDataPath',
        downloadsTargetPath: 'getDownloadsTargetPath'
      })
    },
    methods: {
      save() {
        const form = this.$refs.form
        const requireds = form.querySelectorAll('[required]')
        if(requireds.length > 0) {
          requireds.forEach((el) => {
            const name = el.name
            if(this[name] === '') {
              this.errors[name] = 1
              el.onclick = () => {
                this.errors[name] = 0
                el.onclick = null
              }
            }
          })
        }

        const valid = Object.keys(this.errors).map(key => this.errors[key]).reduce((a, b) => a + b) === 0
        if(valid) {
          storage.append(this.userDataPath, 'UserPreferences', {
            downloadsTargetPath: this.preferences.downloadsTargetPath
          })
          this.$store.dispatch('downloadsTargetPath', this.preferences.downloadsTargetPath)
        }
        this.$electron.ipcRenderer.send('preferences-hide')
        this.$store.dispatch('preferences')
      },
      cancel() {
        this.$electron.ipcRenderer.send('preferences-hide')
        this.$store.dispatch('preferences')
      },
      openFolderDialog() {
        this.$electron.ipcRenderer.send('open-folder-dialog', {
          defaultPath: this.downloadsTargetPath
        })
        this.$electron.ipcRenderer.on('open-dialog-paths-selected', (event, response) => {
          this.preferences.downloadsTargetPath = response && response[0] ? response[0] : this.userDataPath
        })
      }
    },
    mounted() {
      this.preferences.downloadsTargetPath = this.$store.getters['getDownloadsTargetPath']
      this.defaults.downloadsTargetPath = this.$store.getters['getDownloadsTargetPath']
    }
  }

</script>