export function getFileType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || ''
  const typeMap: Record<string, string> = {
    md: 'markdown',
    markdown: 'markdown',
    html: 'html',
    htm: 'html',
    txt: 'text',
    docx: 'docx',
    doc: 'docx',
    pdf: 'pdf',
    xlsx: 'xlsx',
    xls: 'xlsx',
    csv: 'csv',
    pptx: 'pptx',
    ppt: 'pptx',
    json: 'json'
  }
  return typeMap[ext] || 'unknown'
}

export function getFileExtension(format: string): string {
  const extMap: Record<string, string> = {
    markdown: 'md',
    html: 'html',
    text: 'txt',
    docx: 'docx',
    pdf: 'pdf',
    xlsx: 'xlsx',
    pptx: 'pptx',
    csv: 'csv',
    json: 'json'
  }
  return extMap[format] || 'txt'
}

export function getFileNameFromPath(filePath: string): string {
  return filePath.split(/[\\/]/).pop() || 'Untitled'
}

export function getFormatFilters(): { name: string; extensions: string[] }[] {
  return [
    { name: 'All Supported', extensions: ['md', 'html', 'txt', 'docx', 'pdf', 'xlsx', 'pptx', 'csv', 'json'] },
    { name: 'Markdown', extensions: ['md'] },
    { name: 'HTML', extensions: ['html', 'htm'] },
    { name: 'Text', extensions: ['txt'] },
    { name: 'Word Document', extensions: ['docx'] },
    { name: 'PDF', extensions: ['pdf'] },
    { name: 'Excel Spreadsheet', extensions: ['xlsx', 'xls'] },
    { name: 'PowerPoint', extensions: ['pptx'] },
    { name: 'CSV', extensions: ['csv'] },
    { name: 'JSON', extensions: ['json'] }
  ]
}
