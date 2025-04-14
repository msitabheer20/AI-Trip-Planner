// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'next/core-web-vitals',
    ],
    rules: {
      '@next/next/no-img-element': 'warn',
      'react/no-unescaped-entities': 'warn',
  
      // disable base no-unused-vars
      'no-unused-vars': 'off',
      // TS unused-vars as warning
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
  
      // disable no-explicit-any entirely
      '@typescript-eslint/no-explicit-any': 'off',
    },
  };
  