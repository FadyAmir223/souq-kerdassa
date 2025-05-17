import Constants from 'expo-constants'

export const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri
  const localhost = debuggerHost?.split(':')[0]

  if (!localhost) return 'https://souqkerdassa.com' // env.EXPO_PUBLIC_API_URL
  return `http://${localhost}:3000`
}
