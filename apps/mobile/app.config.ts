import type { ConfigContext, ExpoConfig } from 'expo/config'

const bundleId = (() => {
  if (process.env.APP_VARIANT === 'production') return 'com.fadyamir.souqkerdassa'
  if (process.env.APP_VARIANT === 'preview')
    return 'com.fadyamir.souqkerdassa.preview'
  return 'com.fadyamir.souqkerdassa.dev'
})()

const appName = (() => {
  if (process.env.APP_VARIANT === 'production') return 'Souq Kerdassa'
  if (process.env.APP_VARIANT === 'preview') return 'Souq Kerdassa (preview)'
  return 'Souq Kerdassa (dev)'
})()

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: 'souq-kerdassa',
  scheme: 'expo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icons/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/icons/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: bundleId,
    supportsTablet: true,
  },
  android: {
    package: bundleId,
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon/foreground.png',
      backgroundImage: './assets/icons/adaptive-icon/background.png',
      backgroundColor: '#ffffff',
    },
  },
  extra: {
    eas: {
      projectId: '7f0f2227-000c-4362-bd64-a8c61e482907',
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 33,
          minSdkVersion: 23,
          buildToolsVersion: '34.0.0',
          kotlinVersion: '1.8.22',
        },
        ios: {
          deploymentTarget: '13.0',
          useFrameworks: 'static',
        },
      },
    ],
  ],
})
