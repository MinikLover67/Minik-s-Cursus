import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'

export async function readPdfText(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  const pdfDoc = await PDFDocument.load(buffer)
  const pages = pdfDoc.getPages()
  let text = ''

  for (const page of pages) {
    const { width, height } = page.getSize()
    text += `[Page ${pages.indexOf(page) + 1} - ${width}x${height}]\n\n`
  }

  return text || 'PDF loaded. Text extraction requires pdf.js viewer.'
}
