import { auth } from '@repo/auth'
import { uuidSchema } from '@repo/validators'

import { ROUTES, SEARCH_PARAMS } from './utils/constants'

export default auth((req) => {
  const { nextUrl } = req

  // req.auth doesn't support database strategy because dbs doesn't support edge
  // https://next-auth.js.org/configuration/nextjs#caveats
  // const isLoggedIn = !!req.auth

  const cookie = req.cookies.get('authjs.session-token')?.value

  const isLoggedIn = uuidSchema.safeParse(cookie).success
  const isAuthRoute = ROUTES.authRoutes.includes(nextUrl.pathname)

  if (isAuthRoute) {
    if (!isLoggedIn) return
    return Response.redirect(new URL(ROUTES.defaultLoginRedirect, nextUrl))
  }

  const isPublicRoute = ROUTES.publicRoutesRegex.some((route) =>
    new RegExp(route).test(nextUrl.pathname),
  )
  if (isLoggedIn || isPublicRoute) return

  let redirectTo = nextUrl.pathname
  if (nextUrl.search) redirectTo += nextUrl.search
  const encodedRedirectTo = encodeURIComponent(redirectTo)

  return Response.redirect(
    new URL(
      `${ROUTES.login}?${SEARCH_PARAMS.redirectTo}=${encodedRedirectTo}`,
      nextUrl,
    ),
  )
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|icon.ico).*)'],
}
