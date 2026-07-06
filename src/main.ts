import { CursusEditor } from './editor/CursusEditor.ts'
import { initUI } from './ui/App.ts'

async function main() {
  try {
    const editor = new CursusEditor('#editor-content')
    await initUI(editor)

    const theme = await window.electronAPI.getStore('theme')
    document.body.className = `theme-${theme || 'light'}`

    const welcomeShown = await window.electronAPI.getStore('welcomeShown')
    if (!welcomeShown) {
      document.getElementById('welcome-overlay')?.classList.remove('hidden')
    }

    ;(window as any).__cursusEditor = editor
  } catch (err) {
    console.error('Failed to initialize Cursus:', err)
  }
}

document.addEventListener('DOMContentLoaded', main)
