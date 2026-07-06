import { getFileType } from '../../../src/lib/fileUtils.ts'
import fs from 'fs/promises'

export async function convertFileToHtml(filePath: string): Promise<string> {
  const type = getFileType(filePath)

  switch (type) {
    case 'html':
    case 'markdown':
    case 'text':
      return await fs.readFile(filePath, 'utf-8')
    case 'docx': {
      const { readDocx } = await import('./docx/reader.ts')
      return await readDocx(filePath)
    }
    case 'pdf': {
      const { readPdfText } = await import('./pdf/reader.ts')
      return await readPdfText(filePath)
    }
    case 'xlsx': {
      const { readXlsx, xlsxToHtmlTable } = await import('./xlsx/handler.ts')
      const data = await readXlsx(filePath)
      return xlsxToHtmlTable(data)
    }
    default:
      return await fs.readFile(filePath, 'utf-8')
  }
}
