/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
import electronDebug from 'electron-debug'
import { app } from 'electron'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

electronDebug()

// Install `vue-devtools`
app.on('ready', () => {
  // installExtension(VUEJS_DEVTOOLS)
  //   .then(() => {})
  //   .catch(err => {
  //     console.log('Unable to install `vue-devtools`: \n', err)
  //   })
})

// Require `main` process to boot app
require('./index')