import fs from 'fs/promises'

export async function writeDocx(html: string, outputPath: string): Promise<void> {
  const docxModule = await import('docx')
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } = docxModule

  const paragraphs = htmlToDocxParagraphs(html, docxModule)

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  })

  const buffer = await Packer.toBuffer(doc)
  await fs.writeFile(outputPath, buffer)
}

function htmlToDocxParagraphs(html: string, docxModule: any): any[] {
  const { Paragraph, TextRun, HeadingLevel, AlignmentType } = docxModule
  const paragraphs: any[] = []
  const blocks = html.split(/<\/p>|<\/h[1-6]>|<\/li>|<\/blockquote>/)

  for (const block of blocks) {
    const clean = block.replace(/<[^>]+>/g, '').trim()
    if (!clean) continue

    if (block.match(/<h1/)) {
      paragraphs.push(new Paragraph({ text: clean, heading: HeadingLevel.HEADING_1 }))
    } else if (block.match(/<h2/)) {
      paragraphs.push(new Paragraph({ text: clean, heading: HeadingLevel.HEADING_2 }))
    } else if (block.match(/<h3/)) {
      paragraphs.push(new Paragraph({ text: clean, heading: HeadingLevel.HEADING_3 }))
    } else if (block.match(/<blockquote/)) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: clean, italics: true })],
        indent: { left: 720 }
      }))
    } else {
      paragraphs.push(new Paragraph({ text: clean }))
    }
  }

  return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: '' })]
}
