import { Extension, Mark, type Editor } from '@tiptap/core'
import { keymap } from '@tiptap/pm/keymap'

export const GhostText = Mark.create({
  name: 'ghostText',
  renderHTML() {
    return ['span', { class: 'ai-ghost', 'data-ghost': 'true' }, 0]
  },
  parseHTML() {
    return [{ tag: 'span[data-ghost]' }]
  },
})

let instance: AiAutocomplete | null = null

export function getAutocomplete(): AiAutocomplete | null {
  return instance
}

export class AiAutocomplete {
  private editor: Editor
  private backend = 'ollama'
  private model = ''
  private isGenerating = false
  private ghostRange: { from: number; to: number } | null = null
  private enabled = true
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private cleanupFns: (() => void)[] = []

  constructor(editor: Editor) {
    this.editor = editor
    instance = this
    this.init()
  }

  private async init(): Promise<void> {
    await this.loadSettings()

    this.editor.on('update', () => this.handleUpdate())

    const unsubToken = window.electronAPI.onAiToken((token: string) => this.onToken(token))
    const unsubDone = window.electronAPI.onAiDone(() => this.onDone())
    this.cleanupFns.push(unsubToken, unsubDone)
  }

  setEnabled(v: boolean): void {
    this.enabled = v
    if (!v) this.clearGhost()
  }

  private async loadSettings(): Promise<void> {
    this.backend = (await window.electronAPI.getStore('aiBackend')) as string || 'ollama'
    if (this.backend === 'ollama') {
      this.model = (await window.electronAPI.getStore('ollamaModel')) as string || 'llama3.2:3b'
    } else {
      this.model = (await window.electronAPI.getStore('lmstudioModel')) as string || ''
    }
  }

  private handleUpdate(): void {
    if (!this.enabled || this.isGenerating) return

    if (this.ghostRange) {
      const { doc, selection } = this.editor.state
      const ghostLen = this.ghostRange.to - this.ghostRange.from
      if (ghostLen > 0) {
        const ghostText = doc.textBetween(this.ghostRange.from, this.ghostRange.to)
        if (!ghostText || !this.lastGhost || !ghostText.endsWith(this.lastGhost)) {
          this.clearGhost()
        }
      }
      if (this.ghostRange && selection.anchor < this.ghostRange.to) {
        this.clearGhost()
      }
      return
    }

    clearTimeout(this.debounceTimer!)
    this.debounceTimer = setTimeout(() => this.requestCompletion(), 800)
  }

  private lastGhost = ''

  private async requestCompletion(): Promise<void> {
    if (this.isGenerating || this.ghostRange) return
    const { doc, selection } = this.editor.state
    const pos = selection.anchor
    const from = Math.max(0, pos - 300)
    const context = doc.textBetween(from, pos).trim()
    if (!context || context.length < 10) return

    await this.loadSettings()
    if (!this.model) return

    if (this.backend === 'ollama') {
      const result = await window.electronAPI.ensureOllama()
      if (!result.running) return
    }

    this.isGenerating = true
    this.accumulated = ''
    window.electronAPI.startAiStream(this.backend, this.model, context)
  }

  private accumulated = ''
  private flushRaf: number | null = null
  private ghostInsertPos = -1

  private scheduleFlush(): void {
    if (this.flushRaf !== null) return
    this.flushRaf = requestAnimationFrame(() => this.flushTokens())
  }

  private flushTokens(): void {
    this.flushRaf = null
    const text = this.accumulated
    this.accumulated = ''
    if (!text) return

    if (this.ghostInsertPos < 0) {
      this.ghostInsertPos = this.editor.state.selection.anchor
    }

    const from = this.ghostInsertPos
    this.ghostInsertPos += text.length

    this.editor
      .chain()
      .focus()
      .insertContentAt(from, `<span class="ai-ghost" data-ghost="true">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`)
      .run()

    this.ghostRange = { from, to: this.ghostInsertPos }
    this.lastGhost = (this.lastGhost || '') + text
  }

  private onToken(token: string): void {
    if (!this.isGenerating) return
    this.accumulated += token
    this.scheduleFlush()
  }

  private onDone(): void {
    if (this.flushRaf !== null) {
      cancelAnimationFrame(this.flushRaf)
      this.flushRaf = null
    }
    if (this.accumulated) this.flushTokens()
    this.isGenerating = false
  }

  acceptGhost(): void {
    if (!this.ghostRange) return
    const { from, to } = this.ghostRange
    this.editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .unsetMark('ghostText')
      .setTextSelection(to)
      .run()
    this.ghostRange = null
    this.lastGhost = ''
    this.ghostInsertPos = -1
  }

  clearGhost(): void {
    if (!this.ghostRange) return
    const { from, to } = this.ghostRange
    this.editor.chain().focus().deleteRange({ from, to }).run()
    this.ghostRange = null
    this.lastGhost = ''
    this.ghostInsertPos = -1
  }

  hasGhost(): boolean {
    return this.ghostRange !== null
  }

  destroy(): void {
    this.cleanupFns.forEach(fn => fn())
    instance = null
  }
}

export const AutocompleteKeymap = Extension.create({
  name: 'autocompleteKeymap',

  addProseMirrorPlugins() {
    return [
      keymap({
        Tab: () => {
          const ac = getAutocomplete()
          if (ac && ac.hasGhost()) {
            ac.acceptGhost()
            return true
          }
          return false
        },
        Escape: () => {
          const ac = getAutocomplete()
          if (ac && ac.hasGhost()) {
            ac.clearGhost()
            return true
          }
          return false
        },
      })
    ]
  }
})
