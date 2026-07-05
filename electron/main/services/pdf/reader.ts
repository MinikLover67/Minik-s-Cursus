import fs from 'fs/promises'

export async function readPdfText(filePath: string): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  const buffer = await fs.readFile(filePath)
  const data = new Uint8Array(buffer)
  const doc = await pdfjsLib.getDocument({ data }).promise

  let fullText = ''
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item: any) => item.str).join(' ')
    fullText += text + '\n\n'
  }

  return fullText
}
