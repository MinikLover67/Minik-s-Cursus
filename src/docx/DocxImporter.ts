export async function loadDocxIntoEditor(filePath: string, setContent: (html: string) => void): Promise<void> {
  const content = await window.electronAPI.readFile(filePath)
  if (content) {
    setContent(content)
  }
}
