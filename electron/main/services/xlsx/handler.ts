import fs from 'fs/promises'

export async function readXlsx(filePath: string): Promise<string[][]> {
  const XLSX = await import('xlsx')
  const buffer = await fs.readFile(filePath)
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })
}

export async function writeXlsx(data: string[][], outputPath: string): Promise<void> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1')
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  await fs.writeFile(outputPath, buffer)
}

export function xlsxToHtmlTable(data: string[][]): string {
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
