const js = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');

const tsRecommended = tsPlugin.configs?.recommended?.rules ?? {};
const reactRecommended = react.configs?.recommended?.rules ?? {};
const hooksRecommended =
  reactHooks.configs?.flat?.recommended?.rules ??
  reactHooks.configs?.recommended?.rules ??
  {};
const a11yRecommended = jsxA11y.configs?.recommended?.rules ?? {};

const sharedPlugins = {
  react,
  'react-hooks': reactHooks,
  'jsx-a11y': jsxA11y,
  import: importPlugin,
};

const importSettings = {
  'import/resolver': {
    typescript: {
      project: './tsconfig.json',
      alwaysTryTypes: true,
    },
    node: {
      extensions: [
        '.js', '.jsx', '.mjs', '.cjs',
        '.ts', '.tsx', '.mts', '.cts',
        '.json', '.scss', '.css',
      ],
    },
  },
};

const jsRules = {
  ...js.configs.recommended.rules,
  'no-unused-vars': [
    'warn',
    {
      args: 'none',
      caughtErrors: 'none',
      ignoreRestSiblings: true,
    },
  ],
  'import/no-unresolved': 'warn',
};

const tsRules = {
  ...js.configs.recommended.rules,
  ...tsRecommended,

  // Reglas core que TypeScript cubre o que producen falsos positivos con
  // sintaxis/espacios de nombres TS.
  'no-undef': 'off',
  'no-redeclare': 'off',
  'no-dupe-class-members': 'off',
  'no-unused-vars': 'off',

  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      args: 'none',
      caughtErrors: 'none',
      ignoreRestSiblings: true,
    },
  ],
  '@typescript-eslint/no-explicit-any': 'warn',
  'import/no-unresolved': 'warn',
};

const reactRules = {
  ...reactRecommended,
  ...hooksRecommended,
  ...a11yRecommended,

  'react/react-in-jsx-scope': 'off',
  'react/jsx-uses-react': 'off',
  'react/prop-types': 'off',

  // Adopción gradual existente del repositorio.
  'react-hooks/exhaustive-deps': 'warn',
  'jsx-a11y/anchor-is-valid': 'off',
  'jsx-a11y/click-events-have-key-events': 'off',
  'jsx-a11y/interactive-supports-focus': 'off',
  'jsx-a11y/no-static-element-interactions': 'off',
};

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.venv/**',
      '**/.venv/**',
      'venv/**',
      '**/site-packages/**',

      'dist/**',
      '**/dist/**',
      'build/**',
      '**/build/**',
      '.vite/**',
      '**/.vite/**',
      'coverage/**',
      '**/coverage/**',
      'public/**',

      'playwright-report/**',
      'test-results/**',
      'reports/testing/playwright/**',
      '.playwright-cli/**',
      'testsprite_tests/tmp/**',
      'unificados/**',

      // Vendor embebido. No ocultar source propio.
      'src/sisad-pdfme/pdf-lib/**',

      '*.min.js',
      '**/*.min.js',
      '*.map',
      '**/*.map',
    ],
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },

  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: sharedPlugins,
    settings: importSettings,
    rules: jsRules,
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: sharedPlugins,
    settings: importSettings,
    rules: jsRules,
  },

  {
    files: ['**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: sharedPlugins,
    settings: {
      ...importSettings,
      react: { version: 'detect' },
    },
    rules: {
      ...jsRules,
      ...reactRules,
    },
  },

  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: false },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      ...sharedPlugins,
      '@typescript-eslint': tsPlugin,
    },
    settings: importSettings,
    rules: tsRules,
  },

  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      ...sharedPlugins,
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      ...importSettings,
      react: { version: 'detect' },
    },
    rules: {
      ...tsRules,
      ...reactRules,
    },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
