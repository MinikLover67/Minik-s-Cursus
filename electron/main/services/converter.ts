import { getFileType } from '../../../src/lib/fileUtils.ts'
import { readDocx } from './docx/reader.ts'
import { readPdfText } from './pdf/reader.ts'
import { readXlsx } from './xlsx/handler.ts'

export async function convertFileToHtml(filePath: string): Promise<string> {
  const type = getFileType(filePath)

  switch (type) {
    case 'docx':
      return await readDocx(filePath)
    case 'pdf':
      return await readPdfText(filePath)
    case 'xlsx': {
      const data = await readXlsx(filePath)
      return xlsxToHtml(data)
    }
    case 'html':
    case 'markdown':
    case 'text':
      return await import('fs').then(fs => fs.promises.readFile(filePath, 'utf-8'))
    default:
      throw new Error(`Unsupported file type: ${type}`)
  }
}

function xlsxToHtml(data: string[][]): string {
  if (data.length === 0) return '<p>No data</p>'
  let html = '<table><thead><tr>'
  for (const cell of data[0]) {
    html += `<th>${escapeHtml(String(cell || ''))}</th>`
  }
  html += '</tr></thead><tbody>'
  for (let i = 1; i < data.length; i++) {
    html += '<tr>'
    for (const cell of data[i]) {
      html += `<td>${escapeHtml(String(cell || ''))}</td>`
    }
    html += '</tr>'
  }
  html += '</tbody></table>'
  return html
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
