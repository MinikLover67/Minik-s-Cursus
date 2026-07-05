import type { CursusEditor } from '../editor/CursusEditor.ts'

export function setupSidebar(editor: CursusEditor): void {
  const btnNew = document.getElementById('btn-new')
  const btnOpen = document.getElementById('btn-open')

  btnNew?.addEventListener('click', () => {
    editor.clear()
    editor.currentFile = null
    editor.currentFormat = 'markdown'
    updateRecentDisplay()
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
        editor.setContent(content)
        editor.currentFile = filePath
        window.electronAPI.addRecentFile(filePath)
        updateRecentDisplay()
      }
    }
  })

  updateRecentDisplay()
}

function updateRecentDisplay(): void {
  const container = document.getElementById('recent-files')
  if (!container) return

  window.electronAPI.getRecentFiles().then((files) => {
    container.innerHTML = ''
    for (const file of files.slice(0, 10)) {
      const item = document.createElement('div')
      item.className = 'recent-file-item'
      const name = file.split(/[\\/]/).pop() || file
      item.textContent = name
      item.title = file
      item.addEventListener('click', async () => {
        const content = await window.electronAPI.readFile(file)
        if (content) {
          const event = new CustomEvent('open-file', { detail: { path: file, content } })
          document.dispatchEvent(event)
        }
      })
      container.appendChild(item)
    }
  })
}
