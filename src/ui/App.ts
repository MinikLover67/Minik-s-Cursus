import type { CursusEditor } from '../editor/CursusEditor.ts'
import { setupTheme } from './ThemeManager.ts'
import { setupWelcomeGuide } from './WelcomeGuide.ts'
import { setupAiSettings } from './AiSettings.ts'
import { updateStatusBar, setupStatusBar } from './StatusBar.ts'
import { setupSidebar, updateRecentDisplay, openFileInEditor, showEditor, updateHomeRecentList } from './Sidebar.ts'
import { setupSelectionMenu } from './SelectionMenu.ts'

const fmtMap: Record<string, string> = {
  md: 'markdown', html: 'html', htm: 'html', txt: 'text', docx: 'docx',
  pdf: 'pdf', xlsx: 'xlsx', xls: 'xlsx', pptx: 'pptx', csv: 'csv', json: 'json',
  png: 'png', jpg: 'jpg', jpeg: 'jpg'
}

function detectFormat(p: string): string {
  const ext = p.split('.').pop()?.toLowerCase() || ''
  return fmtMap[ext] || ext
}

let isDirty = false
let autoSaveTimer: ReturnType<typeof setInterval> | null = null

function resetDirty(): void { isDirty = false }

function startAutoSave(editor: CursusEditor): void {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
  autoSaveTimer = setInterval(async () => {
    if (isDirty && editor.currentFile) {
      await window.electronAPI.saveFile(editor.currentFile, editor.getHTML(), editor.currentFormat)
      isDirty = false
    }
  }, 30000)
}

export function initUI(editor: CursusEditor): void {
  isDirty = false
  autoSaveTimer = null

  editor.callbacks = {
    ...editor.callbacks,
    onChange: () => { isDirty = true }
  }

  setupTheme()
  setupWelcomeGuide()
  setupAiSettings(editor)
  setupStatusBar(editor)
  setupSidebar(editor)
  setupMenuListeners(editor)
  setupDragAndDrop(editor)
  setupSelectionMenu(editor)

  document.getElementById('home-new')?.addEventListener('click', async () => {
    editor.clear()
    editor.currentFile = null
    editor.currentFormat = 'markdown'
    resetDirty()
    updateStatusBar(editor, 'No file open', 0)
    showEditor(editor)
  })

  document.getElementById('home-open')?.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile([
      { name: 'All Supported', extensions: ['md', 'html', 'txt', 'docx', 'pdf', 'xlsx', 'pptx', 'csv', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ])
    if (filePath) {
      await openFileInEditor(editor, filePath)
      startAutoSave(editor)
    }
  })

  document.getElementById('home-ai-settings')?.addEventListener('click', () => {
    document.getElementById('ai-settings-overlay')?.classList.remove('hidden')
  })

  document.getElementById('home-guide')?.addEventListener('click', () => {
    document.getElementById('welcome-overlay')?.classList.remove('hidden')
  })

  document.getElementById('home-theme')?.addEventListener('click', () => {
    document.getElementById('btn-theme')?.click()
  })

  window.electronAPI.onOpenFile(async (filePath: string) => {
    await openFileInEditor(editor, filePath)
    startAutoSave(editor)
  })

  updateHomeRecentList(editor)
}

function setupMenuListeners(editor: CursusEditor): void {
  const api = window.electronAPI

  api.onMenuEvent('menu:new', () => {
    editor.clear()
    editor.currentFile = null
    editor.currentFormat = 'markdown'
    resetDirty()
    if (autoSaveTimer) { clearInterval(autoSaveTimer); autoSaveTimer = null }
    updateStatusBar(editor, 'No file open', 0)
    showEditor(editor)
  })

  api.onMenuEvent('menu:open', async () => {
    const filePath = await api.openFile([
      { name: 'All Supported', extensions: ['md', 'html', 'txt', 'docx', 'pdf', 'xlsx', 'pptx', 'csv', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ])
    if (!filePath) return
    await openFileInEditor(editor, filePath)
    startAutoSave(editor)
  })

  api.onMenuEvent('menu:save', async () => {
    if (editor.currentFile) {
      await api.saveFile(editor.currentFile, editor.getHTML(), editor.currentFormat)
      resetDirty()
    } else {
      const savedPath = await api.saveFileAs(editor.getHTML(), editor.currentFormat)
      if (savedPath) {
        editor.currentFile = savedPath
        editor.currentFormat = detectFormat(savedPath)
        resetDirty()
        startAutoSave(editor)
        updateStatusBar(editor, savedPath, editor.getWordCount())
        updateRecentDisplay(editor)
      }
    }
  })

  api.onMenuEvent('menu:save-as', async () => {
    const savedPath = await api.saveFileAs(editor.getHTML(), editor.currentFormat)
    if (savedPath) {
      editor.currentFile = savedPath
      editor.currentFormat = detectFormat(savedPath)
      resetDirty()
      startAutoSave(editor)
      updateStatusBar(editor, savedPath, editor.getWordCount())
      updateRecentDisplay(editor)
    }
  })

  api.onMenuEvent('menu:fullscreen', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  })

  api.onMenuEvent('menu:theme', () => {
    document.getElementById('btn-theme')?.click()
  })

  api.onMenuEvent('menu:ai-settings', () => {
    document.getElementById('ai-settings-overlay')?.classList.remove('hidden')
  })

  api.onMenuEvent('menu:guide', () => {
    document.getElementById('welcome-overlay')?.classList.remove('hidden')
  })

  api.onMenuEvent('menu:export-pdf', async () => {
    const savedPath = await api.saveFileAs(editor.getHTML(), 'pdf')
    if (savedPath) window.alert('Exported to: ' + savedPath)
  })

  api.onMenuEvent('menu:export-docx', async () => {
    const savedPath = await api.saveFileAs(editor.getHTML(), 'docx')
    if (savedPath) window.alert('Exported to: ' + savedPath)
  })

  api.onMenuEvent('menu:export-md', async () => {
    const savedPath = await api.saveFileAs(editor.getHTML(), 'markdown')
    if (savedPath) {
      editor.currentFile = savedPath
      editor.currentFormat = detectFormat(savedPath)
      startAutoSave(editor)
    }
  })

  api.onMenuEvent('menu:about', async () => {
    const version = await api.getVersion()
    window.alert(`Cursus v${version} (Beta)
AI-powered rich text editor for students and teachers.

This is a development preview. Some features may be incomplete.
Bugs and issues are being actively fixed.

MIT License`)
  })
}

function setupDragAndDrop(editor: CursusEditor): void {
  const contentEl = document.getElementById('editor-content')
  if (!contentEl) return

  contentEl.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'copy'
  })

  contentEl.addEventListener('drop', async (e) => {
    e.preventDefault()
    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => { editor.editor.chain().focus().setImage({ src: reader.result as string }).run() }
        reader.readAsDataURL(file)
      } else {
        const path = (file as any).path
        if (path) await openFileInEditor(editor, path)
      }
    }
  })

  document.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()
        if (blob) {
          const reader = new FileReader()
          reader.onload = () => { editor.editor.chain().focus().setImage({ src: reader.result as string }).run() }
          reader.readAsDataURL(blob)
        }
      }
    }
  })
}
