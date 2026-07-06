declare global {
  interface Window {
    electronAPI: {
      openFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>
      saveFile: (path: string, content: string, format: string) => Promise<boolean>
      saveFileAs: (content: string, format: string, defaultName?: string) => Promise<string | null>
      readFile: (path: string) => Promise<string>
      writeFile: (path: string, content: string) => Promise<boolean>
      fileExists: (path: string) => Promise<boolean>
      getRecentFiles: () => Promise<string[]>
      addRecentFile: (path: string) => Promise<void>
      openDirectory: () => Promise<string | null>
      checkOllama: (baseUrl?: string) => Promise<{ running: boolean; models: string[] }>
      ollamaModels: (baseUrl?: string) => Promise<string[]>
      ollamaPull: (model: string, baseUrl?: string) => Promise<void>
      ollamaGenerate: (model: string, prompt: string, baseUrl?: string) => Promise<{ text: string }>
      checkLmStudio: (baseUrl?: string) => Promise<{ running: boolean; models: string[] }>
      lmStudioModels: (baseUrl?: string) => Promise<string[]>
      lmStudioGenerate: (model: string, prompt: string, baseUrl?: string) => Promise<{ text: string }>
      getStore: (key: string) => Promise<unknown>
      setStore: (key: string, value: unknown) => Promise<void>
      getVersion: () => Promise<string>
      onMenuEvent: (channel: string, callback: (...args: unknown[]) => void) => () => void
      onOpenFile: (callback: (filePath: string) => void) => () => void
    }
  }
}

export {}
