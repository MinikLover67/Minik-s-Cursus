import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { slashCommands, type SlashCommandItem } from './commands.ts'
import { createPopup } from './SlashCommandsPopup.ts'

export const SlashCommandsExtension = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    const editor = this.editor
    const popup = createPopup(editor)

    return [
      Suggestion({
        editor,
        char: '/',
        command: ({ editor, range, props }) => {
          const item = props as SlashCommandItem
          editor.chain().focus().deleteRange(range).run()
          item.action(editor)
        },
        items: ({ query }): SlashCommandItem[] => {
          const q = query.toLowerCase()
          return slashCommands.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.search.some(s => s.includes(q))
          ).slice(0, 10)
        },
        render: () => ({
          onStart: (props) => popup.onStart(props.items as SlashCommandItem[]),
          onUpdate: (props) => popup.onUpdate(props.items as SlashCommandItem[]),
          onExit: () => popup.onExit(),
          onKeyDown: (props) => {
            if (props.event.key === 'ArrowDown') {
              const next = Math.min(popup.selectedIndex + 1, popup.currentItems.length - 1)
              popup.selectedIndex = next
              popup.onUpdate(popup.currentItems)
              return true
            }
            if (props.event.key === 'ArrowUp') {
              const prev = Math.max(popup.selectedIndex - 1, 0)
              popup.selectedIndex = prev
              popup.onUpdate(popup.currentItems)
              return true
            }
            if (props.event.key === 'Enter') {
              const item = popup.currentItems[popup.selectedIndex]
              if (item) {
                props.view.dispatch(props.view.state.tr.deleteRange(props.range.from, props.range.to))
                item.action(editor)
                popup.onExit()
              }
              return true
            }
            if (props.event.key === 'Escape') {
              popup.onExit()
              return true
            }
            return false
          }
        })
      })
    ]
  }
})
