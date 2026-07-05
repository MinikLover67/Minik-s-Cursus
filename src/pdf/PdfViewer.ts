export async function loadPdfContent(filePath: string): Promise<string> {
  const content = await window.electronAPI.readFile(filePath)
  return content || ''
}

export function renderPdfPreview(text: string, container: HTMLElement): void {
  const lines = text.split('\n').filter(l => l.trim())
  let html = '<div class="pdf-preview" style="padding: 24px;">'
  for (const line of lines) {
    html += `<p style="margin: 4px 0; font-size: 13px; color: var(--text);">${escapeHtml(line)}</p>`
  }
  html += '</div>'
  container.innerHTML = html
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
