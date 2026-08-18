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
      // Entornos virtuales de Python: traen JS vendorizado que producía ~9.3k
      // errores y dejaba `npm run lint` inservible como gate.
      '.venv/**',
      '**/.venv/**',
      'venv/**',
      '**/site-packages/**',
      'dist/**',
      '**/dist/**',
      '**/dist/**',
      'build/**',
      '**/build/**',
      '.vite/**',
      '**/.vite/**',
      'public/**',
      'coverage/**',
      '**/coverage/**',
      'src/sisad-pdfme/pdf-lib/**',
      'src/sisad-pdfme/common/**',
      'src/sisad-pdfme/converter/**',
      'src/sisad-pdfme/generator/**',
      'src/sisad-pdfme/schemas/**',
      '*.min.js',
      '**/*.min.js',
      '*.map',
      '**/*.map',
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
      // The `@typescript-eslint/ban-types` rule caused runtime errors in some
      // ESLint plugin versions (missing export). Keep `no-explicit-any` as a
      // warning and use code reviews/ADRs to discourage top-level `unknown`.
      // Temporarily disabled to avoid blocking CI/local lint runs.
      // '@typescript-eslint/ban-types': [
      //   'warn',
      //   {
      //     types: {
      //       unknown: {
      //         message:
      //           'Avoid using `unknown` as a top-level type. Narrow it with type guards, or define a named alias/adapter that expresses intent.',
      //       },
      //       any: {
      //         message:
      //           'Avoid using `any`. Prefer a precise type or `unknown` + narrowing; use adapters or validators at boundaries.',
      //       },
      //     },
      //     extendDefaults: true,
      //   },
      // ],
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

  // Test suites and generated fixtures are intentionally noisier than product
  // code; keep lint focused on production surfaces.
  {
    files: ['tests/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-unresolved': 'off',
    },
  },

  {
    files: ['src/sisad-pdfme/ui/components/Designer/index.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
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
