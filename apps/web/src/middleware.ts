import { auth } from '@repo/auth'
import { uuidSchema } from '@repo/validators'
import { NextResponse } from 'next/server'

import { PAGES as ADMIN_PAGES } from '@/app/admin/_utils/constants'

import { checkPublicRoute } from './utils/check-public-route'
import { PAGES, SEARCH_PARAMS } from './utils/constants'

export default auth((req) => {
  const { nextUrl } = req

  if (nextUrl.pathname.startsWith('/admin')) {
    const isAuthRoute = nextUrl.pathname === ADMIN_PAGES.login
    const isLoggedIn = req.cookies.get('isAdmin')?.value === 'true'

    if (isAuthRoute) {
      if (!isLoggedIn) return
      return NextResponse.redirect(new URL(ADMIN_PAGES.dashboard, nextUrl))
    }

    if (nextUrl.pathname === '/admin')
      return NextResponse.redirect(new URL(ADMIN_PAGES.dashboard, nextUrl))

    if (isLoggedIn) return

    let redirectTo = nextUrl.pathname
    if (nextUrl.search) redirectTo += nextUrl.search
    const encodedRedirectTo = encodeURIComponent(redirectTo)

    return NextResponse.redirect(
      new URL(
        `${ADMIN_PAGES.login}?${SEARCH_PARAMS.redirectTo}=${encodedRedirectTo}`,
        nextUrl,
      ),
    )
  }

  // req.auth doesn't support database strategy because dbs doesn't support edge
  // https://next-auth.js.org/configuration/nextjs#caveats
  // const isLoggedIn = !!req.auth

  const cookie =
    req.cookies.get('authjs.session-token')?.value ??
    req.cookies.get('__Secure-authjs.session-token')?.value

  // @ts-expect-error ...
  const isAuthRoute = PAGES.authRoutes().includes(nextUrl.pathname)
  const isLoggedIn = uuidSchema.safeParse(cookie).success

  if (isAuthRoute) {
    if (!isLoggedIn) return
    return NextResponse.redirect(new URL(PAGES.defaultLoginRedirect(), nextUrl))
  }

  const isPublicRoute = checkPublicRoute(nextUrl.pathname)
  if (isLoggedIn || isPublicRoute) return

  let redirectTo = nextUrl.pathname
  if (nextUrl.search) redirectTo += nextUrl.search
  const encodedRedirectTo = encodeURIComponent(redirectTo)

  return NextResponse.redirect(
    new URL(
      `${PAGES.auth.login}?${SEARCH_PARAMS.redirectTo}=${encodedRedirectTo}`,
      nextUrl,
    ),
  )
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon).*)'],
}
