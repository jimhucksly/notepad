'use strict'

import electron, {
  app,
  BrowserWindow,
  Tray,
  ipcMain,
  Menu,
  MenuItem,
  dialog,
  nativeImage
} from 'electron'
import path from 'path'
import pkg from '../package.json'
import { port } from './endpoint.json'

const $DEV = process.env.NODE_ENV === 'development'

global.__static = path.join(__dirname, '../dist/assets/images').replace(/\\/g, '\\\\')

process.on('uncaughtException', (err) => {
  console.log(err)
})

process.on('unhandledRejection', (err) => {
  console.log(err)
});

app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
app.allowRendererProcessReuse = true

let mainWindow
let appTray

const winURL = $DEV
  ? ['http://localhost', port].join(':')
  : `file://${__dirname}/index.html`

const appIconTray = path.resolve(__static, 'iconTray.ico')
let iconTray = nativeImage.createFromPath(appIconTray)

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: parseInt(width * 0.8),
    height: parseInt(height * 0.8),
    minWidth: 1100,
    minHeight: 563,
    useContentSize: false,
    frame: false,
    toolbar: false,
    show: false,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      enableRemoteModule: false,
      partition: 'persist:tmp'
    },
    icon: path.resolve(__static, 'icons/64x64.png'),
    headless: true,
    args: ['--no-sandbox']
  })

  mainWindow.loadURL(winURL)

  const session = mainWindow.webContents.session
  session.on('will-download', async (event, item, webContents) => {
    webContents.send('download-start')
    item.once('done', (event, state) => {
      webContents.send('download-end')
    })
  })

  if($DEV) {
    mainWindow.webContents.openDevTools()
  }

  /**
   * Uncomment to open Devtools in production mode
   */
  // if(!$DEV) {
  //   mainWindow.webContents.openDevTools()
  // }

  appTray = new Tray(iconTray)
  appTray.setToolTip('Notepad App')

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

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

const gotTheLock = app.requestSingleInstanceLock()

app.on('second-instance', () => {
  mainWindow.show()
  mainWindow.focus()
})

if(!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
    app.setPath('userData', path.resolve(app.getPath('userData'), '../dnweb/notepad-app'))
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-created', (e, window) => {
  window.setMenu(null)
  window.setOverlayIcon(null, '')
  window.setTitle(pkg.build.productName)
  process.env.WINDOW_TITLE = window.getTitle()
  process.env.IS_MAXIMAZED = Number(window.isMaximized())
})

app.on('will-quit', (e) => {
  globalShortcut.unregisterAll()
})

app.on('before-quit', () => {
  mainWindow.removeAllListeners('close')
  globalShortcut.unregisterAll()
  appTray.destroy()
  mainWindow.close()
})

ipcMain.on('minimize', (event) => {
  mainWindow.minimize()
})

ipcMain.on('min-max', (event) => {
  if(mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
  event.sender.send('set-is-maximized', mainWindow.isMaximized())
})

ipcMain.on('hide', (event) => {
  mainWindow.hide()
})

ipcMain.on('menu-popup', (event) => {
  const appMenu = Menu.getApplicationMenu()
  appMenu.popup(mainWindow)
})

ipcMain.on('context-menu-popup', (event) => {
  const contextMenu = new Menu()
  contextMenu.append(new MenuItem({
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }))
  contextMenu.popup(mainWindow)
})

ipcMain.on('user-path-request', (event) => {
  event.sender.send('user-path-response', app.getPath('userData'))
})

ipcMain.on('open-folder-dialog', (event, arg) => {
  dialog.showOpenDialog({
    title: 'Choose folder',
    defaultPath: arg.defaultPath,
    filters: [
      { name: 'exe', extensions: ['exe'] }
    ],
    properties: ['openDirectory']
  }).then((filePaths) => {
    event.sender.send('open-dialog-paths-selected', filePaths)
  })
})

ipcMain.on('open-file-dialog', (event, arg) => {
  dialog.showOpenDialog({
    title: 'Choose file',
    properties: ['openFile'],
    filters: [
      { name: 'txt', extensions: ['txt'] },
      { name: 'json', extensions: ['json'] }
    ]
  }).then((file) => {
    event.sender.send('open-dialog-file-selected', file)
  })
})

ipcMain.on('save-file-dialog', (event, arg) => {
  dialog.showSaveDialog({
    title: 'Save file',
    buttonLabel: 'Save',
    filters: [
      {name: 'json', extensions: ['json']}
    ]
  }).then((file) => {
    event.sender.send('save-dialog-file-selected', file)
  })
})
