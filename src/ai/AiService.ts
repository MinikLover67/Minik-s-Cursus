export interface AiCallbacks {
  onStart?: () => void
  onToken?: (token: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}

export class AiService {
  private isGenerating = false

  async generate(task: string, selectedText: string, callbacks: AiCallbacks = {}): Promise<string> {
    if (this.isGenerating) return ''
    this.isGenerating = true
    callbacks.onStart?.()

    try {
      const backend = await window.electronAPI.getStore('aiBackend') as string
      const model = await window.electronAPI.getStore('ollamaModel') as string
      const baseUrl = await window.electronAPI.getStore('ollamaBaseUrl') as string

      if (backend === 'ollama') {
        const prompts: Record<string, string> = {
          'continue': `Continue the following text naturally:\n\n${selectedText}`,
          'improve': `Improve this text:\n\n${selectedText}`,
          'proofread': `Fix grammar and spelling:\n\n${selectedText}`,
          'explain-code': `Explain this code:\n\n${selectedText}`,
          'add-comments': `Add comments to this code:\n\n${selectedText}`
        }
        const prompt = prompts[task] || selectedText
        let fullText = ''

        for await (const token of generateOllama(model, prompt, baseUrl)) {
          fullText += token
          callbacks.onToken?.(token)
        }

        callbacks.onComplete?.(fullText)
        return fullText
      }
    } catch (err) {
      callbacks.onError?.(err as Error)
      return ''
    } finally {
      this.isGenerating = false
    }

    return ''
  }

  getIsGenerating(): boolean {
    return this.isGenerating
  }
}

async function* generateOllama(model: string, prompt: string, baseUrl: string): AsyncGenerator<string> {
  const result = await window.electronAPI.ollamaGenerate(model, prompt, baseUrl)
  if (!result.stream) return

  const reader = result.stream.getReader()
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
          // skip
        }
      }
    }
  }
}
