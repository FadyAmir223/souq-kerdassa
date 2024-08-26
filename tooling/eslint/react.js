/// <reference types="./types.d.ts" />

import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

export default tseslint.config(
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    extends: [...tailwindcssPlugin.configs['flat/recommended']],
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,

      'react/self-closing-comp': 'error',
      'react/destructuring-assignment': 'warn',
      'react/jsx-key': 'error',

      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-contradicting-classname': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        React: 'writable',
      },
    },
  },
)
