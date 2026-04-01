import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Handle Supabase Session first
  const supabaseResponse = await updateSession(request)

  const { pathname } = request.nextUrl
  
  // 2. Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 3. Redirect if there is no locale (e.g., user goes to /about)
  if (pathnameIsMissingLocale) {
    // You can implement more advanced language detection here
    const locale = defaultLocale 

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, static, etc.) and specific files
    '/((?!_next/static|_next/image|favicon.ico|images|og|api|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
  ],
}
