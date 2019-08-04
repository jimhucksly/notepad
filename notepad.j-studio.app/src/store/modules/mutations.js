const mutations = {
  setLoading(state, flag) {
    state.loading = flag
  },
  setAuth(state, flag) {
    state.isAuth = flag
  },
  setToken(state, value) {
    state.token = value
  },
  setUserDataPath(state, path) {
    state.userDataPath = path
  },
  setError(state, flag) {
    state.error = flag
  },
  setJson(state, json) {
    state.json = json
  },
  setFilter(state, object) {
    state.filter = object
  },
  setInterval(state, int) {
    state.interval = int
  },
  setNotification(state, flag) {
    state.notification = flag
  },
  setAboutPopupShow(state, flag) {
    state.aboutPopupShow = flag
  },
  setUploadingPopupShow(state, flag) {
    state.uploadingPopupShow = flag
  },
  setPreferencesShow(state, flag) {
    state.preferencesShow = flag
  },
  setDownloadsTargetPath(state, path) {
    state.downloadsTargetPath = path
  }
}

export default mutations
