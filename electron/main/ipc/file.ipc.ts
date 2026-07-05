import { ipcMain, dialog, BrowserWindow } from 'electron'
import fs from 'fs/promises'
import path from 'path'
import { getStoreValue, setStoreValue } from '../utils/store.ts'

export function registerFileIpc(): void {
  ipcMain.handle('dialog:open-file', async (_event, options) => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openFile'],
      filters: options?.filters
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('dialog:save-file', async (_event, options) => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showSaveDialog(win!, {
      defaultPath: options?.defaultName,
      filters: options?.filters
    })
    if (result.canceled) return null
    return result.filePath
  })

  ipcMain.handle('dialog:open-directory', async () => {
    const win = BrowserWindow.getFocusedWindow()
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory']
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('file:read', async (_event, filePath) => {
    return await fs.readFile(filePath, 'utf-8')
  })

  ipcMain.handle('file:write', async (_event, data) => {
    await fs.mkdir(path.dirname(data.path), { recursive: true })
    await fs.writeFile(data.path, data.content, 'utf-8')
    return true
  })

  ipcMain.handle('file:exists', async (_event, filePath) => {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  })

  ipcMain.handle('file:save', async (_event, data) => {
    try {
      await fs.mkdir(path.dirname(data.path), { recursive: true })
      await fs.writeFile(data.path, data.content, 'utf-8')
      addRecentFile(data.path)
      return true
    } catch {
      return false
    }
  })

  ipcMain.handle('file:get-recent', async () => {
    return getStoreValue('recentFiles')
  })

  ipcMain.handle('file:add-recent', async (_event, filePath) => {
    addRecentFile(filePath)
  })
}

function addRecentFile(filePath: string): void {
  const recent = getStoreValue('recentFiles').filter(f => f !== filePath)
  recent.unshift(filePath)
  if (recent.length > 20) recent.pop()
  setStoreValue('recentFiles', recent)
}
