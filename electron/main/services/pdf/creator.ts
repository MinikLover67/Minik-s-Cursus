import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs/promises'

export async function createPdf(html: string, outputPath: string): Promise<void> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

  const lines = text.split('\n').filter(l => l.trim())
  const page = pdfDoc.addPage([612, 792])
  const margin = 72
  const maxWidth = page.getWidth() - margin * 2
  let y = page.getHeight() - margin

  for (const line of lines) {
    if (y < margin) {
      const newPage = pdfDoc.addPage([612, 792])
      y = newPage.getHeight() - margin
    }

    const isHeading = line.match(/^#{1,3}\s/)
    const currentFont = isHeading ? boldFont : font
    const fontSize = isHeading ? 16 : 11

    page.drawText(line.substring(0, 80), {
      x: margin,
      y,
      size: fontSize,
      font: currentFont,
      color: rgb(0, 0, 0),
      maxWidth
    })

    y -= fontSize + 8
  }

  const pdfBytes = await pdfDoc.save()
  await fs.writeFile(outputPath, pdfBytes)
}

export async function mergePdfs(inputPaths: string[], outputPath: string): Promise<void> {
  const mergedPdf = await PDFDocument.create()

  for (const inputPath of inputPaths) {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    for (const page of copiedPages) {
      mergedPdf.addPage(page)
    }
  }

  const mergedBytes = await mergedPdf.save()
  await fs.writeFile(outputPath, mergedBytes)
}
