import { ReactNode } from "react"
import { Locale } from "@/lib/i18n"

// 1. Define the props where params is a Promise
interface LayoutProps {
  children: ReactNode
  params: Promise<{ lang: Locale }>
}

// 2. Make the component async and await the params
export default async function LocaleLayout({ 
  children, 
  params 
}: LayoutProps) {
  // Await the params before using them
  const { lang } = await params

  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  )
}
