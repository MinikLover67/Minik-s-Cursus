import type { CursusEditor } from '../editor/CursusEditor.ts'

let statusInterval: ReturnType<typeof setInterval> | null = null
let aiStatusEl: HTMLElement | null = null

export function updateStatusBar(editor: CursusEditor, filePath: string, wordCount: number): void {
  const fileEl = document.getElementById('status-file')
  const wordsEl = document.getElementById('status-words')
  if (fileEl) fileEl.textContent = filePath || 'No file open'
  if (wordsEl) wordsEl.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`
}

async function pollAiStatus(): Promise<void> {
  if (!aiStatusEl) return
  const backend = await window.electronAPI.getStore('aiBackend') as string | undefined

  if (backend === 'lmstudio') {
    try {
      const result = await window.electronAPI.checkLmStudio()
      aiStatusEl.textContent = result.running
        ? `AI: LM Studio (${result.models.length} models)`
        : 'AI: LM Studio not running'
      aiStatusEl.style.color = result.running ? 'var(--primary)' : 'var(--text-muted)'
    } catch {
      aiStatusEl.textContent = 'AI: unavailable'
      aiStatusEl.style.color = 'var(--text-muted)'
    }
    return
  }

  try {
    const result = await window.electronAPI.checkOllama()
    if (result.running) {
      aiStatusEl.textContent = `AI: Ollama (${result.models.length} models)`
      aiStatusEl.style.color = 'var(--primary)'
    } else {
      aiStatusEl.textContent = 'AI: Ollama starting…'
      aiStatusEl.style.color = 'var(--text-muted)'
      window.electronAPI.ensureOllama().then((started) => {
        if (!aiStatusEl) return
        if (started.running) {
          aiStatusEl.textContent = `AI: Ollama ready`
          aiStatusEl.style.color = 'var(--primary)'
        } else {
          const path = window.electronAPI.findOllama()
          aiStatusEl.textContent = path ? 'AI: Ollama failed to start' : 'AI: Ollama not found'
          aiStatusEl.style.color = 'var(--text-muted)'
        }
      })
    }
  } catch {
    aiStatusEl.textContent = 'AI: unavailable'
    aiStatusEl.style.color = 'var(--text-muted)'
  }
}

export function setupStatusBar(_editor: CursusEditor): void {
  aiStatusEl = document.getElementById('status-ai')
  if (!aiStatusEl) return

  pollAiStatus()
  if (statusInterval) clearInterval(statusInterval)
  statusInterval = setInterval(pollAiStatus, 15000)
}

export function destroyStatusBar(): void {
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
}
