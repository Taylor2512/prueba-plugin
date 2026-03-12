module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
      },
    },
  },
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    // React 17+ with modern JSX runtime
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    // prefer warnings for unused vars to avoid noisy build failures
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // allow importing styles and other assets without errors
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    // accessibility rule adjustments (tweak per project needs)
    'jsx-a11y/anchor-is-valid': 'off',
  },
  overrides: [
    {
      files: ['**/*.jsx', '**/*.js'],
      rules: {},
    },
  ],
};