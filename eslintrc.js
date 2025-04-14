// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',          // Use the TypeScript parser
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],              // Point to your tsconfig
  },
  plugins: ['@typescript-eslint'],              // Enable the TS plugin
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',    // Recommended TS rules
    'next/core-web-vitals',
  ],
  rules: {
    // Next.js overrides
    '@next/next/no-img-element': 'warn',
    'react/no-unescaped-entities': 'warn',

    // Turn off the base no-unused-vars (to avoid conflict)
    'no-unused-vars': 'off',

    // TS-specific unused-vars as a warning, ignore _-prefixed names
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Other TS rules
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
