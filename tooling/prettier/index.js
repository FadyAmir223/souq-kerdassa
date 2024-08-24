import { fileURLToPath } from 'url'

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

/** @type { PrettierConfig | TailwindConfig } */
export default {
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 85,
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',

  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: fileURLToPath(
    new URL('../../tooling/tailwind/web.ts', import.meta.url),
  ),
  tailwindFunctions: ['cn', 'cva'],

  overrides: [
    {
      files: '*.json.hbs',
      options: { parser: 'json' },
    },
    {
      files: '*.js.hbs',
      options: { parser: 'babel' },
    },
  ],
}
