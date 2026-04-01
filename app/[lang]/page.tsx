import { notFound } from "next/navigation"
import { getDictionary, locales, type Locale } from "@/lib/i18n"
import { FounderChronicleClient } from "../../components/founder-chronicle-client"
import { FOUNDERS } from "../../data/founders"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return locales.filter(l => l !== 'en').map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}): Promise<Metadata> {
  if (!locales.includes(params.lang)) notFound()
  const dict = await getDictionary(params.lang)
  const base = "https://www.upforge.in"

  const langAlternates: Record<string, string> = {}
  locales.forEach(l => {
    langAlternates[l] = l === 'en' ? base : `${base}/${l}`
  })

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `${base}/${params.lang}`,
      languages: langAlternates,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${base}/${params.lang}`,
      siteName: "UpForge",
      images: [{ url: `${base}/og/founder-chronicle.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@upforge_in",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  }
}

async function getLatestDate(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("startups")
      .select("updated_at")
      .eq("status", "approved")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
    if (data?.updated_at) return new Date(data.updated_at).toISOString().split("T")[0]
  } catch (_) {}
  return new Date().toISOString().split("T")[0]
}

export default async function LocaleHomePage({
  params,
}: {
  params: { lang: Locale }
}) {
  if (!locales.includes(params.lang)) notFound()

  const [dict] = await Promise.all([
    getDictionary(params.lang),
    getLatestDate(), // warm the Supabase connection
  ])

  const p = params.lang

  return (
    <FounderChronicleClient
      founders={FOUNDERS}
      internalLinks={[
        { l: dict.footer.startupRegistry,  h: `/${p}/startup`, desc: "5000+ verified startups" },
        { l: dict.footer.submitStartup,    h: `/${p}/submit`,  desc: "Get listed free"         },
        { l: dict.footer.founderChronicle, h: `/${p}/blog`,    desc: "Intelligence & analysis" },
        { l: dict.footer.about,            h: `/${p}/about`,   desc: "Our mission"             },
      ]}
      footerLinks={[
        { l: dict.footer.founderChronicle, h: `/${p}`         },
        { l: dict.footer.startupRegistry,  h: `/${p}/startup` },
        { l: dict.footer.blog,             h: `/${p}/blog`    },
        { l: dict.footer.submitStartup,    h: `/${p}/submit`  },
        { l: dict.footer.about,            h: `/${p}/about`   },
      ]}
    />
  )
}
