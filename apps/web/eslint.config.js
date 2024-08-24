import baseConfig, { restrictEnvAccess } from '@repo/eslint-config/base'
import reactConfig from '@repo/eslint-config/react'
import nextConfig from '@repo/eslint-config/next'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextConfig,
  ...restrictEnvAccess,
]
