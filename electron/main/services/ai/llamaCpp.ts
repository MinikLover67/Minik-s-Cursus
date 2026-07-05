import { getStoreValue } from '../utils/store.ts'

let llamaInstance: any = null
let currentModel: any = null

export async function initLlamaCpp(modelPath?: string): Promise<void> {
  const path = modelPath || getStoreValue('llamacppModelPath') as string
  if (!path) throw new Error('No model path configured')

  try {
    const { getLlama } = await import('node-llama-cpp')
    llamaInstance = await getLlama()
    currentModel = await llamaInstance.loadModel({ modelPath: path })
  } catch (err) {
    throw new Error(`Failed to load llama.cpp model: ${err}`)
  }
}

export async function* llamaCppGenerate(prompt: string): AsyncGenerator<string> {
  if (!currentModel) throw new Error('Model not loaded. Call initLlamaCpp first.')

  const context = await currentModel.createContext()
  const session = new (await import('node-llama-cpp')).LlamaChatSession({
    contextSequence: context.getSequence()
  })

  const response = await session.prompt(prompt)
  yield response
}

export function isLlamaCppReady(): boolean {
  return currentModel !== null
}
