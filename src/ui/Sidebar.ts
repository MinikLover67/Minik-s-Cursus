import type { CursusEditor } from '../editor/CursusEditor.ts'
import { updateStatusBar } from './StatusBar.ts'

export function setupSidebar(editor: CursusEditor): void {
  const btnNew = document.getElementById('btn-new')
  const btnOpen = document.getElementById('btn-open')

  btnNew?.addEventListener('click', () => {
    editor.clear()
    editor.currentFile = null
    editor.currentFormat = 'markdown'
    updateRecentDisplay(editor)
    updateStatusBar(editor, 'No file open', 0)
    editor.focus()
  })

  btnOpen?.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile([
      { name: 'All Supported', extensions: ['md', 'html', 'txt', 'docx', 'pdf', 'xlsx', 'pptx', 'csv', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ])
    if (filePath) {
      const content = await window.electronAPI.readFile(filePath)
      if (content) {
        const ext = filePath.split('.').pop()?.toLowerCase() || ''
        editor.currentFile = filePath
        editor.currentFormat = ext === 'md' ? 'markdown' : ext
        editor.setContent(content)
        window.electronAPI.addRecentFile(filePath)
        updateRecentDisplay(editor)
        updateStatusBar(editor, filePath, editor.getWordCount())
      }
    }
  })

  updateRecentDisplay(editor)
}

async function updateRecentDisplay(editor: CursusEditor): Promise<void> {
  const container = document.getElementById('recent-files')
  if (!container) return

  const files = await window.electronAPI.getRecentFiles()
  container.innerHTML = ''

  for (const file of (files || []).slice(0, 10)) {
    const item = document.createElement('div')
    item.className = 'recent-file-item'
    const name = file.split(/[\\/]/).pop() || file
    item.textContent = name
    item.title = file
    item.addEventListener('click', async () => {
      const content = await window.electronAPI.readFile(file)
      if (content) {
        const ext = file.split('.').pop()?.toLowerCase() || ''
        editor.currentFile = file
        editor.currentFormat = ext === 'md' ? 'markdown' : ext
        editor.setContent(content)
        updateStatusBar(editor, file, editor.getWordCount())
        editor.focus()
      }
    })
    container.appendChild(item)
  }
}
