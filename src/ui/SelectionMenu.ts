import type { CursusEditor } from '../editor/CursusEditor.ts'

interface Action {
  id: string
  label: string
  buildPrompt: (selectedText: string) => string
}

const systemPrefix = 'You are a text transformation tool. Follow the instruction below exactly.'

const systemSuffix = 'CRITICAL RULE: Output ONLY the directly transformed text. No greetings. No explanations. No introductions. No commentary. No labels. No prefixes. No suffixes. No quotation marks around the output. No extra whitespace before or after. Just the result.'

const actions: Action[] = [
  {
    id: 'rephrase',
    label: 'Rephrase',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nRephrase the following text to convey the exact same meaning using completely different wording. Do not change the length or tone significantly.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'expand',
    label: 'Expand',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nExpand the following text by adding relevant details, examples, or deeper explanation. Keep the original text intact and build upon it naturally.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'shorter',
    label: 'Shorter',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nMake the following text as short and concise as possible while keeping all key information and original meaning. If it is already short, output a shorter synonym or minimal form.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'formal',
    label: 'Formal',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nRewrite the following text in a formal, professional, academic tone with precise vocabulary. Avoid contractions, slang, and casual phrasing.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'casual',
    label: 'Casual',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nRewrite the following text in a casual, friendly, conversational tone using everyday language.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'summarize',
    label: 'Summarize',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nSummarize the following text to just its single most important point, as briefly as possible.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'fix-grammar',
    label: 'Fix Grammar',
    buildPrompt: (t) =>
      `${systemPrefix}\n\nFix all grammar, spelling, and punctuation errors in the following text. Do not change the style, tone, or wording beyond what is necessary to correct errors.\n\nText: ${t}\n\n${systemSuffix}`,
  },
  {
    id: 'translate',
    label: 'Translate…',
    buildPrompt: (t) => {
      const lang = prompt('Translate to which language?', 'French')
      if (!lang) return ''
      return `${systemPrefix}\n\nTranslate the following text to ${lang}.\n\nText: ${t}\n\n${systemSuffix}`
    },
  },
]

let menuEl: HTMLDivElement | null = null
let editorRef: CursusEditor | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null
let showTimeout: ReturnType<typeof setTimeout> | null = null
let currentActionId: string | null = null
let lastSelectionText = ''
let btnEls = new Map<string, HTMLButtonElement>()

function getEditorSelection(editor: CursusEditor): { from: number; to: number; text: string } | null {
  const { selection } = editor.editor.state
  if (selection.from === selection.to) return null
  const text = editor.editor.state.doc.textBetween(selection.from, selection.to).trim()
  if (!text) return null
  return { from: selection.from, to: selection.to, text }
}

function getMenuAnchorPos(): { x: number; y: number } | null {
  if (!editorRef) return null
  const sel = getEditorSelection(editorRef)
  if (!sel) return null
  try {
    const start = editorRef.editor.view.coordsAtPos(sel.from)
    const end = editorRef.editor.view.coordsAtPos(sel.to)
    return {
      x: (start.left + end.left) / 2,
      y: start.top,
    }
  } catch {
    return null
  }
}

function positionMenu(): void {
  if (!menuEl) return
  const anchor = getMenuAnchorPos()
  if (!anchor) return

  const menuWidth = menuEl.offsetWidth || 320
  const menuHeight = menuEl.offsetHeight || 40
  const padding = 8

  let left = anchor.x - menuWidth / 2
  let top = anchor.y - menuHeight - padding

  if (top < 0) {
    top = anchor.y + padding
  }
  if (left < padding) left = padding
  if (left + menuWidth > window.innerWidth - padding) {
    left = window.innerWidth - menuWidth - padding
  }

  menuEl.style.left = `${left}px`
  menuEl.style.top = `${top}px`
}

function hideMenu(): void {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  if (menuEl) {
    menuEl.classList.add('hidden')
  }
}

function scheduleShow(): void {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  showTimeout = setTimeout(() => {
    if (!menuEl || !editorRef) return
    if (currentActionId) return
    const sel = getEditorSelection(editorRef)
    if (!sel) return
    const text = sel.text
    if (!text || text === lastSelectionText) {
      menuEl.classList.add('hidden')
      return
    }
    lastSelectionText = text
    positionMenu()
    menuEl.classList.remove('hidden')
  }, 80)
}

function scheduleHide(delay = 250): void {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(hideMenu, delay)
}

function setLoading(actionId: string, loading: boolean): void {
  const btn = btnEls.get(actionId)
  if (!btn) return
  if (loading) {
    btn.classList.add('ai-selection-loading')
    btn.disabled = true
  } else {
    btn.classList.remove('ai-selection-loading')
    btn.disabled = false
  }
}

function setAllButtonsDisabled(disabled: boolean): void {
  btnEls.forEach((btn) => {
    btn.disabled = disabled
    if (!disabled) btn.classList.remove('ai-selection-loading')
  })
}

async function runAction(action: Action, editor: CursusEditor): Promise<void> {
  if (currentActionId) return
  currentActionId = action.id

  const sel = getEditorSelection(editor)
  if (!sel) {
    currentActionId = null
    return
  }

  const prompt = action.buildPrompt(sel.text)
  if (!prompt) {
    currentActionId = null
    return
  }

  const backend = (await window.electronAPI.getStore('aiBackend')) as string || 'ollama'
  const model = backend === 'ollama'
    ? ((await window.electronAPI.getStore('ollamaModel')) as string || 'llama3.2:3b')
    : ((await window.electronAPI.getStore('lmstudioModel')) as string || '')

  if (!model) {
    window.alert('No AI model configured. Open AI Settings (Ctrl+,) to set one up.')
    currentActionId = null
    return
  }

  if (backend === 'ollama') {
    const result = await window.electronAPI.ensureOllama()
    if (!result.running) {
      window.alert('Could not start Ollama. Make sure it is installed.')
      currentActionId = null
      return
    }
  }

  hideMenu()
  editor.editor.commands.deleteRange({ from: sel.from, to: sel.to })
  let insertPos = sel.from

  setLoading(action.id, true)
  setAllButtonsDisabled(true)

  const unsubToken = window.electronAPI.onAiToken((token: string) => {
    editor.editor.commands.insertContentAt(insertPos, token, { parseHtml: false })
    insertPos += token.length
  })

  const unsubDone = window.electronAPI.onAiDone(() => {
    unsubToken()
    unsubDone()
    setLoading(action.id, false)
    setAllButtonsDisabled(false)
    currentActionId = null
  })

  window.electronAPI.startAiStream(backend, model, prompt)
}

function buildMenu(): HTMLDivElement {
  const el = document.createElement('div')
  el.id = 'ai-selection-menu'
  el.className = 'ai-selection-menu hidden'

  actions.forEach((action) => {
    const btn = document.createElement('button')
    btn.className = 'ai-selection-btn'
    btn.textContent = action.label
    btnEls.set(action.id, btn)
    btn.addEventListener('click', () => {
      if (editorRef) runAction(action, editorRef)
    })
    el.appendChild(btn)
  })

  document.body.appendChild(el)
  return el
}

export function setupSelectionMenu(editor: CursusEditor): void {
  editorRef = editor
  menuEl = buildMenu()

  const onSelectionChange = () => {
    if (!editorRef || currentActionId) return
    const sel = getEditorSelection(editorRef)
    if (sel) {
      scheduleShow()
    } else {
      lastSelectionText = ''
      if (!menuEl?.matches(':hover')) {
        scheduleHide(200)
      }
    }
  }

  menuEl.addEventListener('mouseenter', () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  })

  menuEl.addEventListener('mouseleave', () => {
    scheduleHide(300)
  })

  editor.editor.on('selectionUpdate', onSelectionChange)
  editor.editor.on('blur', () => scheduleHide(150))
  editor.editor.on('focus', onSelectionChange)

  document.addEventListener('scroll', hideMenu, { capture: true })
  window.addEventListener('resize', hideMenu)
}

export function destroySelectionMenu(): void {
  if (menuEl) {
    menuEl.remove()
    menuEl = null
  }
  editorRef = null
  btnEls.clear()
}
