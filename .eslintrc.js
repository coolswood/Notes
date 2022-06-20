module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  plugins: ['import', 'eslint-comments'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:eslint-comments/recommended',
  ],
  rules: {
    'import/no-cycle': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'enum',
        format: ['UPPER_CASE'],
      },
    ],
    'no-console': 'off',
    'no-undef': 'off',

    // we have TSC for this
    'import/no-unresolved': 'off',
    'import/namespace': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    // '@typescript-eslint/no-unnecessary-condition': 'error',
    'eslint-comments/no-unused-disable': 'error',

    '@typescript-eslint/ban-types': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',

  },
};
