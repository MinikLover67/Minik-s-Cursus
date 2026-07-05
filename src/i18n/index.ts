import { en } from './en.ts'
import { es } from './es.ts'
import { fr } from './fr.ts'
import { de } from './de.ts'
import { zh } from './zh.ts'
import { ja } from './ja.ts'
import { ko } from './ko.ts'

export const locales: Record<string, Record<string, string>> = {
  en, es, fr, de, zh, ja, ko
}

export function t(key: string, lang: string = 'en'): string {
  return locales[lang]?.[key] || locales['en']?.[key] || key
}
