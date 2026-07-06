import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  openFile: (filters?: { name: string; extensions: string[] }[]) =>
    ipcRenderer.invoke('dialog:open-file', { filters }),

  saveFile: (path: string, content: string, format: string) =>
    ipcRenderer.invoke('file:save', { path, content, format }),

  saveFileAs: (content: string, format: string, defaultName?: string) =>
    ipcRenderer.invoke('dialog:save-file', { defaultName, filters: [{ name: format.toUpperCase(), extensions: [format] }] })
      .then(async (savePath: string | null) => {
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

  getStore: (key: string) =>
    ipcRenderer.invoke('app:get-store', { key }),

  setStore: (key: string, value: unknown) =>
    ipcRenderer.invoke('app:set-store', { key, value }),

  getVersion: () =>
    ipcRenderer.invoke('app:get-version'),

  onMenuEvent: (channel: string, callback: (...args: unknown[]) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, handler)
    return () => ipcRenderer.removeListener(channel, handler)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
