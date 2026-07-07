import type { CursusEditor } from '../CursusEditor.ts'

interface ToolbarButton {
  id: string
  label: string
  svg: string
  action: () => void
  isActive?: () => boolean
}

export class Toolbar {
  private editor: CursusEditor
  private container: HTMLElement
  private currentPopup: HTMLElement | null = null
  private closeHandler: ((e: MouseEvent) => void) | null = null

  constructor(editor: CursusEditor) {
    this.editor = editor
    this.container = document.getElementById('editor-toolbar')!
    this.container.innerHTML = ''
    this.buildAll()
  }

  private buildAll(): void {
    const buttons: (ToolbarButton | '|')[] = [
      { id: 'undo', label: 'Undo', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', action: () => this.editor.editor.chain().focus().undo().run() },
      { id: 'redo', label: 'Redo', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>', action: () => this.editor.editor.chain().focus().redo().run() },
      '|',
      { id: 'heading', label: 'Heading', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 4v16M18 4v16M6 12h12M8 4h4M14 4h4M8 20h4M14 20h4"/></svg>', action: () => this.showHeadingDropdown() },
      '|',
      { id: 'bold', label: 'Bold', isActive: () => this.editor.editor.isActive('bold'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 11h5a3 3 0 0 0 0-6H8v6zm0 7h6a3 3 0 0 0 0-6H8v6z"/></svg>', action: () => this.editor.editor.chain().focus().toggleBold().run() },
      { id: 'italic', label: 'Italic', isActive: () => this.editor.editor.isActive('italic'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 6V4H7v2h3.5l-3 12H4v2h10v-2h-3.5l3-12H17z"/></svg>', action: () => this.editor.editor.chain().focus().toggleItalic().run() },
      { id: 'underline', label: 'Underline', isActive: () => this.editor.editor.isActive('underline'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>', action: () => this.editor.editor.chain().focus().toggleUnderline().run() },
      { id: 'strike', label: 'Strikethrough', isActive: () => this.editor.editor.isActive('strike'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="18" y2="12"/><path d="M16 6a4 4 0 0 0-8 0v12a4 4 0 0 0 8 0"/></svg>', action: () => this.editor.editor.chain().focus().toggleStrike().run() },
      { id: 'sub', label: 'Subscript', isActive: () => this.editor.editor.isActive('subscript'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 4l8 8-8 8M12 4l8 8-8 8"/></svg>', action: () => this.editor.editor.chain().focus().toggleSubscript().run() },
      { id: 'sup', label: 'Superscript', isActive: () => this.editor.editor.isActive('superscript'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 20l8-8-8-8M12 20l8-8-8-8"/></svg>', action: () => this.editor.editor.chain().focus().toggleSuperscript().run() },
      '|',
      { id: 'bullet-list', label: 'Bullet List', isActive: () => this.editor.editor.isActive('bulletList'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/></svg>', action: () => this.editor.editor.chain().focus().toggleBulletList().run() },
      { id: 'ordered-list', label: 'Ordered List', isActive: () => this.editor.editor.isActive('orderedList'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>', action: () => this.editor.editor.chain().focus().toggleOrderedList().run() },
      { id: 'task-list', label: 'Task List', isActive: () => this.editor.editor.isActive('taskList'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>', action: () => this.editor.editor.chain().focus().toggleTaskList().run() },
      '|',
      { id: 'align-left', label: 'Align Left', isActive: () => this.editor.editor.isActive({ textAlign: 'left' }), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>', action: () => this.editor.editor.chain().focus().setTextAlign('left').run() },
      { id: 'align-center', label: 'Center', isActive: () => this.editor.editor.isActive({ textAlign: 'center' }), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="18" y1="14" x2="6" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>', action: () => this.editor.editor.chain().focus().setTextAlign('center').run() },
      { id: 'align-right', label: 'Align Right', isActive: () => this.editor.editor.isActive({ textAlign: 'right' }), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="7" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>', action: () => this.editor.editor.chain().focus().setTextAlign('right').run() },
      '|',
      { id: 'code', label: 'Code', isActive: () => this.editor.editor.isActive('code'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', action: () => this.editor.editor.chain().focus().toggleCode().run() },
      { id: 'code-block', label: 'Code Block', isActive: () => this.editor.editor.isActive('codeBlock'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 8 3 12 7 16"/><polyline points="17 8 21 12 17 16"/><line x1="14" y1="4" x2="10" y2="20"/></svg>', action: () => this.editor.editor.chain().focus().toggleCodeBlock().run() },
      { id: 'blockquote', label: 'Blockquote', isActive: () => this.editor.editor.isActive('blockquote'), svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>', action: () => this.editor.editor.chain().focus().toggleBlockquote().run() },
      { id: 'hr', label: 'Horizontal Rule', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>', action: () => this.editor.editor.chain().focus().setHorizontalRule().run() },
      '|',
      { id: 'link', label: 'Link', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', action: () => {
        const url = prompt('Enter URL:')
        if (url) this.editor.editor.chain().focus().setLink({ href: url }).run()
      }},
      { id: 'image', label: 'Image', svg: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', action: () => {
        const input = document.createElement('input')
        input.type = 'file'; input.accept = 'image/*'
        input.onchange = () => {
          const file = input.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => this.editor.editor.chain().focus().setImage({ src: reader.result as string }).run()
            reader.readAsDataURL(file)
          }
        }
        input.click()
      }},
      '|',
      { id: 'undo', label: 'Undo', svg: '', action: () => {}, isHidden: true },
    ]

    const groups: (ToolbarButton | '|')[][] = []
    let currentGroup: (ToolbarButton | '|')[] = []
    for (const item of buttons) {
      if (item === '|') {
        if (currentGroup.length > 0) groups.push(currentGroup)
        currentGroup = []
      } else if (!(item as any).isHidden) {
        currentGroup.push(item)
      }
    }
    if (currentGroup.length > 0) groups.push(currentGroup)

    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi]
      const groupEl = document.createElement('div')
      groupEl.className = 'toolbar-group'

      for (const btn of group) {
        if (btn === '|') continue
        const el = document.createElement('button')
        el.id = `btn-${btn.id}`
        el.className = 'toolbar-btn'
        el.title = btn.label
        el.innerHTML = btn.svg
        el.addEventListener('click', btn.action)
        if (btn.isActive) {
          this.editor.editor.on('selectionUpdate', () => {
            el.classList.toggle('active', !!btn.isActive?.())
          })
          this.editor.editor.on('transaction', () => {
            el.classList.toggle('active', !!btn.isActive?.())
          })
        }
        groupEl.appendChild(el)
      }

      this.container.appendChild(groupEl)
      if (gi < groups.length - 1) {
        const sep = document.createElement('div')
        sep.className = 'toolbar-separator'
        this.container.appendChild(sep)
      }
    }

  }

  private showHeadingDropdown(): void {
    const levels = [
      { label: 'Normal', level: 0 },
      { label: 'Heading 1', level: 1 },
      { label: 'Heading 2', level: 2 },
      { label: 'Heading 3', level: 3 },
      { label: 'Heading 4', level: 4 },
      { label: 'Heading 5', level: 5 },
      { label: 'Heading 6', level: 6 },
    ]
    const current = levels.find(l => l.level > 0 && this.editor.editor.isActive('heading', { level: l.level }))
    const rect = document.getElementById('btn-heading')?.getBoundingClientRect()
    const left = rect ? rect.left + 'px' : '100px'
    const top = rect ? (rect.bottom + 4) + 'px' : '50px'

    this.closePopup()
    const popup = document.createElement('div')
    popup.className = 'ai-popup'
    popup.style.cssText = `position:fixed;top:${top};left:${left};min-width:160px;background:var(--bg-primary);border:1px solid var(--border);border-radius:6px;padding:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1000;`
    for (const h of levels) {
      const item = document.createElement('div')
      item.textContent = h.label
      item.style.cssText = 'padding:6px 12px;cursor:pointer;border-radius:4px;font-size:13px;'
      if (current?.level === h.level) item.style.background = 'var(--bg-hover)'
      item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-hover)')
      item.addEventListener('mouseleave', () => item.style.background = current?.level === h.level ? 'var(--bg-hover)' : '')
      item.addEventListener('click', () => {
        if (h.level === 0) this.editor.editor.chain().focus().setParagraph().run()
        else this.editor.editor.chain().focus().toggleHeading({ level: h.level as any }).run()
        this.closePopup()
      })
      popup.appendChild(item)
    }
    document.body.appendChild(popup)
    this.currentPopup = popup
    this.closeHandler = (ev) => { if (!popup.contains(ev.target as Node)) this.closePopup() }
    setTimeout(() => document.addEventListener('click', this.closeHandler!), 0)
  }

  private closePopup(): void {
    if (this.closeHandler) { document.removeEventListener('click', this.closeHandler); this.closeHandler = null }
    this.currentPopup?.remove(); this.currentPopup = null
  }
}
