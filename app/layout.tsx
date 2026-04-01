import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "../components/client-layout"
import Script from "next/script"
import { headers } from "next/headers"
import { getDomainContext } from "@/lib/domain.server"
import {
  getDomainMeta,
  getAlternatesForLayout,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "@/lib/domain"
import { createClient } from "@/lib/supabase/server"
import { defaultLocale, isRTL, locales, type Locale } from "@/lib/i18n"

// ---------------------------------------------------------------------------
// FONTS
// ---------------------------------------------------------------------------
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
})

// ---------------------------------------------------------------------------
// VIEWPORT
// ---------------------------------------------------------------------------
export const viewport: Viewport = {
  themeColor: "#F3EFE5",
  width: "device-width",
  initialScale: 1,
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
async function getLatestStartupDate(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("startups")
      .select("updated_at")
      .eq("status", "approved")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
    if (data?.updated_at) {
      return new Date(data.updated_at).toISOString().split("T")[0]
    }
  } catch (_) {}
  return new Date().toISOString().split("T")[0]
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const ctx        = await getDomainContext()
  const meta       = getDomainMeta(ctx)
  const alternates = getAlternatesForLayout("/", ctx)

  // Build hreflang alternates for all 16 languages
  const langAlternates: Record<string, string> = {}
  locales.forEach(lang => {
    langAlternates[lang] = lang === "en"
      ? meta.baseUrl
      : `${meta.baseUrl}/${lang}`
  })

  if (ctx === "in") {
    return {
      metadataBase: new URL(meta.baseUrl),
      title: {
        default: "UpForge — India's Verified Startup Registry & Founder Stories 2026",
        template: "%s | UpForge",
      },
      description:
        "UpForge is India's independent verified startup registry. Discover 5000+ Indian startups, unicorn founders, funding data, sector analysis, and deep-dive founder stories — all free, all verified.",
      keywords: [
        "UpForge", "UpForge startup registry", "UpForge founder chronicle",
        "Indian startup registry 2026", "Indian startup database 2026",
        "verified Indian startups", "startup directory India", "Indian startup list",
        "Indian startup founders 2026", "Indian unicorn founders", "founder stories India",
        "startup success stories India", "Indian entrepreneur profiles",
        "Indian unicorn list 2026", "Indian unicorn companies 2026",
        "funded Indian startups", "Indian startup funding", "startup valuation India",
        "Indian AI startups 2026", "Indian fintech startups 2026", "Indian edtech startups 2026",
        "Indian SaaS startups 2026", "Indian deep-tech startups", "quick commerce India startups",
        "Indian logistics startups", "Indian D2C startups", "Indian mobility startups",
        "startups in Mumbai 2026", "startups in Bangalore 2026", "startups in Delhi 2026",
        "fintech startups in Mumbai", "AI startups in Bangalore", "edtech startups near me",
        "startup ecosystem Hyderabad", "startup companies in Pune India",
        "best startups to work for India 2026", "top Indian startup jobs 2026",
        "unicorn startups Bangalore India", "emerging startups Delhi NCR",
        "startup funding news India today", "latest Indian startup news 2026",
        "Zepto startup", "Sarvam AI India", "CRED startup India", "Zerodha startup",
        "Groww startup", "Meesho startup", "Nykaa startup", "PhysicsWallah startup",
        "OYO startup", "Rapido startup",
      ],
      authors: [{ name: "UpForge Editorial", url: `${meta.baseUrl}/about` }],
      creator: "UpForge",
      publisher: "UpForge",
      category: "Business & Entrepreneurship",
      alternates: {
        ...alternates,
        canonical: meta.baseUrl,
        languages: langAlternates,
      },
      verification: {
        google: "g7JT-FIdylY2-2Pq4axQcEP8q_4tuG1fogKPWdWuF1Y",
      },
      icons: {
        icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      },
      manifest: "/site.webmanifest",
      openGraph: {
        type: "website",
        locale: meta.locale,
        url: meta.baseUrl,
        siteName: "UpForge",
        title: "UpForge — India's Verified Startup Registry & Founder Stories 2026",
        description:
          "5000+ verified Indian startups. Deep-dive founder profiles. Funding data. Sector analysis. The definitive startup intelligence platform for the Indian ecosystem.",
        images: [{
          url: `${meta.baseUrl}/og/founder-chronicle.png`,
          width: 1200, height: 630,
          alt: "UpForge — India's Verified Startup Registry 2026",
          type: "image/png",
        }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@upforge_in",
        creator: "@upforge_in",
        title: "UpForge — India's Verified Startup Registry & Founder Stories 2026",
        description: "5000+ Indian startups. Verified founder profiles. Funding & valuation data. Free. Independent.",
        images: [`${meta.baseUrl}/og/founder-chronicle.png`],
      },
      robots: {
        index: true, follow: true,
        googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
      },
    }
  }

  // .org
  return {
    metadataBase: new URL(meta.baseUrl),
    title: {
      default: "UpForge — Global Startup Registry & Emerging Market Intelligence 2026",
      template: "%s | UpForge",
    },
    description:
      "UpForge is the world's verified startup registry for emerging markets. Discover 5000+ startups, cross-border funding data, founder intelligence, and sector analysis — free and independent.",
    keywords: [
      "UpForge", "UpForge global registry", "UFRN startup registry",
      "global startup database 2026", "emerging market startups 2026",
      "verified startup directory", "global founder database", "cross-border venture data",
      "emerging market unicorns", "global startup intelligence", "startup registry worldwide",
      "India startup global", "Southeast Asia startups", "Africa startups database",
      "LatAm startup directory", "Middle East startups", "global unicorn list 2026",
      "international startup funding", "global venture capital data",
      "startup valuation database", "founder profiles global",
      "global AI startups 2026", "global fintech startups 2026", "global SaaS startups",
      "deep tech startups global", "cross-border startup investment", "startup ecosystem data",
      "UFRN lookup", "UpForge Registry Number", "startup registry number",
      "verified startup identity", "startup proof of existence", "startup verification number",
    ],
    authors: [{ name: "UpForge Editorial", url: `${meta.baseUrl}/about` }],
    creator: "UpForge",
    publisher: "UpForge",
    category: "Business & Entrepreneurship",
    alternates: {
      ...alternates,
      canonical: meta.baseUrl,
      languages: langAlternates,
    },
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: meta.locale,
      url: meta.baseUrl,
      siteName: "UpForge",
      title: "UpForge — Global Startup Registry & Emerging Market Intelligence 2026",
      description:
        "5000+ verified startups across emerging markets. Cross-border funding data. Founder intelligence. Sector analysis. The definitive global startup intelligence platform.",
      images: [{
        url: `${meta.baseUrl}/og/global-registry.png`,
        width: 1200, height: 630,
        alt: "UpForge — Global Startup Registry 2026",
        type: "image/png",
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@upforge_in",
      creator: "@upforge_in",
      title: "UpForge — Global Startup Registry & Emerging Market Intelligence 2026",
      description: "5000+ verified startups globally. Cross-border funding data. Founder profiles. Free. Independent.",
      images: [`${meta.baseUrl}/og/global-registry.png`],
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  }
}

// ---------------------------------------------------------------------------
// ROOT LAYOUT
// ---------------------------------------------------------------------------
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ctx         = await getDomainContext()
  const meta        = getDomainMeta(ctx)
  const latestDate  = await getLatestStartupDate()

  // Read locale from middleware header
  const headersList = await headers()
  const locale      = (headersList.get("x-upforge-locale") ?? defaultLocale) as Locale
  const dir         = isRTL(locale) ? "rtl" : "ltr"

  const organizationJsonLd = getOrganizationJsonLd(ctx)
  const websiteJsonLd      = getWebsiteJsonLd(ctx)
  const enrichedOrgJsonLd  = { ...organizationJsonLd, dateModified: latestDate }

  // Build per-language hreflang tags for all 16 locales
  const hreflangTags = locales.map(lang => ({
    lang,
    href: lang === "en" ? meta.baseUrl : `${meta.baseUrl}/${lang}`,
  }))

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${playfair.variable}`}
      data-domain={ctx}
    >
      <head>
        {/* RESOURCE HINTS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
        )}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://static.businessworld.in" />

        {/* Hreflang — all 16 languages + dual domain */}
        {hreflangTags.map(({ lang, href }) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}
        <link rel="alternate" hrefLang="en-IN"     href="https://www.upforge.in" />
        <link rel="alternate" hrefLang="en"        href="https://www.upforge.org" />
        <link rel="alternate" hrefLang="x-default" href="https://www.upforge.org" />

        {/* JSON-LD */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(enrichedOrgJsonLd) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>

      <body className="bg-background text-foreground flex flex-col min-h-screen antialiased font-sans">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3J7Y3695TK"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3J7Y3695TK', { page_path: window.location.pathname });
            gtag('config', 'G-18282');
            gtag('config', 'AW-18011511989');
          `}
        </Script>
        <ClientLayout domainContext={ctx}>{children}</ClientLayout>
      </body>
    </html>
  )
}
