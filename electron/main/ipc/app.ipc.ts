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

  ipcMain.handle('app:check-update', async () => {
    try {
      const res = await fetch('https://api.github.com/repos/MinikLover67/Minik-s-Cursus/releases/latest', {
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) return { available: false, error: 'Could not fetch release info' }
      const data = await res.json() as { tag_name: string; html_url: string }
      const latest = data.tag_name.replace(/^v/, '')
      const current = app.getVersion()
      const available = latest !== current
      return { available, version: latest, current, url: data.html_url }
    } catch (err: any) {
      return { available: false, error: err?.message || 'Network error' }
    }
  })
}
