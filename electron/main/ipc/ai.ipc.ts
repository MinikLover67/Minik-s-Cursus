import { ipcMain, BrowserWindow } from 'electron'
import { getStoreValue } from '../utils/store.ts'
import { ensureOllama, findOllama, stopOllama } from '../ollama-manager.ts'

let currentAbort: AbortController | null = null

export function registerAiIpc(): void {
  ipcMain.handle('ai:ensure-ollama', async () => {
    return ensureOllama()
  })

  ipcMain.handle('ai:find-ollama', async () => {
    return findOllama()
  })

  ipcMain.handle('ai:stop-ollama', async () => {
    stopOllama()
  })

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

  // ── Streaming AI (for autocomplete) ──
  ipcMain.handle('ai:start-stream', async (event, options) => {
    currentAbort?.abort()
    currentAbort = new AbortController()
    const { backend, model, prompt } = options
    const win = BrowserWindow.fromWebContents(event.sender)

    try {
      if (backend === 'ollama') {
        const baseUrl = getStoreValue('ollamaBaseUrl')
        const res = await fetch(`${baseUrl}/api/generate`, {
          signal: currentAbort.signal,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt, stream: true })
        })
        if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`)
        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response body')
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          for (const line of lines) {
            if (line.trim()) {
              try {
                const json = JSON.parse(line)
                if (json.response) {
                  win?.webContents.send('ai:stream-token', json.response)
                }
              } catch { /* skip */ }
            }
          }
        }
      } else if (backend === 'lmstudio') {
        const baseUrl = getStoreValue('lmstudioBaseUrl')
        const res = await fetch(`${baseUrl}/v1/completions`, {
          signal: currentAbort.signal,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model, prompt,
            max_tokens: 256,
            temperature: 0.5,
            stream: true
          })
        })
        if (!res.ok) throw new Error(`LM Studio error: ${res.statusText}`)
        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response body')
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6)
              if (data === '[DONE]') break
              try {
                const json = JSON.parse(data)
                const text = json.choices?.[0]?.text || json.choices?.[0]?.delta?.content || ''
                if (text) win?.webContents.send('ai:stream-token', text)
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      win?.webContents.send('ai:stream-token', `\n[Error: ${err?.message || 'AI request failed'}]`)
    } finally {
      currentAbort = null
      win?.webContents.send('ai:stream-done')
    }
  })

  ipcMain.handle('ai:cancel-stream', async () => {
    currentAbort?.abort()
    currentAbort = null
  })
}
