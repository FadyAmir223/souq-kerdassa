import { auth } from '@repo/auth'
import { uuidSchema } from '@repo/validators'
import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/utils/is-authenticated'

import { checkPublicRoute } from './utils/check-public-route'
import { PAGES, SEARCH_PARAMS } from './utils/constants'

export default auth(async (req) => {
  const { nextUrl } = req

  if (nextUrl.pathname.startsWith('/admin')) {
    const authHeaders =
      req.headers.get('Authorization') ?? req.headers.get('authorization')

    if ((await isAuthenticated(authHeaders)) === false)
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
      })

    if (nextUrl.pathname === '/admin')
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))

    return
  }

  // req.auth doesn't support database strategy because dbs doesn't support edge
  // https://next-auth.js.org/configuration/nextjs#caveats
  // const isLoggedIn = !!req.auth

  const cookie = req.cookies.get('authjs.session-token')?.value

  const isLoggedIn = uuidSchema.safeParse(cookie).success
  const isAuthRoute = PAGES.authRoutes().includes(nextUrl.pathname)

  if (isAuthRoute) {
    if (!isLoggedIn) return

    return NextResponse.redirect(
      new URL(
        nextUrl.searchParams.get(SEARCH_PARAMS.redirectTo) ??
          PAGES.defaultLoginRedirect(),
        nextUrl,
      ),
    )
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
