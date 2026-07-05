export interface PdfEditOptions {
  addWatermark?: string
  removePages?: number[]
}

export async function editPdfFile(inputPath: string, outputPath: string, options: PdfEditOptions): Promise<void> {
  await window.electronAPI.writeFile(outputPath, JSON.stringify(options))
}
