import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import CharacterCount from '@tiptap/extension-character-count'
import FontFamily from '@tiptap/extension-font-family'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Toolbar } from './toolbar/Toolbar.ts'

const lowlight = createLowlight(common)

export interface EditorCallbacks {
  onChange?: (html: string, json: unknown) => void
  onWordCountChange?: (count: number) => void
}

export class CursusEditor {
  editor: Editor
  callbacks: EditorCallbacks
  currentFile: string | null = null
  currentFormat: string = 'markdown'

  constructor(selector: string, callbacks: EditorCallbacks = {}) {
    this.callbacks = callbacks

    const element = document.querySelector(selector)
    if (!element) {
      throw new Error(`Editor element not found: ${selector}`)
    }

    this.editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: { levels: [1, 2, 3, 4] }
        }),
        Placeholder.configure({
          placeholder: 'Start writing, or press / for commands...'
        }),
        Highlight.configure({ multicolor: true }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TextStyle,
        Color,
        FontFamily,
        Link.configure({ openOnClick: false, HTMLAttributes: { class: 'cursus-link' } }),
        Image.configure({ inline: false, allowBase64: true }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Underline,
        Subscript,
        Superscript,
        CharacterCount,
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
        CodeBlockLowlight.configure({ lowlight }),
      ],
      content: '<p></p>',
      editorProps: {
        attributes: {
          class: 'tiptap'
        }
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        const json = editor.getJSON()
        this.callbacks.onChange?.(html, json)
        const text = editor.getText()
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        this.callbacks.onWordCountChange?.(words)
      }
    })

    new Toolbar(this)
  }

  setContent(content: string): void {
    this.editor.commands.setContent(content)
  }

  getHTML(): string {
    return this.editor.getHTML()
  }

  getJSON(): unknown {
    return this.editor.getJSON()
  }

  getText(): string {
    return this.editor.getText()
  }

  getMarkdown(): string {
    const html = this.getHTML()
    let md = html
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__')
    md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    md = md.replace(/<br\s*\/?>/gi, '\n')
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    md = md.replace(/<[^>]+>/g, '')
    md = md.replace(/&amp;/g, '&')
    md = md.replace(/&lt;/g, '<')
    md = md.replace(/&gt;/g, '>')
    md = md.replace(/&nbsp;/g, ' ')
    md = md.replace(/\n{3,}/g, '\n\n')
    return md.trim()
  }

  setMarkdown(content: string): void {
    this.editor.commands.setContent(content)
  }

  clear(): void {
    this.editor.commands.clearContent()
  }

  focus(): void {
    this.editor.commands.focus()
  }

  destroy(): void {
    this.editor.destroy()
  }

  setEditable(editable: boolean): void {
    this.editor.setEditable(editable)
  }

  getWordCount(): number {
    const text = this.editor.getText()
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  getCharCount(): number {
    return this.editor.storage.characterCount?.characters?.() || 0
  }
}
