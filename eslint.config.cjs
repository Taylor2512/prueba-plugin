// Migrated flat ESLint config from .eslintrc.cjs and .eslintignore
 
// Build a config compatible with flat config by merging recommended rules
const getRules = (cfg) => (cfg && cfg.rules ? cfg.rules : {});
let eslintRecommendedRules = {};
let reactRecommendedRules = {};
let reactHooksRecommendedRules = {};
let jsxA11yRecommendedRules = {};
let tsRecommendedRules = {};
try {
  // eslint core recommended
  eslintRecommendedRules = getRules(require('eslint/conf/eslint-recommended'));
} catch (e) {}
try {
  const reactPlugin = require('eslint-plugin-react');
  reactRecommendedRules = getRules(reactPlugin.configs && reactPlugin.configs.recommended);
} catch (e) {}
try {
  const rh = require('eslint-plugin-react-hooks');
  reactHooksRecommendedRules = getRules(rh.configs && rh.configs.recommended);
} catch (e) {}
try {
  const jsxA11y = require('eslint-plugin-jsx-a11y');
  jsxA11yRecommendedRules = getRules(jsxA11y.configs && jsxA11y.configs.recommended);
} catch (e) {}
try {
  const tsPlugin = require('@typescript-eslint/eslint-plugin');
  tsRecommendedRules = getRules(tsPlugin.configs && tsPlugin.configs.recommended);
} catch (e) {}

const mergedRecommendedRules = Object.assign(
  {},
  eslintRecommendedRules,
  reactRecommendedRules,
  reactHooksRecommendedRules,
  jsxA11yRecommendedRules,
  tsRecommendedRules
);

module.exports = [
  // global ignores (migrated from .eslintignore)
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.vite/**',
      'public/**',
      'coverage/**',
      'src/sisad-pdfme/pdf-lib/**',
      'src/sisad-pdfme/common/**',
      'src/sisad-pdfme/converter/**',
      'src/sisad-pdfme/generator/**',
      'src/sisad-pdfme/schemas/**',
      '*.min.js',
      '*.map',
    ],
  },

  // rules for JS/JSX/TS/TSX files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // Optionally enable project when using type-aware rules
        // project: './tsconfig.json',
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      import: require('eslint-plugin-import'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    settings: {
      react: { version: 'detect' },
      // Use the TypeScript resolver so aliases from tsconfig.json are resolved
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: { extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.ts', '.tsx'] },
      },
    },
    // merged recommended rules from core and plugins
    rules: Object.assign({}, mergedRecommendedRules, {
      // project-specific overrides
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'import/no-unresolved': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'jsx-a11y/anchor-is-valid': 'off',
      // Relax some rules that are noisy for this codebase and/or covered by TypeScript
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'react/prop-types': 'off',
    }),
    linterOptions: { reportUnusedDisableDirectives: true },
  },

  // specific overrides for pure JS/JSX if needed
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
