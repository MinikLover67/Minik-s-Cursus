import type { CursusEditor } from '../editor/CursusEditor.ts'
import { AiService } from './AiService.ts'

const aiService = new AiService()

export function showAiPromptMenu(editor: CursusEditor, anchorEl: HTMLElement): void {
  const existing = document.querySelector('.ai-prompt-menu')
  if (existing) { existing.remove(); return }

  const menu = document.createElement('div')
  menu.className = 'ai-prompt-menu'

  const rect = anchorEl.getBoundingClientRect()
  menu.style.cssText = `position:fixed;top:${rect.bottom + 4}px;right:${window.innerWidth - rect.right}px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:6px;z-index:999;box-shadow:var(--shadow-lg);min-width:200px;`

  const getSelectedText = (): string => {
    const { from, to } = editor.editor.state.selection
    return editor.editor.state.doc.textBetween(from, to)
  }

  const actions = [
    { label: 'Continue Writing', task: 'continue' },
    { label: 'Improve Text', task: 'improve' },
    { label: 'Proofread', task: 'proofread' },
    { label: 'Explain Code', task: 'explain-code' },
    { label: 'Add Comments', task: 'add-comments' },
    { label: 'Custom Prompt...', task: 'custom' }
  ]

  for (const action of actions) {
    const btn = document.createElement('button')
    btn.textContent = action.label
    btn.style.cssText = 'display:block;width:100%;text-align:left;padding:8px 12px;border:none;background:none;color:var(--text);font-size:13px;cursor:pointer;border-radius:4px;'
    btn.addEventListener('mouseenter', () => btn.style.background = 'var(--bg-hover)')
    btn.addEventListener('mouseleave', () => btn.style.background = 'none')

    btn.addEventListener('click', async () => {
      menu.remove()
      const selected = getSelectedText()

      if (action.task === 'custom') {
        const prompt = window.prompt('Enter your AI prompt:')
        if (!prompt) return
        await aiService.generate('custom', selected, {
          onToken: (token) => {
            editor.editor.commands.insertContent(token)
          }
        })
      } else {
        const result = await aiService.generate(action.task, selected, {
          onToken: (token) => {
            if (selected) {
              editor.editor.commands.insertContent(token)
            } else {
              editor.editor.commands.insertContent(token)
            }
          }
        })
        if (result && !selected) {
          editor.editor.commands.insertContent(result)
        }
      }
    })
    menu.appendChild(btn)
  }

  document.body.appendChild(menu)

  const closeHandler = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      menu.remove()
      document.removeEventListener('click', closeHandler)
    }
  }
  setTimeout(() => document.addEventListener('click', closeHandler), 10)
}
