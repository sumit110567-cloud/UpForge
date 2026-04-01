import { notFound } from "next/navigation"
import { locales, type Locale } from "@/lib/i18n"

export async function generateStaticParams() {
  // Generate static pages for all non-English locales
  return locales.filter(l => l !== 'en').map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  if (!locales.includes(params.lang)) notFound()
  // Root layout already handles html/body/dir — we just pass through
  return <>{children}</>
}
