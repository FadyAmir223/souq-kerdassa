import { useMediaQuery } from 'react-responsive'

export function useIsExtraSmall() {
  return useMediaQuery({ query: '(max-width: 480px)' })
}

export function useIsSmall() {
  return useMediaQuery({ query: '(max-width: 768px)' })
}

export function useIsMedium() {
  return useMediaQuery({ query: '(max-width: 976px)' })
}
