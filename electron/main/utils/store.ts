import Store from 'electron-store'

interface StoreSchema {
  theme: 'light' | 'dark'
  language: string
  recentFiles: string[]
  windowBounds: { x: number; y: number; width: number; height: number }
  welcomeShown: boolean
  aiBackend: 'ollama' | 'llamacpp' | 'custom'
  ollamaBaseUrl: string
  ollamaModel: string
  llamacppModelPath: string
  customAiEndpoint: string
  customAiApiKey: string
  customAiModel: string
  customPrompts: Record<string, string>
}

const defaults: StoreSchema = {
  theme: 'light',
  language: 'en',
  recentFiles: [],
  windowBounds: { x: 100, y: 100, width: 1200, height: 800 },
  welcomeShown: false,
  aiBackend: 'ollama',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.2:3b',
  llamacppModelPath: '',
  customAiEndpoint: '',
  customAiApiKey: '',
  customAiModel: '',
  customPrompts: {}
}

export const store = new Store<StoreSchema>({ defaults })

export function getStoreValue<K extends keyof StoreSchema>(key: K): StoreSchema[K] {
  return store.get(key)
}

export function setStoreValue<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
  store.set(key, value)
}
