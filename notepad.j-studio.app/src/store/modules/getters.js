const getters = {
  getLoading: state => state.loading,
  getAuth: state => state.isAuth,
  getToken: state => state.token,
  getUserDataPath: state => state.userDataPath,
  getJson: state => state.json,
  getFilter: state => state.filter,
  getAboutPopupShow: state => state.aboutPopupShow,
  isPreferencesShowed: state => state.preferencesShow,
  getDownloadsTargetPath: state => state.downloadsTargetPath
}

export default getters
