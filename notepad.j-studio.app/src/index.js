'use strict'

import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import pkg from '../package.json'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 563,
    minWidth: 1000,
    minHeight: 563,
    useContentSize: true,
    frame: false,
    toolbar: false,
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-frame-finish-load', () => {
    if(process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
      mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.focus()
      })
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-created', (e, window) => {
  window.setMenu(null)
  window.setIcon(path.join(__dirname, '../static/icon_118x118.png'))
  window.setTitle(pkg.build.productName)
  ipcMain.on('authorized', () => {
    const appMenu = Menu.getApplicationMenu()
    appMenu.items.find(item => item.label === 'Sign Out').visible = true
  })
  ipcMain.on('unauthorized', () => {
    const appMenu = Menu.getApplicationMenu()
    appMenu.items.find(item => item.label === 'Sign Out').visible = false
  })
})

app.on('activate', () => {
  if(mainWindow === null) {
    createWindow()
  }
})

app.setPath('userData', path.resolve(app.getPath('userData'), '../JimhuckslyStudio/notepad-app'))

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
