import { useIsExtraSmall, useIsMedium, useIsSmall } from '@/hooks/use-responsive'

export function useResponsiveImageSize(): number {
  const isExtraSmall = useIsExtraSmall()
  const isSmall = useIsSmall()
  const isMedium = useIsMedium()

  if (isExtraSmall) return 640
  if (isSmall) return 384
  if (isMedium) return 96
  return 256
}
