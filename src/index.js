'use strict'

import electron, {
  app,
  BrowserWindow,
  Tray,
  ipcMain,
  Menu,
  MenuItem,
  dialog,
  nativeImage,
  globalShortcut
} from 'electron'
import path from 'path'
import pkg from '../package.json'
import electronDebug from 'electron-debug'
import { download } from 'electron-dl'

const $DEV = process.env.NODE_ENV === 'development'

if($DEV) {
  global.__static = path.join(__dirname, '../static').replace(/\\/g, '\\\\')
  electronDebug()
} else {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const appIconTray = path.resolve(__static, 'iconTray.ico')
let iconTray = nativeImage.createFromPath(appIconTray)

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width * 0.8,
    height: height * 0.8,
    minWidth: 1100,
    minHeight: 563,
    useContentSize: true,
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

  appTray = new Tray(iconTray)
  appTray.setToolTip('Notepad Jimhucksly Studio')

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
    // mainWindow = null
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
      mainWindow.focus()
    }
  })

  /**
   * Uncomment to open Devtools in production mode
  */
  // mainWindow.webContents.openDevTools()
}

const gotTheLock = app.requestSingleInstanceLock()

if(!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if(mainWindow) {
      if(mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })

  app.on('ready', createWindow)
}

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
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

app.on('activate', () => {
  if(mainWindow === null) {
    createWindow()
  }
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

app.setPath('userData', path.resolve(app.getPath('userData'), '../dnweb/notepad-app'))
process.env.USER_DATA_PATH = app.getPath('userData')

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

ipcMain.on('download-button', async (event, { url, targetPath }) => {
  await download(
    mainWindow,
    url,
    {
      directory: targetPath,
      onStarted: () => {
        event.sender.send('download-start')
      },
      onProgress: progress => {
        event.sender.send('download-progress', progress)
      },
      onCompleted: () => {
        event.sender.send('download-end')
      }
    }
  )
})
