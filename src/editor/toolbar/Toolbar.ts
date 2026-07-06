import type { CursusEditor } from '../CursusEditor.ts'

function createBtn(icon: string, title: string, action: () => void, isActive?: () => boolean, editor?: CursusEditor): HTMLElement {
  const btn = document.createElement('button')
  btn.className = 'toolbar-btn'
  btn.innerHTML = icon
  btn.title = title
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    action()
    editor?.focus()
  })
  if (isActive && editor) {
    const updateActive = () => {
      btn.classList.toggle('active', isActive())
    }
    editor.editor.on('selectionUpdate', updateActive)
    editor.editor.on('transaction', updateActive)
    updateActive()
  }
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
  container.appendChild(createSelect([
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
  }))
  container.appendChild(createSep())

  // Font family
  container.appendChild(createSelect([
    { label: 'Default', value: '' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' }
  ], (v) => {
    if (v) e.chain().focus().setFontFamily(v).run()
  }))
  container.appendChild(createSep())

  // Formatting
  const fmtGroup = document.createElement('div')
  fmtGroup.className = 'toolbar-group'
  fmtGroup.appendChild(createBtn('<b>B</b>', 'Bold (Ctrl+B)', () => e.chain().focus().toggleBold().run(), () => e.isActive('bold'), editor))
  fmtGroup.appendChild(createBtn('<i>I</i>', 'Italic (Ctrl+I)', () => e.chain().focus().toggleItalic().run(), () => e.isActive('italic'), editor))
  fmtGroup.appendChild(createBtn('<u>U</u>', 'Underline (Ctrl+U)', () => e.chain().focus().toggleUnderline().run(), () => e.isActive('underline'), editor))
  fmtGroup.appendChild(createBtn('<s>S</s>', 'Strikethrough', () => e.chain().focus().toggleStrike().run(), () => e.isActive('strike'), editor))
  fmtGroup.appendChild(createBtn('X\u2082', 'Subscript', () => e.chain().focus().toggleSubscript().run(), () => e.isActive('subscript'), editor))
  fmtGroup.appendChild(createBtn('X\u00B2', 'Superscript', () => e.chain().focus().toggleSuperscript().run(), () => e.isActive('superscript'), editor))
  container.appendChild(fmtGroup)
  container.appendChild(createSep())

  // Lists
  const listGroup = document.createElement('div')
  listGroup.className = 'toolbar-group'
  listGroup.appendChild(createBtn('\u2022', 'Bullet List', () => e.chain().focus().toggleBulletList().run(), () => e.isActive('bulletList'), editor))
  listGroup.appendChild(createBtn('1.', 'Ordered List', () => e.chain().focus().toggleOrderedList().run(), () => e.isActive('orderedList'), editor))
  listGroup.appendChild(createBtn('\u2611', 'Task List', () => e.chain().focus().toggleTaskList().run(), () => e.isActive('taskList'), editor))
  container.appendChild(listGroup)
  container.appendChild(createSep())

  // Block
  const blockGroup = document.createElement('div')
  blockGroup.className = 'toolbar-group'
  blockGroup.appendChild(createBtn('\u275D', 'Blockquote', () => e.chain().focus().toggleBlockquote().run(), () => e.isActive('blockquote'), editor))
  blockGroup.appendChild(createBtn('\u2014', 'Horizontal Rule', () => e.chain().focus().setHorizontalRule().run()))
  blockGroup.appendChild(createBtn('&lt;/&gt;', 'Code Block', () => e.chain().focus().toggleCodeBlock().run(), () => e.isActive('codeBlock'), editor))
  blockGroup.appendChild(createBtn('\u2B1C', 'Insert Table', () => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()))
  container.appendChild(blockGroup)
  container.appendChild(createSep())

  // Link
  container.appendChild(createBtn('\uD83D\uDD17', 'Insert Link (Ctrl+K)', () => {
    const url = window.prompt('Enter URL:')
    if (url) e.chain().focus().setLink({ href: url }).run()
  }, () => e.isActive('link'), editor))

  // Image
  container.appendChild(createBtn('\uD83D\uDDBC', 'Insert Image', () => {
    const url = window.prompt('Enter image URL:')
    if (url) e.chain().focus().setImage({ src: url }).run()
  }))
  container.appendChild(createSep())

  // Undo/Redo
  const histGroup = document.createElement('div')
  histGroup.className = 'toolbar-group'
  histGroup.appendChild(createBtn('\u21A9', 'Undo (Ctrl+Z)', () => e.chain().focus().undo().run()))
  histGroup.appendChild(createBtn('\u21AA', 'Redo (Ctrl+Y)', () => e.chain().focus().redo().run()))
  container.appendChild(histGroup)
  container.appendChild(createSep())

  // Align
  const alignGroup = document.createElement('div')
  alignGroup.className = 'toolbar-group'
  alignGroup.appendChild(createBtn('\u2261', 'Align Left', () => e.chain().focus().setTextAlign('left').run(), () => e.isActive({ textAlign: 'left' }), editor))
  alignGroup.appendChild(createBtn('\u2263', 'Align Center', () => e.chain().focus().setTextAlign('center').run(), () => e.isActive({ textAlign: 'center' }), editor))
  container.appendChild(alignGroup)
  container.appendChild(createSep())

  // Color picker
  const colorInput = document.createElement('input')
  colorInput.type = 'color'
  colorInput.value = '#000000'
  colorInput.style.cssText = 'width:28px;height:28px;border:1px solid var(--border);border-radius:4px;cursor:pointer;padding:2px;'
  colorInput.title = 'Text Color'
  colorInput.addEventListener('input', () => e.chain().focus().setColor(colorInput.value).run())
  container.appendChild(colorInput)

  // Spacer
  const spacer = document.createElement('div')
  spacer.style.flex = '1'
  container.appendChild(spacer)

  // AI button
  container.appendChild(createBtn('\u2728', 'AI Actions', () => showAiMenu(editor)))
}

function showAiMenu(editor: CursusEditor): void {
  const existing = document.querySelector('.ai-popup-menu')
  if (existing) { existing.remove(); return }

  const menu = document.createElement('div')
  menu.className = 'ai-popup-menu'
  menu.style.cssText = 'position:fixed;top:60px;right:20px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:6px;z-index:999;box-shadow:var(--shadow-lg);min-width:200px;'

  const selectedText = editor.editor.state.doc.textBetween(
    editor.editor.state.selection.from,
    editor.editor.state.selection.to
  )

  const items = [
    { label: 'Continue Writing', prompt: 'Continue the following text naturally:\n\n' + (selectedText || editor.editor.getText()) },
    { label: 'Improve Writing', prompt: 'Improve the writing quality and clarity of:\n\n' + (selectedText || editor.editor.getText()) },
    { label: 'Proofread', prompt: 'Fix grammar, spelling and punctuation:\n\n' + (selectedText || editor.editor.getText()) },
    { label: 'Explain Code', prompt: 'Explain this code:\n\n' + (selectedText || '') },
    { label: 'Add Comments', prompt: 'Add comments to this code:\n\n' + (selectedText || '') },
    { label: 'Translate to English', prompt: 'Translate to English:\n\n' + (selectedText || '') },
    { label: 'Translate to Spanish', prompt: 'Translate to Spanish:\n\n' + (selectedText || '') },
    { label: 'Translate to French', prompt: 'Translate to French:\n\n' + (selectedText || '') },
    { label: 'Custom Prompt...', prompt: '' }
  ]

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
        prompt = customPrompt + '\n\n' + (selectedText || editor.editor.getText())
      }
      try {
        const model = (await window.electronAPI.getStore('ollamaModel')) as string || 'llama3.2:3b'
        const result = await window.electronAPI.ollamaGenerate(model, prompt) as { text?: string }
        if (result?.text) {
          editor.editor.commands.insertContent(result.text)
        }
      } catch (err) {
        window.alert('AI Error: ' + (err as Error).message)
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
