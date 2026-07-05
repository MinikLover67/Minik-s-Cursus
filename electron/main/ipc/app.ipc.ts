import { ipcMain } from 'electron'
import { getStoreValue, setStoreValue } from '../utils/store.ts'
import { app } from 'electron'

export function registerAppIpc(): void {
  ipcMain.handle('app:get-path', async (_event, options) => {
    return app.getPath(options.name as any)
  })

  ipcMain.handle('app:get-store', async (_event, options) => {
    return getStoreValue(options.key as any)
  })

  ipcMain.handle('app:set-store', async (_event, options) => {
    setStoreValue(options.key as any, options.value)
  })

  ipcMain.handle('app:get-version', async () => {
    return app.getVersion()
  })
}
