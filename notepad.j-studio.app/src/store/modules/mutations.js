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
  setJson(state, json) {
    state.json = json
  },
  setFilter(state, object) {
    state.filter = object
  },
  setAboutPopupShow(state, flag) {
    state.aboutPopupShow = flag
  }
}

export default mutations
