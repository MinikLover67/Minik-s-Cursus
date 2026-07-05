import { getStoreValue } from '../utils/store.ts'

const prompts: Record<string, string> = {
  'continue': 'Continue the following text naturally and coherently:\n\n',
  'improve': 'Improve the writing quality, clarity and flow of the following text. Keep the meaning intact:\n\n',
  'proofread': 'Fix all grammar, spelling and punctuation errors in the following text. Return only the corrected text:\n\n',
  'translate-en': 'Translate the following text to English:\n\n',
  'translate-es': 'Translate the following text to Spanish:\n\n',
  'translate-fr': 'Translate the following text to French:\n\n',
  'translate-de': 'Translate the following text to German:\n\n',
  'translate-zh': 'Translate the following text to Chinese:\n\n',
  'explain-code': 'Explain what this code does in detail:\n\n',
  'add-comments': 'Add helpful comments to this code:\n\n',
  'summarize': 'Summarize the following text in a few sentences:\n\n',
  'simplify': 'Simplify the following text to make it easier to understand:\n\n'
}

export function getPrompt(task: string): string {
  const customPrompts = getStoreValue('customPrompts') as Record<string, string> | undefined
  return customPrompts?.[task] || prompts[task] || ''
}

export function getAvailablePrompts(): string[] {
  return Object.keys(prompts)
}

export function setCustomPrompt(task: string, prompt: string): void {
  const custom = (getStoreValue('customPrompts') as Record<string, string>) || {}
  custom[task] = prompt
  // Store is updated via IPC in the renderer
}
