import { getDictionary, locales, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  // Validate locale — 404 for unknown paths
  if (!locales.includes(params.lang)) notFound()
  return <>{children}</>
}
