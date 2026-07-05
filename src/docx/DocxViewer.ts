export async function loadDocxContent(filePath: string): Promise<string> {
  const content = await window.electronAPI.readFile(filePath)
  return content || ''
}

export function renderDocxPreview(html: string, container: HTMLElement): void {
  container.innerHTML = `
    <div class="docx-preview" style="padding: 24px; max-width: 800px; margin: 0 auto;">
      <div class="docx-content" style="font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6;">
        ${html}
      </div>
    </div>
  `
}
