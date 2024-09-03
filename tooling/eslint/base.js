/// <reference types="./types.d.ts" />

import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import turboPlugin from 'eslint-plugin-turbo'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

/**
 * All packages that leverage t3-env should use this rule
 */
export const restrictEnvAccess = tseslint.config({
  files: ['**/*.js', '**/*.ts', '**/*.tsx'],
  rules: {
    'no-restricted-properties': [
      'error',
      {
        object: 'process',
        property: 'env',
        message:
          "Use `import { env } from '@/env'` instead to ensure validated types.",
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        name: 'process',
        importNames: ['env'],
        message:
          "Use `import { env } from '@/env'` instead to ensure validated types.",
      },
    ],
  },
})

/** @type {Awaited<import('typescript-eslint').Config>} */
export default tseslint.config(
  { ignores: ['**/*.config.*'] },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      turbo: turboPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      ...turboPlugin.configs.recommended.rules,

      'no-console': 'warn',
      'prefer-template': 'error',
      'object-shorthand': 'error',

      /**
       * TODO: add rules
       *
       * <X x={''} />
       * <X x='' />
       *
       * import { x } from 'x'; import { y } from 'x'
       * import { x, y } from 'x'
       */

      // import
      'import/order': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

      // simple import sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // @typescript-eslint
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        { allowConstantLoopConditions: true },
      ],

      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
)
