import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

const dataDir = join(app.getPath('userData'), 'cursus-data')
const configFile = join(dataDir, 'config.json')

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

let cached: StoreSchema | null = null

function load(): StoreSchema {
  if (cached) return cached
  try {
    if (existsSync(configFile)) {
      const raw = readFileSync(configFile, 'utf-8')
      cached = { ...defaults, ...JSON.parse(raw) }
    } else {
      cached = { ...defaults }
    }
  } catch {
    cached = { ...defaults }
  }
  return cached
}

function save(): void {
  if (!cached) return
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
    writeFileSync(configFile, JSON.stringify(cached, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save config:', err)
  }
}

export function getStoreValue<K extends keyof StoreSchema>(key: K): StoreSchema[K] {
  return load()[key]
}

export function setStoreValue<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
  const data = load()
  data[key] = value
  save()
}
