import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  openFile: (filters?: { name: string; extensions: string[] }[]) =>
    ipcRenderer.invoke('dialog:open-file', { filters }),

  saveFile: (path: string, content: string, format: string) =>
    ipcRenderer.invoke('file:save', { path, content, format }),

  saveFileAs: (content: string, format: string, defaultName?: string) =>
    ipcRenderer.invoke('dialog:save-file', {
      defaultName: defaultName || 'untitled.md',
      filters: [
        { name: 'Markdown', extensions: ['md'] },
        { name: 'PDF Document', extensions: ['pdf'] },
        { name: 'Word Document', extensions: ['docx'] },
        { name: 'HTML', extensions: ['html'] },
        { name: 'Text File', extensions: ['txt'] },
        { name: 'PowerPoint', extensions: ['pptx'] },
        { name: 'PNG Image', extensions: ['png'] },
        { name: 'JPEG Image', extensions: ['jpg'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] },
      ]
    }).then(async (savePath: string | null) => {
      if (savePath) {
        await ipcRenderer.invoke('file:write', { path: savePath, content })
        return savePath
      }
      return null
    }),

  readFile: (path: string) =>
    ipcRenderer.invoke('file:read', path),

  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke('file:write', { path, content }),

  fileExists: (path: string) =>
    ipcRenderer.invoke('file:exists', path),

  getRecentFiles: () =>
    ipcRenderer.invoke('file:get-recent'),

  addRecentFile: (path: string) =>
    ipcRenderer.invoke('file:add-recent', path),

  openDirectory: () =>
    ipcRenderer.invoke('dialog:open-directory'),

  checkOllama: (baseUrl?: string) =>
    ipcRenderer.invoke('ai:check-ollama', baseUrl),

  ollamaModels: (baseUrl?: string) =>
    ipcRenderer.invoke('ai:ollama-models', { baseUrl }),

  ollamaPull: (model: string, baseUrl?: string) =>
    ipcRenderer.invoke('ai:ollama-pull', { model, baseUrl }),

  ollamaGenerate: (model: string, prompt: string, baseUrl?: string) =>
    ipcRenderer.invoke('ai:ollama-generate', { model, prompt, baseUrl }),

  checkLmStudio: (baseUrl?: string) =>
    ipcRenderer.invoke('ai:check-lmstudio', baseUrl),

  lmStudioModels: (baseUrl?: string) =>
    ipcRenderer.invoke('ai:lmstudio-models', baseUrl),

  lmStudioGenerate: (model: string, prompt: string, baseUrl?: string) =>
    ipcRenderer.invoke('ai:lmstudio-generate', { model, prompt, baseUrl }),

  getStore: (key: string) =>
    ipcRenderer.invoke('app:get-store', { key }),

  setStore: (key: string, value: unknown) =>
    ipcRenderer.invoke('app:set-store', { key, value }),

  getVersion: () =>
    ipcRenderer.invoke('app:get-version'),

  startAiStream: (backend: string, model: string, prompt: string) =>
    ipcRenderer.invoke('ai:start-stream', { backend, model, prompt }),

  ensureOllama: () =>
    ipcRenderer.invoke('ai:ensure-ollama'),

  findOllama: () =>
    ipcRenderer.invoke('ai:find-ollama'),

  stopOllama: () =>
    ipcRenderer.invoke('ai:stop-ollama'),

  cancelAiStream: () =>
    ipcRenderer.invoke('ai:cancel-stream'),

  onAiToken: (callback: (token: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, token: string) => callback(token)
    ipcRenderer.on('ai:stream-token', handler)
    return () => ipcRenderer.removeListener('ai:stream-token', handler)
  },

  onAiDone: (callback: () => void) => {
    const handler = () => callback()
    ipcRenderer.on('ai:stream-done', handler)
    return () => ipcRenderer.removeListener('ai:stream-done', handler)
  },

  onMenuEvent: (channel: string, callback: (...args: unknown[]) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, handler)
    return () => ipcRenderer.removeListener(channel, handler)
  },

  onOpenFile: (callback: (filePath: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, filePath: string) => callback(filePath)
    ipcRenderer.on('open-file', handler)
    return () => ipcRenderer.removeListener('open-file', handler)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
