import { CursusEditor } from './editor/CursusEditor.ts'
import { initUI } from './ui/App.ts'

async function main() {
  const editor = new CursusEditor('#editor-content')
  initUI(editor)

  const theme = await window.electronAPI.getStore('theme')
  document.body.className = `theme-${theme || 'light'}`

  const welcomeShown = await window.electronAPI.getStore('welcomeShown')
  if (!welcomeShown) {
    document.getElementById('welcome-overlay')?.classList.remove('hidden')
  }
}

document.addEventListener('DOMContentLoaded', main)
