import fs from 'fs/promises'

export async function createPptx(slides: { title: string; content: string }[], outputPath: string): Promise<void> {
  const PptxGenJS = (await import('pptxgenjs')).default
  const pptx = new PptxGenJS()

  for (const slide of slides) {
    const p = pptx.addSlide()
    p.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true })
    p.addText(slide.content, { x: 0.5, y: 1.5, w: '90%', fontSize: 14 })
  }

  const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
  await fs.writeFile(outputPath, buffer)
}

export function htmlToPptxSlides(html: string): { title: string; content: string }[] {
  const slides: { title: string; content: string }[] = []
  const sections = html.split(/<h[12][^>]*>/)

  for (let i = 1; i < sections.length; i++) {
    const titleMatch = sections[i].match(/^([^<]+)<\/h[12]>/)
    const title = titleMatch ? titleMatch[1].trim() : `Slide ${i}`
    const content = sections[i].replace(/^([^<]+)<\/h[12]>/, '').replace(/<[^>]+>/g, '').trim()
    slides.push({ title, content: content || '' })
  }

  if (slides.length === 0) {
    const text = html.replace(/<[^>]+>/g, '').trim()
    slides.push({ title: 'Presentation', content: text })
  }

  return slides
}
