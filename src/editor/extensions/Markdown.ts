import { Node, mergeAttributes } from '@tiptap/core'

export const Markdown = Node.create({
  name: 'markdown',
  group: 'block',
  content: 'inline*',
  atom: false,

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-markdown]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-markdown': '' }), 0]
  },

  addStorage() {
    return {
      markdown: '',
      getMarkdown() {
        return this.markdown
      },
      setMarkdown(content: string) {
        this.markdown = content
      }
    }
  }
})
