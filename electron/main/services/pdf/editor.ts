import { PDFDocument } from 'pdf-lib'
import fs from 'fs/promises'

export async function editPdf(
  inputPath: string,
  outputPath: string,
  options: {
    addWatermark?: string
    removePages?: number[]
  }
): Promise<void> {
  const pdfBytes = await fs.readFile(inputPath)
  const pdfDoc = await PDFDocument.load(pdfBytes)

  if (options.removePages && options.removePages.length > 0) {
    const sortedPages = options.removePages.sort((a, b) => b - a)
    for (const pageIndex of sortedPages) {
      if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
        pdfDoc.removePage(pageIndex)
      }
    }
  }

  if (options.addWatermark) {
    const { StandardFonts, rgb } = await import('pdf-lib')
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()

    for (const page of pages) {
      page.drawText(options.addWatermark, {
        x: 150,
        y: 400,
        size: 50,
        font,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3
      })
    }
  }

  const modifiedBytes = await pdfDoc.save()
  await fs.writeFile(outputPath, modifiedBytes)
}
