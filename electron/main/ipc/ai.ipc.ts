import { ipcMain } from 'electron'
import { getStoreValue } from '../utils/store.ts'

export function registerAiIpc(): void {
  // ── Ollama ──
  ipcMain.handle('ai:check-ollama', async (_event, options?) => {
    const url = (typeof options === 'string' ? options : options?.baseUrl) || getStoreValue('ollamaBaseUrl')
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
        stream: false
      })
    })
    if (!res.ok) throw new Error(`AI generation failed: ${res.statusText}`)
    const data = await res.json() as { response?: string }
    return { text: data.response || '' }
  })

  // ── LM Studio ──
  ipcMain.handle('ai:check-lmstudio', async (_event, baseUrl?: string) => {
    const url = baseUrl || getStoreValue('lmstudioBaseUrl')
    try {
      const res = await fetch(`${url}/v1/models`, { signal: AbortSignal.timeout(3000) })
      if (!res.ok) return { running: false, models: [] }
      const data = await res.json() as { data?: { id: string }[] }
      return { running: true, models: data.data?.map(m => m.id) || [] }
    } catch {
      return { running: false, models: [] }
    }
  })

  ipcMain.handle('ai:lmstudio-models', async (_event, baseUrl?: string) => {
    const url = baseUrl || getStoreValue('lmstudioBaseUrl')
    try {
      const res = await fetch(`${url}/v1/models`)
      const data = await res.json() as { data?: { id: string }[] }
      return data.data?.map(m => m.id) || []
    } catch {
      return []
    }
  })

  ipcMain.handle('ai:lmstudio-generate', async (_event, options) => {
    const url = options.baseUrl || getStoreValue('lmstudioBaseUrl')
    const res = await fetch(`${url}/v1/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model,
        prompt: options.prompt,
        max_tokens: 2048,
        temperature: 0.7,
        stream: false
      })
    })
    if (!res.ok) throw new Error(`LM Studio generation failed: ${res.statusText}`)
    const data = await res.json() as { choices?: { text: string }[] }
    return { text: data.choices?.[0]?.text || '' }
  })
}
