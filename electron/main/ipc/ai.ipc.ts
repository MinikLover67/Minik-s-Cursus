import { ipcMain } from 'electron'
import { getStoreValue } from '../utils/store.ts'

export function registerAiIpc(): void {
  ipcMain.handle('ai:check-ollama', async (_event, baseUrl?: string) => {
    const url = baseUrl || getStoreValue('ollamaBaseUrl')
    try {
      const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(3000) })
      if (!res.ok) return { running: false, models: [] }
      const data = await res.json() as { models?: { name: string }[] }
      return { running: true, models: data.models?.map(m => m.name) || [] }
    } catch {
      return { running: false, models: [] }
    }
  })

  ipcMain.handle('ai:ollama-models', async (_event, options?) => {
    const url = options?.baseUrl || getStoreValue('ollamaBaseUrl')
    try {
      const res = await fetch(`${url}/api/tags`)
      const data = await res.json() as { models?: { name: string }[] }
      return data.models?.map(m => m.name) || []
    } catch {
      return []
    }
  })

  ipcMain.handle('ai:ollama-pull', async (_event, options) => {
    const url = options.baseUrl || getStoreValue('ollamaBaseUrl')
    const res = await fetch(`${url}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: options.model })
    })
    if (!res.ok) throw new Error(`Failed to pull model: ${res.statusText}`)
  })

  ipcMain.handle('ai:ollama-generate', async (_event, options) => {
    const url = options.baseUrl || getStoreValue('ollamaBaseUrl')
    const res = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model,
        prompt: options.prompt,
        stream: true
      })
    })
    if (!res.ok) throw new Error(`AI generation failed: ${res.statusText}`)
    return { stream: res.body }
  })
}
