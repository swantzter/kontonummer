import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  ...neostandard({
    ignores: [
      ...resolveIgnoresFromGitignore(),
    ],
    ts: true,
  }),
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '.*.js', '*.mjs'],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    name: 'swantzter/custom',
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['warn', {
        allowNumber: true,
        allowBoolean: true,
        allowRegExp: true,
        allowAny: true,
      }],
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/only-throw-error': ['error', {
        allowThrowingUnknown: true,
      }],
      '@stylistic/comma-dangle': ['warn', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
      'no-void': 'off',
      'no-console': 'warn',
    },
  },
  {
    name: 'swantzter/tests',
    files: ['**/*.test.ts', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': false,
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 3,
      }],
    },
  },
]
