'use strict'

import { app, BrowserWindow, Tray, ipcMain, Menu, dialog } from 'electron'
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

const appIcon = path.join(__dirname, '../static/icon_118x118.png')
const appIconOverlay = path.join(__dirname, '../static/icon_overlay_34x34.png')
const appIconTray = path.join(__dirname, '../static/icon_48x48.png')

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

  const appTray = new Tray(appIconTray)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainWindow.show()
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  appTray.setContextMenu(contextMenu)

  appTray.on('click', () => {
    if(mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('minimize', (e) => {
    // e.preventDefault()
    // mainWindow.hide()
  })

  mainWindow.on('show', () => {
    // appTray.setHighlightMode('always')
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
  window.setIcon(appIcon)
  window.setOverlayIcon(null, '')
  window.setTitle(pkg.build.productName)
})

app.on('activate', () => {
  if(mainWindow === null) {
    createWindow()
  }
})

app.setPath('userData', path.resolve(app.getPath('userData'), '../JimhuckslyStudio/notepad-app'))

ipcMain.on('authorized', () => {
  const appMenu = Menu.getApplicationMenu()
  const menuItemFile = appMenu.items.find(item => item.label === 'File')
  menuItemFile.visible = true
})

ipcMain.on('unauthorized', () => {
  const appMenu = Menu.getApplicationMenu()
  const menuItemFile = appMenu.items.find(item => item.label === 'File')
  menuItemFile.visible = false
})

ipcMain.on('open-folder-dialog', (event, arg) => {
  const options = {
    title: 'Choose folder',
    defaultPath: arg.defaultPath,
    // buttonLabel: 'Do it',
    filters: [
      { name: 'exe', extensions: ['exe'] }
    ],
    properties: ['openDirectory']
    // message: 'This message will only be shown on macOS'
  }
  dialog.showOpenDialog(null, options, (filePaths) => {
    event.sender.send('open-dialog-paths-selected', filePaths)
  })
})

ipcMain.on('set-icon-notification', () => {
  mainWindow.setOverlayIcon(appIconOverlay, 'You have an unread message')
})

ipcMain.on('hide-icon-notification', () => {
  setTimeout(() => {
    mainWindow.setOverlayIcon(null, '')
  }, 2000)
})

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
