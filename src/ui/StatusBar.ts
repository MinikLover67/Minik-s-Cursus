import type { CursusEditor } from '../editor/CursusEditor.ts'

export function updateStatusBar(editor: CursusEditor, filePath: string, wordCount: number): void {
  const fileEl = document.getElementById('status-file')
  const wordsEl = document.getElementById('status-words')
  if (fileEl) fileEl.textContent = filePath || 'No file open'
  if (wordsEl) wordsEl.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`
}

export function setupStatusBar(_editor: CursusEditor): void {
  const aiStatus = document.getElementById('status-ai')
  if (!aiStatus) return

  window.electronAPI.getStore('aiBackend').then(async (backend: any) => {
    if (backend === 'lmstudio') {
      try {
        const result = await window.electronAPI.checkLmStudio()
        aiStatus.textContent = result.running
          ? `AI: LM Studio (${result.models.length} models)`
          : 'AI: LM Studio not running'
        aiStatus.style.color = result.running ? 'var(--primary)' : 'var(--text-muted)'
      } catch {
        aiStatus.textContent = 'AI: unavailable'
        aiStatus.style.color = 'var(--text-muted)'
      }
    } else {
      try {
        const result = await window.electronAPI.checkOllama()
        aiStatus.textContent = result.running
          ? `AI: Ollama (${result.models.length} models)`
          : 'AI: Ollama not running'
        aiStatus.style.color = result.running ? 'var(--primary)' : 'var(--text-muted)'
      } catch {
        aiStatus.textContent = 'AI: unavailable'
        aiStatus.style.color = 'var(--text-muted)'
      }
    }
  }).catch(() => {
    aiStatus.textContent = 'AI: unavailable'
    aiStatus.style.color = 'var(--text-muted)'
  })
}
