import fs from 'fs/promises'

export async function readXlsx(filePath: string): Promise<string[][]> {
  const buffer = await fs.readFile(filePath)
  const content = buffer.toString('utf-8')
  const lines = content.split('\n').map(line => line.split(',').map(cell => cell.trim()))
  return lines
}

export async function writeXlsx(data: string[][], outputPath: string): Promise<void> {
  const csv = data.map(row => row.join(',')).join('\n')
  await fs.writeFile(outputPath, csv, 'utf-8')
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
