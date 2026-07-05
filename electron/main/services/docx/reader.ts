import mammoth from 'mammoth'
import fs from 'fs/promises'

export async function readDocx(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  const result = await mammoth.convertToHtml({ buffer })
  return result.value
}

export async function readDocxAsText(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}
