import { getStoreValue } from '../utils/store.ts'

export interface OllamaStatus {
  running: boolean
  models: string[]
}

export async function checkOllama(baseUrl?: string): Promise<OllamaStatus> {
  const url = baseUrl || getStoreValue('ollamaBaseUrl')
  try {
    const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return { running: false, models: [] }
    const data = await res.json() as { models?: { name: string }[] }
    return { running: true, models: data.models?.map(m => m.name) || [] }
  } catch {
    return { running: false, models: [] }
  }
}

export async function listOllamaModels(baseUrl?: string): Promise<string[]> {
  const url = baseUrl || getStoreValue('ollamaBaseUrl')
  try {
    const res = await fetch(`${url}/api/tags`)
    const data = await res.json() as { models?: { name: string }[] }
    return data.models?.map(m => m.name) || []
  } catch {
    return []
  }
}

export async function pullOllamaModel(model: string, baseUrl?: string): Promise<void> {
  const url = baseUrl || getStoreValue('ollamaBaseUrl')
  const res = await fetch(`${url}/api/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: model })
  })
  if (!res.ok) throw new Error(`Failed to pull model: ${res.statusText}`)
}

export async function* ollamaGenerate(model: string, prompt: string, baseUrl?: string): AsyncGenerator<string> {
  const url = baseUrl || getStoreValue('ollamaBaseUrl')
  const res = await fetch(`${url}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: true })
  })
  if (!res.ok) throw new Error(`AI generation failed: ${res.statusText}`)

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
          if (json.response) yield json.response
        } catch {
          // skip malformed lines
        }
      }
    }
  }
}
