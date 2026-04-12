// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // import
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // general
      'no-console': 'warn',
      'eqeqeq': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'curly': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': 'warn',

      // typescript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      // react
      'react/jsx-boolean-value': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
