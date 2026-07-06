import fs from 'fs/promises'

export async function writeDocx(html: string, outputPath: string): Promise<void> {
  const text = html.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  const lines = text.split('\n').filter(l => l.trim())

  let content = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
  content += '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n'
  content += '<w:body>\n'

  for (const line of lines) {
    const clean = line.trim()
    if (!clean) continue
    content += `<w:p><w:r><w:t xml:space="preserve">${escapeXml(clean)}</w:t></w:r></w:p>\n`
  }

  content += '</w:body>\n</w:document>'

  const zip = await import('jszip')
  const doc = zip.default()
  doc.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  doc.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  doc.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>')
  doc.file('word/document.xml', content)

  const buffer = await doc.generateAsync({ type: 'nodebuffer' })
  await fs.writeFile(outputPath, buffer)
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
