import Constants from 'expo-constants'

import { env } from '@/lib/env'

export const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri
  const localhost = debuggerHost?.split(':')[0]

  if (!localhost) return env.EXPO_PUBLIC_SITE_URL
  return `http://${localhost}:3000`
}
