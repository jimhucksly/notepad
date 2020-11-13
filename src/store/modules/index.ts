const stateItems: string[] = [
  'loading',
  'isAuth',
  'token',
  'userDataPath',
  'isDevelopment',
  'json',
  'archives',
  'libraryData',
  'todo',
  'events',
  'links',
  'todo',
  'mdTree',
  'filter',
  'isAboutPopupShow',
  'isUploadingPopupShow',
  'isLinkAddPopupShow',
  'isPreferencesShow',
  'isProjectsShow',
  'isTodoShow',
  'isLibraryShow',
  'isEventsShow',
  'isJsonViewerShow',
  'isLinksShow',
  'downloadsTargetPath',
  'notification',
  'error',
  'previousPage',
  'component'
]

const files = (require as any).context('.', false, /\.ts$/)
const modules = {}

files.keys().forEach((key: string) => {
  if(key === './index.js') return
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default
})

export default modules
export {
  stateItems
}
