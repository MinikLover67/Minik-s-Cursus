import type { SlashCommandItem } from './commands.ts'

export interface SlashPopup {
  dom: HTMLDivElement
  selectedIndex: number
  onStart: (items: SlashCommandItem[]) => void
  onUpdate: (items: SlashCommandItem[]) => void
  onExit: () => void
}

export function createPopup(): SlashPopup {
  const dom = document.createElement('div')
  dom.className = 'slash-commands-popup'
  dom.style.cssText = `
    position: fixed; z-index: 9999; background: var(--bg, #fff);
    border: 1px solid var(--border, #ddd); border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-height: 320px; overflow-y: auto;
    min-width: 260px; display: none;
  `
  const list = document.createElement('div')
  list.style.cssText = 'padding: 4px;'
  dom.appendChild(list)

  let currentItems: SlashCommandItem[] = []
  let selectedIndex = 0

  function render(items: SlashCommandItem[]): void {
    currentItems = items
    list.innerHTML = ''
    if (items.length === 0) {
      const empty = document.createElement('div')
      empty.textContent = 'No commands found'
      empty.style.cssText = 'padding: 8px 12px; color: #999; font-size: 13px;'
      list.appendChild(empty)
      return
    }
    items.forEach((item, i) => {
      const row = document.createElement('div')
      row.style.cssText = `
        display: flex; align-items: center; gap: 10px; padding: 8px 12px;
        border-radius: 6px; cursor: pointer; transition: background 0.1s;
      `
      if (i === selectedIndex) row.style.background = 'var(--bg-active, #0066cc)'
      row.onmouseenter = () => { selectedIndex = i; render(items) }
      row.onclick = () => { item.action(item as any); onExit() }

      const label = document.createElement('span')
      label.textContent = item.label
      label.style.cssText = `
        font-weight: 700; font-size: 14px; width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        background: var(--bg-hover, #f0f0f0); border-radius: 4px;
        flex-shrink: 0;
      `
      if (i === selectedIndex) label.style.background = 'rgba(255,255,255,0.2)'

      const text = document.createElement('div')
      const title = document.createElement('div')
      title.textContent = item.title
      title.style.cssText = 'font-size: 14px; font-weight: 500; line-height: 1.3;'
      const desc = document.createElement('div')
      desc.textContent = item.description
      desc.style.cssText = 'font-size: 11px; color: #999; line-height: 1.2;'
      text.appendChild(title)
      text.appendChild(desc)

      row.appendChild(label)
      row.appendChild(text)
      list.appendChild(row)
    })
  }

  function position(): void {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const top = rect.bottom + 6
    const left = Math.max(4, Math.min(rect.left, window.innerWidth - 280))
    dom.style.top = top + 'px'
    dom.style.left = left + 'px'
  }

  function onExit(): void {
    dom.style.display = 'none'
    if (dom.parentNode) dom.parentNode.removeChild(dom)
  }

  return {
    dom,
    get selectedIndex() { return selectedIndex },
    set selectedIndex(v: number) { selectedIndex = v },
    onStart(items: SlashCommandItem[]) {
      selectedIndex = 0
      render(items)
      position()
      dom.style.display = 'block'
      document.body.appendChild(dom)
    },
    onUpdate(items: SlashCommandItem[]) {
      if (selectedIndex >= items.length) selectedIndex = Math.max(0, items.length - 1)
      render(items)
      position()
    },
    onExit
  }
}
