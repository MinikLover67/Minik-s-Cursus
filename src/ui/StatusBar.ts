import type { CursusEditor } from '../editor/CursusEditor.ts'

export function updateStatusBar(editor: CursusEditor, filePath: string, wordCount: number): void {
  const fileEl = document.getElementById('status-file')
  const wordsEl = document.getElementById('status-words')
  if (fileEl) fileEl.textContent = filePath || 'No file open'
  if (wordsEl) wordsEl.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`
}

export function setupStatusBar(_editor: CursusEditor): void {
}

export function destroyStatusBar(): void {
}
