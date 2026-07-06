import type { Editor } from '@tiptap/core'

export interface SlashCommandItem {
  title: string
  label: string
  description: string
  search: string[]
  action: (editor: Editor) => void
}

export const slashCommands: SlashCommandItem[] = [
  {
    title: 'Heading 1',
    label: 'H1',
    description: 'Large heading',
    search: ['h1', 'heading1', 'heading 1'],
    action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run()
  },
  {
    title: 'Heading 2',
    label: 'H2',
    description: 'Medium heading',
    search: ['h2', 'heading2', 'heading 2'],
    action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run()
  },
  {
    title: 'Heading 3',
    label: 'H3',
    description: 'Small heading',
    search: ['h3', 'heading3', 'heading 3'],
    action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run()
  },
  {
    title: 'Heading 4',
    label: 'H4',
    description: 'Tiny heading',
    search: ['h4', 'heading4', 'heading 4'],
    action: (e) => e.chain().focus().toggleHeading({ level: 4 }).run()
  },
  {
    title: 'Bold',
    label: 'B',
    description: 'Bold text',
    search: ['bold', 'b', 'strong'],
    action: (e) => e.chain().focus().toggleBold().run()
  },
  {
    title: 'Italic',
    label: 'I',
    description: 'Italic text',
    search: ['italic', 'i', 'em'],
    action: (e) => e.chain().focus().toggleItalic().run()
  },
  {
    title: 'Underline',
    label: 'U',
    description: 'Underlined text',
    search: ['underline', 'u'],
    action: (e) => e.chain().focus().toggleUnderline().run()
  },
  {
    title: 'Strikethrough',
    label: 'S',
    description: 'Strikethrough text',
    search: ['strike', 'strikethrough', 's'],
    action: (e) => e.chain().focus().toggleStrike().run()
  },
  {
    title: 'Bullet List',
    label: '•',
    description: 'Unordered bullet list',
    search: ['bullet', 'list', 'ul', 'unordered'],
    action: (e) => e.chain().focus().toggleBulletList().run()
  },
  {
    title: 'Ordered List',
    label: '1.',
    description: 'Numbered list',
    search: ['ordered', 'list', 'ol', 'numbered'],
    action: (e) => e.chain().focus().toggleOrderedList().run()
  },
  {
    title: 'Task List',
    label: '☑',
    description: 'Checklist with task items',
    search: ['task', 'todo', 'checklist', 'checkbox'],
    action: (e) => e.chain().focus().toggleTaskList().run()
  },
  {
    title: 'Quote',
    label: '"',
    description: 'Blockquote',
    search: ['quote', 'blockquote', 'cite'],
    action: (e) => e.chain().focus().toggleBlockquote().run()
  },
  {
    title: 'Code Block',
    label: '<>',
    description: 'Code block with syntax highlighting',
    search: ['code', 'codeblock', 'pre', 'syntax'],
    action: (e) => e.chain().focus().toggleCodeBlock().run()
  },
  {
    title: 'Table',
    label: '▦',
    description: 'Insert a table',
    search: ['table', 'grid'],
    action: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  },
  {
    title: 'Horizontal Rule',
    label: '—',
    description: 'Horizontal divider line',
    search: ['hr', 'rule', 'divider', 'horizontal'],
    action: (e) => e.chain().focus().setHorizontalRule().run()
  },
  {
    title: 'Image',
    label: '🖼',
    description: 'Insert an image',
    search: ['image', 'img', 'picture', 'photo'],
    action: (e) => {
      const url = window.prompt('Image URL:')
      if (url) e.chain().focus().setImage({ src: url }).run()
    }
  },
  {
    title: 'Link',
    label: '🔗',
    description: 'Add a link',
    search: ['link', 'url', 'href'],
    action: (e) => {
      const url = window.prompt('Link URL:')
      if (url) e.chain().focus().setLink({ href: url }).run()
    }
  }
]
