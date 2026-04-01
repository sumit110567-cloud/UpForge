import { getDictionary, locales, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { FounderChronicleClient } from "../../components/founder-chronicle-client"
import { FOUNDERS } from "../../data/founders"
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
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `https://www.upforge.in/${params.lang}`,
      languages: Object.fromEntries(
        locales.map(l => [l, l === 'en' ? 'https://www.upforge.in' : `https://www.upforge.in/${l}`])
      ),
    },
  }
}

export default async function LocaleHomePage({
  params,
}: {
  params: { lang: Locale }
}) {
  if (!locales.includes(params.lang)) notFound()
  const dict = await getDictionary(params.lang)

  return (
    <FounderChronicleClient
      founders={FOUNDERS}
      dict={dict}
      internalLinks={[
        { l: dict.footer.startupRegistry, h: `/${params.lang}/startup`, desc: "5000+ verified startups" },
        { l: dict.footer.submitStartup,   h: `/${params.lang}/submit`,  desc: "Get listed free"         },
        { l: dict.footer.founderChronicle, h: `/${params.lang}/blog`,   desc: "Intelligence & analysis" },
        { l: dict.footer.about,            h: `/${params.lang}/about`,  desc: "Our mission"             },
      ]}
      footerLinks={[
        { l: dict.footer.founderChronicle, h: `/${params.lang}`         },
        { l: dict.footer.startupRegistry,  h: `/${params.lang}/startup` },
        { l: dict.footer.blog,             h: `/${params.lang}/blog`    },
        { l: dict.footer.submitStartup,    h: `/${params.lang}/submit`  },
        { l: dict.footer.about,            h: `/${params.lang}/about`   },
      ]}
    />
  )
}
