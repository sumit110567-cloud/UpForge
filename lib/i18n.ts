export const locales = [
  'en', 'es', 'de', 'ja', 'fr', 'pt',
  'ru', 'zh', 'ar', 'hi', 'id', 'tr',
  'ko', 'it', 'nl', 'pl'
] as const

export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  ja: '日本語',
  fr: 'Français',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ar: 'العربية',
  hi: 'हिन्दी',
  id: 'Indonesia',
  tr: 'Türkçe',
  ko: '한국어',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
}

// RTL languages
export const rtlLocales: Locale[] = ['ar']

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

export type Dictionary = {
  nav: {
    home: string
    indianRegistry: string
    globalRegistry: string
    journal: string
    reports: string
    about: string
    verifyUFRN: string
    listStartup: string
  }
  home: {
    heroTitle: string
    heroSubtitle: string
    founderChronicle: string
    founderSubtitle: string
    exploreRegistry: string
    submitStartup: string
  }
  footer: {
    founderChronicle: string
    startupRegistry: string
    blog: string
    submitStartup: string
    about: string
  }
  meta: {
    title: string
    description: string
  }
}

// Server-side dictionary loader — runs at build time, zero client JS
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en:  () => import('../dictionaries/en.json').then(m => m.default as Dictionary),
  es:  () => import('../dictionaries/es.json').then(m => m.default as Dictionary),
  de:  () => import('../dictionaries/de.json').then(m => m.default as Dictionary),
  ja:  () => import('../dictionaries/ja.json').then(m => m.default as Dictionary),
  fr:  () => import('../dictionaries/fr.json').then(m => m.default as Dictionary),
  pt:  () => import('../dictionaries/pt.json').then(m => m.default as Dictionary),
  ru:  () => import('../dictionaries/ru.json').then(m => m.default as Dictionary),
  zh:  () => import('../dictionaries/zh.json').then(m => m.default as Dictionary),
  ar:  () => import('../dictionaries/ar.json').then(m => m.default as Dictionary),
  hi:  () => import('../dictionaries/hi.json').then(m => m.default as Dictionary),
  id:  () => import('../dictionaries/id.json').then(m => m.default as Dictionary),
  tr:  () => import('../dictionaries/tr.json').then(m => m.default as Dictionary),
  ko:  () => import('../dictionaries/ko.json').then(m => m.default as Dictionary),
  it:  () => import('../dictionaries/it.json').then(m => m.default as Dictionary),
  nl:  () => import('../dictionaries/nl.json').then(m => m.default as Dictionary),
  pl:  () => import('../dictionaries/pl.json').then(m => m.default as Dictionary),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries['en']
  return loader()
}
