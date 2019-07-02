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
  setAboutPopupShow(state, flag) {
    state.aboutPopupShow = flag
  }
}

export default mutations
