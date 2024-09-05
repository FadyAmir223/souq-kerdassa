import { PAGES } from './constants'

const { staticRoutes, dynamicRoutePatterns } = Object.values({
  ...PAGES.public,
  ...PAGES.other,
}).reduce(
  (acc, route) => {
    if (typeof route === 'string') {
      acc.staticRoutes.push(route)
    } else if (typeof route === 'function') {
      // @ts-expect-error not important typing
      const dynamicRoute = route(...Array(route.length).fill(':param'))
      const regexPattern = dynamicRoute.replace(/:[^/]+/g, '[^/]+')
      acc.dynamicRoutePatterns.push(new RegExp(`^${regexPattern}$`))
    }
    return acc
  },
  { staticRoutes: [] as string[], dynamicRoutePatterns: [] as RegExp[] },
)

export function checkPublicRoute(segment: string): boolean {
  return (
    staticRoutes.includes(segment) ||
    dynamicRoutePatterns.some((regex) => regex.test(segment))
  )
}
