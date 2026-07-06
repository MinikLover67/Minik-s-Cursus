import type { CursusEditor } from '../editor/CursusEditor.ts'
import { updateStatusBar } from './StatusBar.ts'

const formatMap: Record<string, string> = {
  md: 'markdown', html: 'html', htm: 'html', txt: 'text', docx: 'docx',
  pdf: 'pdf', xlsx: 'xlsx', xls: 'xlsx', pptx: 'pptx', csv: 'csv', json: 'json'
}

export function setupSidebar(editor: CursusEditor): void {
  document.getElementById('btn-home')?.addEventListener('click', () => {
    document.getElementById('home-screen')?.classList.remove('hidden')
    document.getElementById('editor-screen')?.classList.add('hidden')
    updateHomeRecentList(editor)
  })

  document.getElementById('btn-new')?.addEventListener('click', async () => {
    editor.clear()
    editor.currentFile = null
    editor.currentFormat = 'markdown'
    document.getElementById('status-file')!.textContent = 'No file open'
    document.getElementById('status-words')!.textContent = '0 words'
    editor.focus()
  })

  document.getElementById('btn-open')?.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile([
      { name: 'All Supported', extensions: ['md', 'html', 'txt', 'docx', 'pdf', 'xlsx', 'pptx', 'csv', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ])
    if (filePath) {
      await openFileInEditor(editor, filePath)
    }
  })

  updateRecentDisplay(editor)
}

export async function openFileInEditor(editor: CursusEditor, filePath: string): Promise<void> {
  const content = await window.electronAPI.readFile(filePath)
  if (!content) return

  const ext = filePath.split('.').pop()?.toLowerCase() || ''
  const format = formatMap[ext] || 'unknown'
  editor.currentFile = filePath
  editor.currentFormat = format

  if (format === 'markdown' || format === 'html' || format === 'text' || format === 'json' || format === 'csv') {
    editor.setContent(content)
  } else {
    editor.setContent('<p>' + content.substring(0, 5000) + '</p>')
  }

  await window.electronAPI.addRecentFile(filePath)
  updateRecentDisplay(editor)
  updateStatusBar(editor, filePath, editor.getWordCount())

  document.getElementById('home-screen')?.classList.add('hidden')
  document.getElementById('editor-screen')?.classList.remove('hidden')
  editor.focus()
}

export async function updateRecentDisplay(editor: CursusEditor): Promise<void> {
  const list = document.getElementById('recent-files')
  if (!list) return
  const files = await window.electronAPI.getRecentFiles()
  list.innerHTML = ''
  if (files.length === 0) {
    list.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; padding: 8px;">No recent files</p>'
    return
  }
  for (const file of files.slice(0, 10)) {
    const name = file.split(/[/\\]/).pop() || file
    const item = document.createElement('div')
    item.className = 'recent-file-item'
    item.textContent = name
    item.title = file
    item.addEventListener('click', async () => {
      await openFileInEditor(editor, file)
    })
    list.appendChild(item)
  }
}

export function showEditor(editor: CursusEditor): void {
  document.getElementById('home-screen')?.classList.add('hidden')
  document.getElementById('editor-screen')?.classList.remove('hidden')
  updateRecentDisplay(editor)
  editor.focus()
}

export async function updateHomeRecentList(editor: CursusEditor): Promise<void> {
  const list = document.getElementById('home-recent-list')
  if (!list) return
  const files = await window.electronAPI.getRecentFiles()
  list.innerHTML = ''
  if (files.length === 0) {
    list.innerHTML = '<p class="home-empty">No recent files</p>'
    return
  }
  for (const file of files.slice(0, 10)) {
    const name = file.split(/[/\\]/).pop() || file
    const ext = file.split('.').pop()?.toLowerCase() || ''
    const item = document.createElement('div')
    item.className = 'home-recent-item'
    const icon = getFileIcon(ext)
    item.innerHTML = `<span class="home-recent-icon">${icon}</span><span class="home-recent-name">${name}</span><span class="home-recent-path">${file}</span>`
    item.addEventListener('click', async () => {
      await openFileInEditor(editor, file)
    })
    list.appendChild(item)
  }
}

function getFileIcon(ext: string): string {
  const icons: Record<string, string> = {
    md: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="14 2 14 8 20 8"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="16" x2="14" y2="16"/><path d="M6 2H14l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>',
    docx: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15c-1 1-1 2-1 3s1 1 2 1 2-1 2-2c0-2-2-3-3-4s-1-2 0-3 2-1 3 0"/></svg>',
    html: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  }
  return icons[ext] || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
}
