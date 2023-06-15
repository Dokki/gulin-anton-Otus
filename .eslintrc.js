module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: false,
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['babel', 'prettier'],
  rules: {
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'no-console': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'babel/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
      },
    ],
    'no-unused-expressions': 'off',
    'import/no-anonymous-default-export': 0,
    'no-void': [
      'error',
      {
        allowAsStatement: true,
      },
    ],
    'no-nested-ternary': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['prettier', '@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  ignorePatterns: ['public/*', 'build/*'],
}
