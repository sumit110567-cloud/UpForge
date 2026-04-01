"use client"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Globe, ChevronDown, Check } from "lucide-react"
import { locales, localeNames, type Locale } from "@/lib/i18n"

export function LangSwitcher({ currentLang }: { currentLang: Locale }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Strip existing lang prefix and rebuild path
  const switchLang = (lang: Locale) => {
    const segments = pathname.split("/").filter(Boolean)
    const isLocalePrefix = locales.includes(segments[0] as Locale)
    const rest = isLocalePrefix ? segments.slice(1) : segments
    const newPath = lang === "en" ? `/${rest.join("/")}` : `/${lang}/${rest.join("/")}`
    router.push(newPath)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D0C8] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="w-3 h-3" />
        <span className="hidden sm:inline">{localeNames[currentLang]}</span>
        <span className="sm:hidden">{currentLang.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#D5D0C8] shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Select language"
        >
          {/* Grid layout: 2 columns for compact display */}
          <div className="grid grid-cols-2 gap-px bg-[#E8E4DC]">
            {locales.map((lang) => (
              <button
                key={lang}
                onClick={() => switchLang(lang)}
                role="option"
                aria-selected={lang === currentLang}
                className={`flex items-center justify-between gap-1 px-3 py-2.5 text-[11px] font-medium tracking-wide transition-colors bg-white hover:bg-[#F7F5F0] ${
                  lang === currentLang ? "text-[#1C1C1C]" : "text-[#666]"
                }`}
              >
                <span>{localeNames[lang]}</span>
                {lang === currentLang && <Check className="w-2.5 h-2.5 text-[#1C1C1C]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
