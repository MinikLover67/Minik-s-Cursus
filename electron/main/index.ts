import { app, BrowserWindow, Menu, nativeTheme } from 'electron'
import { join, dirname, isAbsolute } from 'path'
import { fileURLToPath } from 'url'
import { statSync } from 'fs'
import { registerAllIpc } from './ipc/index.ts'
import { getStoreValue, setStoreValue } from './utils/store.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow: BrowserWindow | null = null
const pendingFiles: string[] = []

// ─── Single Instance Lock ───
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  // macOS: open-file event (must be before app.ready)
  app.on('open-file', (event, filePath) => {
    event.preventDefault()
    pendingFiles.push(filePath)
    if (mainWindow?.webContents) {
      sendFileToRenderer(filePath)
    }
  })

  function getFilePathFromArgv(argv: string[]): string | null {
    for (let i = 1; i < argv.length; i++) {
      const arg = argv[i]
      if (arg.startsWith('--')) continue
      if (isAbsolute(arg)) {
        try {
          if (statSync(arg).isFile()) return arg
        } catch { /* not a valid path */ }
      }
    }
    return null
  }

  function sendFileToRenderer(filePath: string): void {
    if (mainWindow?.webContents) {
      mainWindow.webContents.send('open-file', filePath)
    }
  }

  // Windows/Linux: second instance trying to open a file
  app.on('second-instance', (_event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    const filePath = getFilePathFromArgv(argv)
    if (filePath) sendFileToRenderer(filePath)
  })

  function createWindow(): void {
    const bounds = getStoreValue('windowBounds')

    mainWindow = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      minWidth: 800,
      minHeight: 600,
      title: 'Cursus',
      icon: join(__dirname, '../../build/icon.png'),
      show: false,
      webPreferences: {
        preload: join(__dirname, '../preload/preload.cjs'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false
      }
    })

    mainWindow.once('ready-to-show', () => {
      mainWindow?.show()
    })

    mainWindow.on('close', () => {
      if (mainWindow) {
        setStoreValue('windowBounds', mainWindow.getBounds())
      }
    })

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    const theme = getStoreValue('theme')
    nativeTheme.themeSource = theme

    if (process.env.ELECTRON_RENDERER_URL) {
      mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    buildMenu()
  }

  function buildMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu:new') },
          { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => mainWindow?.webContents.send('menu:open') },
          { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu:save') },
          { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow?.webContents.send('menu:save-as') },
          { type: 'separator' },
          { label: 'Export as PDF...', click: () => mainWindow?.webContents.send('menu:export-pdf') },
          { label: 'Export as DOCX...', click: () => mainWindow?.webContents.send('menu:export-docx') },
          { label: 'Export as Markdown...', click: () => mainWindow?.webContents.send('menu:export-md') },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Toggle Fullscreen', accelerator: 'F11', click: () => mainWindow?.webContents.send('menu:fullscreen') },
          { label: 'Toggle Theme', accelerator: 'CmdOrCtrl+Shift+T', click: () => mainWindow?.webContents.send('menu:theme') },
          { type: 'separator' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { role: 'resetZoom' },
          { type: 'separator' },
          { role: 'toggleDevTools' }
        ]
      },
      {
        label: 'AI',
        submenu: [
          { label: 'AI Settings...', accelerator: 'CmdOrCtrl+,', click: () => mainWindow?.webContents.send('menu:ai-settings') },
          { type: 'separator' },
          { label: 'Continue Writing', click: () => mainWindow?.webContents.send('menu:ai-continue') },
          { label: 'Improve', click: () => mainWindow?.webContents.send('menu:ai-improve') },
          { label: 'Proofread', click: () => mainWindow?.webContents.send('menu:ai-proofread') },
          { label: 'Translate...', click: () => mainWindow?.webContents.send('menu:ai-translate') }
        ]
      },
      {
        label: 'Help',
        submenu: [
          { label: 'User Guide', click: () => mainWindow?.webContents.send('menu:guide') },
          { label: 'About Cursus', click: () => mainWindow?.webContents.send('menu:about') }
        ]
      }
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }

  app.whenReady().then(() => {
    registerAllIpc()
    createWindow()

    // Check for file passed via argv at startup (Windows/Linux)
    const startupFile = getFilePathFromArgv(process.argv)
    if (startupFile) pendingFiles.push(startupFile)

    // Send pending files once renderer is ready
    if (pendingFiles.length > 0) {
      mainWindow?.webContents.on('did-finish-load', () => {
        for (const filePath of pendingFiles) {
          sendFileToRenderer(filePath)
        }
        pendingFiles.length = 0
      })
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}
