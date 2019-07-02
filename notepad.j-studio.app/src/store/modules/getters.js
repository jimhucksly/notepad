const getters = {
  getLoading: state => state.loading,
  getAuth: state => state.isAuth,
  getToken: state => state.token,
  getUserDataPath: state => state.userDataPath,
  getJson: state => state.json,
  getAboutPopupShow: state => state.aboutPopupShow
}

export default getters
