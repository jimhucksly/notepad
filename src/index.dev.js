/* eslint-disable */

import electronDebug from 'electron-debug'
import { app } from 'electron'

electronDebug()

// Install `vue-devtools`

app.on('ready', async () => {

  // try {
  //   await session.defaultSession.loadExtension(path.resolve(__dirname, '../vue-devtools'))
  // } catch(err) {
  //   console.log(err)
  // }
})

// Require `main` process to boot app
require('./index')