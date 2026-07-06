import { CursusEditor } from './editor/CursusEditor.ts'
import { initUI } from './ui/App.ts'

function main(): void {
  try {
    const editor = new CursusEditor('#editor-content')
    initUI(editor)
    ;(window as any).__cursusEditor = editor

    window.electronAPI.getStore('theme').then((theme) => {
      document.body.className = `theme-${theme || 'light'}`
    }).catch(() => {})

    window.electronAPI.getStore('welcomeShown').then((shown) => {
      if (!shown) {
        document.getElementById('welcome-overlay')?.classList.remove('hidden')
      }
    }).catch(() => {})
  } catch (err) {
    console.error('Failed to initialize Cursus:', err)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main)
} else {
  main()
}
