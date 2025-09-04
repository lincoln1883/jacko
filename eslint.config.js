import js from '@eslint/js'
import tsEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    files: ['app/frontend/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint,
      react: react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier: prettier,
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['app/frontend/**/*.test.{js,jsx,ts,tsx}', 'app/frontend/**/*.spec.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        document: 'readonly',
        window: 'readonly',
        global: 'readonly',
        console: 'readonly',
        jest: 'readonly',
        TestingLibraryMatchers: 'readonly',
        HTMLSelectElement: 'readonly',
        HTMLElement: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['app/frontend/test/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        vi: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        jest: 'readonly',
        TestingLibraryMatchers: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
]
