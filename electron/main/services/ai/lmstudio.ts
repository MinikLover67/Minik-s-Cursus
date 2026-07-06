import { getStoreValue } from '../utils/store.ts'

export async function checkLmStudio(baseUrl?: string): Promise<{ running: boolean; models: string[] }> {
  const url = baseUrl || getStoreValue('lmstudioBaseUrl')
  try {
    const res = await fetch(`${url}/v1/models`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return { running: false, models: [] }
    const data = await res.json() as { data?: { id: string }[] }
    return { running: true, models: data.data?.map(m => m.id) || [] }
  } catch {
    return { running: false, models: [] }
  }
}

export async function listLmStudioModels(baseUrl?: string): Promise<string[]> {
  const url = baseUrl || getStoreValue('lmstudioBaseUrl')
  try {
    const res = await fetch(`${url}/v1/models`)
    const data = await res.json() as { data?: { id: string }[] }
    return data.data?.map(m => m.id) || []
  } catch {
    return []
  }
}

export async function lmStudioGenerate(model: string, prompt: string, baseUrl?: string): Promise<{ text: string }> {
  const url = baseUrl || getStoreValue('lmstudioBaseUrl')
  const res = await fetch(`${url}/v1/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      max_tokens: 2048,
      temperature: 0.7,
      stream: false
    })
  })
  if (!res.ok) throw new Error(`LM Studio generation failed: ${res.statusText}`)
  const data = await res.json() as { choices?: { text: string }[] }
  return { text: data.choices?.[0]?.text || '' }
}
