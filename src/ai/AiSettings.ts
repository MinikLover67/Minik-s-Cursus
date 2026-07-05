export interface AiSettings {
  backend: 'ollama' | 'llamacpp' | 'custom'
  ollamaBaseUrl: string
  ollamaModel: string
  llamacppModelPath: string
  customEndpoint: string
  customApiKey: string
  customModel: string
  customPrompts: Record<string, string>
}

const defaultPrompts: Record<string, string> = {
  'continue': 'Continue the following text naturally and coherently:',
  'improve': 'Improve the writing quality, clarity and flow. Keep the meaning:',
  'proofread': 'Fix all grammar, spelling and punctuation errors:',
  'explain-code': 'Explain what this code does in detail:',
  'add-comments': 'Add helpful comments to this code:',
  'translate-en': 'Translate to English:',
  'translate-es': 'Translate to Spanish:',
  'translate-fr': 'Translate to French:',
  'translate-de': 'Translate to German:',
  'translate-zh': 'Translate to Chinese:'
}

export async function loadAiSettings(): Promise<AiSettings> {
  return {
    backend: (await window.electronAPI.getStore('aiBackend') as string) || 'ollama',
    ollamaBaseUrl: (await window.electronAPI.getStore('ollamaBaseUrl') as string) || 'http://localhost:11434',
    ollamaModel: (await window.electronAPI.getStore('ollamaModel') as string) || 'llama3.2:3b',
    llamacppModelPath: (await window.electronAPI.getStore('llamacppModelPath') as string) || '',
    customEndpoint: (await window.electronAPI.getStore('customAiEndpoint') as string) || '',
    customApiKey: (await window.electronAPI.getStore('customAiApiKey') as string) || '',
    customModel: (await window.electronAPI.getStore('customAiModel') as string) || '',
    customPrompts: (await window.electronAPI.getStore('customPrompts') as Record<string, string>) || defaultPrompts
  }
}

export async function saveAiSettings(settings: AiSettings): Promise<void> {
  await window.electronAPI.setStore('aiBackend', settings.backend)
  await window.electronAPI.setStore('ollamaBaseUrl', settings.ollamaBaseUrl)
  await window.electronAPI.setStore('ollamaModel', settings.ollamaModel)
  await window.electronAPI.setStore('llamacppModelPath', settings.llamacppModelPath)
  await window.electronAPI.setStore('customAiEndpoint', settings.customEndpoint)
  await window.electronAPI.setStore('customAiApiKey', settings.customApiKey)
  await window.electronAPI.setStore('customAiModel', settings.customModel)
  await window.electronAPI.setStore('customPrompts', settings.customPrompts)
}

export function getPrompts(): Record<string, string> {
  return defaultPrompts
}
