import { notFound } from "next/navigation"
import { locales, type Locale } from "@/lib/i18n"

export async function generateStaticParams() {
  // Generate static pages for all non-English locales
  return locales.filter(l => l !== 'en').map((lang) => ({ lang }))
}

interface LayoutProps {
  children: React.ReactNode
  // In Next.js 16, params must be a Promise
  params: Promise<{ lang: string }>
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps) {
  // 1. Await the params
  const resolvedParams = await params
  
  // 2. Cast to your specific Locale type for internal logic
  const lang = resolvedParams.lang as Locale

  // 3. Validation
  if (!locales.includes(lang)) {
    notFound()
  }

  // Root layout already handles html/body/dir — we just pass through
  return <>{children}</>
}
