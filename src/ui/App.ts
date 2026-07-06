import type { CursusEditor } from '../editor/CursusEditor.ts'
import { setupTheme } from './ThemeManager.ts'
import { setupWelcomeGuide } from './WelcomeGuide.ts'
import { setupAiSettings } from './AiSettings.ts'
import { updateStatusBar, setupStatusBar } from './StatusBar.ts'
import { setupSidebar } from './Sidebar.ts'

export async function initUI(editor: CursusEditor): Promise<void> {
  await setupTheme()
  setupWelcomeGuide()
  setupAiSettings(editor)
  setupStatusBar(editor)
  setupSidebar(editor)
  setupMenuListeners(editor)
  setupKeyboardShortcuts(editor)
  setupDragAndDrop(editor)
}

function setupMenuListeners(editor: CursusEditor): void {
  const api = window.electronAPI

  api.onMenuEvent('menu:new', () => {
    editor.clear()
    editor.currentFile = null
    editor.currentFormat = 'markdown'
    updateStatusBar(editor, 'No file open', 0)
    editor.focus()
  })

  api.onMenuEvent('menu:open', async () => {
    const filePath = await api.openFile([
      { name: 'All Supported', extensions: ['md', 'html', 'txt', 'docx', 'pdf', 'xlsx', 'pptx', 'csv', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ])
    if (!filePath) return
    await openFileInEditor(editor, filePath)
  })

  api.onMenuEvent('menu:save', async () => {
    if (editor.currentFile) {
      const content = editor.getHTML()
      await api.saveFile(editor.currentFile, content, editor.currentFormat)
    } else {
      const savedPath = await api.saveFileAs(editor.getHTML(), editor.currentFormat)
      if (savedPath) {
        editor.currentFile = savedPath
        updateStatusBar(editor, savedPath, editor.getWordCount())
      }
    }
  })

  api.onMenuEvent('menu:save-as', async () => {
    const content = editor.getHTML()
    const savedPath = await api.saveFileAs(content, editor.currentFormat)
    if (savedPath) {
      editor.currentFile = savedPath
      updateStatusBar(editor, savedPath, editor.getWordCount())
    }
  })

  api.onMenuEvent('menu:fullscreen', () => {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
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
    const content = editor.getHTML()
    const savedPath = await api.saveFileAs(content, 'pdf')
    if (savedPath) window.alert('Exported to: ' + savedPath)
  })

  api.onMenuEvent('menu:export-docx', async () => {
    const content = editor.getHTML()
    const savedPath = await api.saveFileAs(content, 'docx')
    if (savedPath) window.alert('Exported to: ' + savedPath)
  })

  api.onMenuEvent('menu:export-md', async () => {
    const content = editor.getHTML()
    const savedPath = await api.saveFileAs(content, 'markdown')
    if (savedPath) {
      editor.currentFile = savedPath
      editor.currentFormat = 'markdown'
    }
  })

  api.onMenuEvent('menu:about', async () => {
    const version = await api.getVersion()
    window.alert(`Cursus v${version}\n\nAI-powered rich text editor for students and teachers.\n\nMIT License`)
  })
}

async function openFileInEditor(editor: CursusEditor, filePath: string): Promise<void> {
  const content = await window.electronAPI.readFile(filePath)
  if (!content) return

  const ext = filePath.split('.').pop()?.toLowerCase() || ''
  const formatMap: Record<string, string> = {
    md: 'markdown', html: 'html', htm: 'html', txt: 'text', docx: 'docx',
    pdf: 'pdf', xlsx: 'xlsx', xls: 'xlsx', pptx: 'pptx', csv: 'csv', json: 'json'
  }
  const format = formatMap[ext] || 'unknown'
  editor.currentFile = filePath
  editor.currentFormat = format

  if (format === 'markdown' || format === 'html' || format === 'text' || format === 'json' || format === 'csv') {
    editor.setContent(content)
  } else if (format === 'docx') {
    editor.setContent('<p><em>DOCX imported. Edit as rich text below:</em></p><p>' + content.substring(0, 5000) + '</p>')
  } else if (format === 'pdf') {
    editor.setContent('<p><em>PDF imported:</em></p><p>' + content.substring(0, 5000) + '</p>')
  } else if (format === 'xlsx') {
    editor.setContent('<p><em>Spreadsheet imported:</em></p><p>' + content.substring(0, 5000) + '</p>')
  } else {
    editor.setContent('<p>' + content.substring(0, 5000) + '</p>')
  }

  window.electronAPI.addRecentFile(filePath)
  updateStatusBar(editor, filePath, editor.getWordCount())
  editor.focus()
}

function setupKeyboardShortcuts(editor: CursusEditor): void {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault()
          if (e.shiftKey) {
            api().saveFileAs(editor.getHTML(), editor.currentFormat)
          } else if (editor.currentFile) {
            api().saveFile(editor.currentFile, editor.getHTML(), editor.currentFormat)
          } else {
            api().saveFileAs(editor.getHTML(), editor.currentFormat)
          }
          break
        case 'o':
          e.preventDefault()
          document.getElementById('btn-open')?.click()
          break
        case 'n':
          e.preventDefault()
          document.getElementById('btn-new')?.click()
          break
      }
    }
  })
}

function api() {
  return window.electronAPI
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
        reader.onload = () => {
          editor.editor.chain().focus().setImage({ src: reader.result as string }).run()
        }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file)
        editor.editor.commands.insertContent(`<video controls src="${url}" style="max-width:100%"></video>`)
      } else {
        const path = (file as any).path
        if (path) {
          await openFileInEditor(editor, path)
        }
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
          reader.onload = () => {
            editor.editor.chain().focus().setImage({ src: reader.result as string }).run()
          }
          reader.readAsDataURL(blob)
        }
      }
    }
  })
}
