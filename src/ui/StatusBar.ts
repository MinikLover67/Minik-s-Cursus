import type { CursusEditor } from '../editor/CursusEditor.ts'

export function updateStatusBar(editor: CursusEditor, filePath: string, wordCount: number): void {
  const fileEl = document.getElementById('status-file')
  const wordsEl = document.getElementById('status-words')
  if (fileEl) fileEl.textContent = filePath || 'No file open'
  if (wordsEl) wordsEl.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`
}

export function setupStatusBar(editor: CursusEditor): void {
  const aiStatus = document.getElementById('status-ai')

  window.electronAPI.checkOllama().then((status) => {
    if (aiStatus) {
      aiStatus.textContent = status.running
        ? `AI: Ollama (${status.models.length} models)`
        : 'AI: Ollama not running'
      aiStatus.style.color = status.running ? 'var(--primary)' : 'var(--text-muted)'
    }
  }).catch(() => {
    if (aiStatus) {
      aiStatus.textContent = 'AI: unavailable'
      aiStatus.style.color = 'var(--text-muted)'
    }
  })
}
