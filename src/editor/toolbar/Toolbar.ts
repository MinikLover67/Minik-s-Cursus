import type { CursusEditor } from '../CursusEditor.ts'

interface ToolbarItem {
  icon: string
  title: string
  action: () => void
  isActive?: () => boolean
  type?: 'button' | 'select' | 'separator' | 'group'
  options?: { label: string; value: string }[]
  group?: ToolbarItem[]
}

function createBtn(item: ToolbarItem, editor: CursusEditor): HTMLElement {
  const btn = document.createElement('button')
  btn.className = 'toolbar-btn'
  btn.innerHTML = item.icon
  btn.title = item.title
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    item.action()
    editor.focus()
  })
  const updateActive = () => {
    if (item.isActive) {
      btn.classList.toggle('active', item.isActive())
    }
  }
  editor.editor.on('selectionUpdate', updateActive)
  editor.editor.on('transaction', updateActive)
  updateActive()
  return btn
}

function createSep(): HTMLElement {
  const sep = document.createElement('div')
  sep.className = 'toolbar-separator'
  return sep
}

function createSelect(options: { label: string; value: string }[], onChange: (v: string) => void): HTMLElement {
  const sel = document.createElement('select')
  sel.className = 'toolbar-select'
  for (const opt of options) {
    const o = document.createElement('option')
    o.value = opt.value
    o.textContent = opt.label
    sel.appendChild(o)
  }
  sel.addEventListener('change', () => onChange(sel.value))
  return sel
}

export function buildToolbar(editor: CursusEditor): void {
  const container = document.getElementById('editor-toolbar')
  if (!container) return
  container.innerHTML = ''

  const e = editor.editor

  // Heading select
  const headingSelect = createSelect([
    { label: 'Paragraph', value: 'paragraph' },
    { label: 'Heading 1', value: '1' },
    { label: 'Heading 2', value: '2' },
    { label: 'Heading 3', value: '3' },
    { label: 'Heading 4', value: '4' }
  ], (v) => {
    if (v === 'paragraph') {
      e.chain().focus().setParagraph().run()
    } else {
      e.chain().focus().toggleHeading({ level: parseInt(v) as 1 | 2 | 3 | 4 }).run()
    }
  })
  container.appendChild(headingSelect)
  container.appendChild(createSep())

  // Font family
  const fontSelect = createSelect([
    { label: 'Default', value: '' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' }
  ], (v) => {
    if (v) {
      e.chain().focus().setFontFamily(v).run()
    }
  })
  container.appendChild(fontSelect)
  container.appendChild(createSep())

  // Formatting buttons
  const formatItems: ToolbarItem[] = [
    { icon: '<b>B</b>', title: 'Bold (Ctrl+B)', action: () => e.chain().focus().toggleBold().run(), isActive: () => e.isActive('bold') },
    { icon: '<i>I</i>', title: 'Italic (Ctrl+I)', action: () => e.chain().focus().toggleItalic().run(), isActive: () => e.isActive('italic') },
    { icon: '<u>U</u>', title: 'Underline (Ctrl+U)', action: () => e.chain().focus().toggleUnderline().run(), isActive: () => e.isActive('underline') },
    { icon: '<s>S</s>', title: 'Strikethrough', action: () => e.chain().focus().toggleStrike().run(), isActive: () => e.isActive('strike') },
    { icon: 'X\u2082', title: 'Subscript', action: () => e.chain().focus().toggleSubscript().run(), isActive: () => e.isActive('subscript') },
    { icon: 'X\u00B2', title: 'Superscript', action: () => e.chain().focus().toggleSuperscript().run(), isActive: () => e.isActive('superscript') },
    { icon: '<span style="background:#fff3bf;padding:0 3px;border-radius:2px">H</span>', title: 'Highlight', action: () => e.chain().focus().toggleHighlight().run(), isActive: () => e.isActive('highlight') }
  ]

  const formatGroup = document.createElement('div')
  formatGroup.className = 'toolbar-group'
  for (const item of formatItems) {
    formatGroup.appendChild(createBtn(item, editor))
  }
  container.appendChild(formatGroup)
  container.appendChild(createSep())

  // Lists
  const listItems: ToolbarItem[] = [
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4h8M5 8h8M5 12h8" stroke="currentColor" stroke-width="1.5"/><circle cx="2" cy="4" r="1" fill="currentColor"/><circle cx="2" cy="8" r="1" fill="currentColor"/><circle cx="2" cy="12" r="1" fill="currentColor"/></svg>', title: 'Bullet List', action: () => e.chain().focus().toggleBulletList().run(), isActive: () => e.isActive('bulletList') },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4h8M5 8h8M5 12h8" stroke="currentColor" stroke-width="1.5"/><text x="1" y="5" font-size="5" fill="currentColor">1</text><text x="1" y="9" font-size="5" fill="currentColor">2</text><text x="1" y="13" font-size="5" fill="currentColor">3</text></svg>', title: 'Ordered List', action: () => e.chain().focus().toggleOrderedList().run(), isActive: () => e.isActive('orderedList') },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M8 4.5h6M8 7h3" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M8 11.5h6" stroke="currentColor" stroke-width="1.2"/></svg>', title: 'Task List', action: () => e.chain().focus().toggleTaskList().run(), isActive: () => e.isActive('taskList') }
  ]

  const listGroup = document.createElement('div')
  listGroup.className = 'toolbar-group'
  for (const item of listItems) {
    listGroup.appendChild(createBtn(item, editor))
  }
  container.appendChild(listGroup)
  container.appendChild(createSep())

  // Block elements
  const blockItems: ToolbarItem[] = [
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3h10v2H3zM3 7h7v2H3zM3 11h10v2H3z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>', title: 'Blockquote', action: () => e.chain().focus().toggleBlockquote().run(), isActive: () => e.isActive('blockquote') },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" stroke-width="2"/></svg>', title: 'Horizontal Rule', action: () => e.chain().focus().setHorizontalRule().run() },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><text x="4" y="11" font-size="8" font-family="monospace" fill="currentColor">&lt;&gt;</text></svg>', title: 'Code Block', action: () => e.chain().focus().toggleCodeBlock().run(), isActive: () => e.isActive('codeBlock') },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M1 5h14M1 9h14M5 1v14M9 1v14" stroke="currentColor" stroke-width="0.8"/></svg>', title: 'Insert Table', action: () => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() }
  ]

  const blockGroup = document.createElement('div')
  blockGroup.className = 'toolbar-group'
  for (const item of blockItems) {
    blockGroup.appendChild(createBtn(item, editor))
  }
  container.appendChild(blockGroup)
  container.appendChild(createSep())

  // Link
  const linkBtn = createBtn({
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
    title: 'Insert Link (Ctrl+K)',
    action: () => {
      const url = window.prompt('Enter URL:')
      if (url) {
        e.chain().focus().setLink({ href: url }).run()
      }
    },
    isActive: () => e.isActive('link')
  }, editor)
  container.appendChild(linkBtn)

  // Image
  const imageBtn = createBtn({
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="5" cy="6" r="1.5" fill="currentColor"/><path d="M1 11l4-3 3 2 3-2 4 3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
    title: 'Insert Image',
    action: () => {
      const url = window.prompt('Enter image URL:')
      if (url) {
        e.chain().focus().setImage({ src: url }).run()
      }
    }
  }, editor)
  container.appendChild(imageBtn)
  container.appendChild(createSep())

  // Undo / Redo
  const historyItems: ToolbarItem[] = [
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6h7a3 3 0 010 6H8" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6 3L3 6l3 3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>', title: 'Undo (Ctrl+Z)', action: () => e.chain().focus().undo().run() },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 6H6a3 3 0 000 6h2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 3l3 3-3 3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>', title: 'Redo (Ctrl+Y)', action: () => e.chain().focus().redo().run() }
  ]

  const historyGroup = document.createElement('div')
  historyGroup.className = 'toolbar-group'
  for (const item of historyItems) {
    historyGroup.appendChild(createBtn(item, editor))
  }
  container.appendChild(historyGroup)
  container.appendChild(createSep())

  // Alignment
  const alignItems: ToolbarItem[] = [
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 6h8M2 9h10M2 12h7" stroke="currentColor" stroke-width="1.5"/></svg>', title: 'Align Left', action: () => e.chain().focus().setTextAlign('left').run(), isActive: () => e.isActive({ textAlign: 'left' }) },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M4 6h8M3 9h10M5 12h6" stroke="currentColor" stroke-width="1.5"/></svg>', title: 'Align Center', action: () => e.chain().focus().setTextAlign('center').run(), isActive: () => e.isActive({ textAlign: 'center' }) },
    { icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M6 6h4M5 9h6M7 12h2" stroke="currentColor" stroke-width="1.5"/></svg>', title: 'Align Right', action: () => e.chain().focus().setTextAlign('right').run(), isActive: () => e.isActive({ textAlign: 'right' }) }
  ]

  const alignGroup = document.createElement('div')
  alignGroup.className = 'toolbar-group'
  for (const item of alignItems) {
    alignGroup.appendChild(createBtn(item, editor))
  }
  container.appendChild(alignGroup)
  container.appendChild(createSep())

  // Color picker
  const colorInput = document.createElement('input')
  colorInput.type = 'color'
  colorInput.value = '#000000'
  colorInput.style.width = '28px'
  colorInput.style.height = '28px'
  colorInput.style.border = '1px solid var(--border)'
  colorInput.style.borderRadius = '4px'
  colorInput.style.cursor = 'pointer'
  colorInput.style.padding = '2px'
  colorInput.title = 'Text Color'
  colorInput.addEventListener('input', () => {
    e.chain().focus().setColor(colorInput.value).run()
  })
  container.appendChild(colorInput)

  // Spacer
  const spacer = document.createElement('div')
  spacer.style.flex = '1'
  container.appendChild(spacer)

  // AI button
  const aiBtn = createBtn({
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
    title: 'AI Actions',
    action: () => showAiMenu(editor)
  }, editor)
  aiBtn.classList.add('ai-toolbar-btn')
  container.appendChild(aiBtn)
}

function showAiMenu(editor: CursusEditor): void {
  const existing = document.querySelector('.ai-popup-menu')
  if (existing) { existing.remove(); return }

  const menu = document.createElement('div')
  menu.className = 'ai-popup-menu'
  menu.style.cssText = 'position:fixed;top:60px;right:20px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:6px;z-index:999;box-shadow:var(--shadow-lg);min-width:200px;'

  const items = [
    { label: 'Continue Writing', prompt: 'Continue the following text naturally and coherently:\n\n' },
    { label: 'Improve Writing', prompt: 'Improve the writing quality, clarity and flow of the following text. Keep the meaning:\n\n' },
    { label: 'Proofread', prompt: 'Fix all grammar, spelling and punctuation errors in the following text. Return only the corrected text:\n\n' },
    { label: 'Explain Code', prompt: 'Explain what this code does in detail:\n\n' },
    { label: 'Add Comments', prompt: 'Add helpful comments to this code:\n\n' },
    { label: 'Translate to English', prompt: 'Translate the following text to English:\n\n' },
    { label: 'Translate to Spanish', prompt: 'Translate the following text to Spanish:\n\n' },
    { label: 'Translate to French', prompt: 'Translate the following text to French:\n\n' },
    { label: 'Custom Prompt...', prompt: '' }
  ]

  const selectedText = editor.editor.state.doc.textBetween(
    editor.editor.state.selection.from,
    editor.editor.state.selection.to
  )

  for (const item of items) {
    const btn = document.createElement('button')
    btn.textContent = item.label
    btn.style.cssText = 'display:block;width:100%;text-align:left;padding:8px 12px;border:none;background:none;color:var(--text);font-size:13px;cursor:pointer;border-radius:4px;'
    btn.addEventListener('mouseenter', () => btn.style.background = 'var(--bg-hover)')
    btn.addEventListener('mouseleave', () => btn.style.background = 'none')
    btn.addEventListener('click', async () => {
      menu.remove()
      let prompt = item.prompt
      if (item.label === 'Custom Prompt...') {
        const customPrompt = window.prompt('Enter your AI prompt:')
        if (!customPrompt) return
        prompt = customPrompt + '\n\n'
      }
      if (prompt.includes('\n\n')) {
        prompt += selectedText || editor.editor.getText()
      }
      await window.electronAPI.ollamaGenerate(
        (await window.electronAPI.getStore('ollamaModel')) as string,
        prompt
      )
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
