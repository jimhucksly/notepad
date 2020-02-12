/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const stateKeys = [
  'loading',
  'isAuth',
  'token',
  'userDataPath',
  'isDevelopment',
  'json',
  'md',
  'mdTree',
  'filter',
  'unread',
  'isAboutPopupShow',
  'isUploadingPopupShow',
  'isPreferencesShow',
  'isProjectsShow',
  'isMarkdownShow',
  'isJsonViewerShow',
  'downloadsTargetPath',
  'interval',
  'notification',
  'error'
]

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if(key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
export {
  stateKeys
}
