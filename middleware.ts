import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale, type Locale } from './lib/i18n'

// Match locale from Accept-Language header
function getPreferredLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language') ?? ''
  // Parse "en-US,en;q=0.9,es;q=0.8" → ['en', 'es']
  const preferred = acceptLang
    .split(',')
    .map(s => s.split(';')[0].trim().split('-')[0].toLowerCase())
    .filter(Boolean)

  for (const lang of preferred) {
    if (locales.includes(lang as Locale)) return lang as Locale
  }
  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''
  const pathname = request.nextUrl.pathname

  // ── Domain detection ─────────────────────────────────────────────────────
  const isOrg =
    hostname.includes('upforge.org') ||
    process.env.NEXT_PUBLIC_DOMAIN === 'org'
  const domainContext = isOrg ? 'org' : 'in'

  // ── Locale detection ─────────────────────────────────────────────────────
  // Check if pathname already has a locale prefix
  const segments = pathname.split('/').filter(Boolean)
  const pathnameLocale = locales.includes(segments[0] as Locale)
    ? (segments[0] as Locale)
    : null

  // If no locale in URL and not default (en), redirect to locale URL
  // We use cookie to remember user's choice
  const cookieLang = request.cookies.get('upforge-lang')?.value as Locale | undefined
  const detectedLocale = cookieLang ?? getPreferredLocale(request)

  // Redirect non-English users to their locale URL if they hit /
  // Skip redirects for static files, API routes, etc.
  const shouldRedirect =
    !pathnameLocale &&
    detectedLocale !== defaultLocale &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api') &&
    !pathname.includes('.')

  if (shouldRedirect) {
    const url = request.nextUrl.clone()
    url.pathname = `/${detectedLocale}${pathname}`
    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.headers.set('x-upforge-domain', domainContext)
    redirectResponse.headers.set('x-upforge-pathname', pathname)
    return redirectResponse
  }

  // ── Build response ───────────────────────────────────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const currentLocale = pathnameLocale ?? defaultLocale
  response.headers.set('x-upforge-domain', domainContext)
  response.headers.set('x-upforge-pathname', pathname)
  response.headers.set('x-upforge-locale', currentLocale)

  // ── Supabase SSR session ─────────────────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.headers.set('x-upforge-domain', domainContext)
          response.headers.set('x-upforge-pathname', pathname)
          response.headers.set('x-upforge-locale', currentLocale)
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.headers.set('x-upforge-domain', domainContext)
          response.headers.set('x-upforge-pathname', pathname)
          response.headers.set('x-upforge-locale', currentLocale)
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
