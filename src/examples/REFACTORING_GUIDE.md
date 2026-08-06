# Refactoring Guide: `src/examples`

## Summary

The example host is now organized around:

- `generatePages.js` for generated page exports
- `UniversalPage.jsx` for shared page behavior
- `DynamicRouter.jsx` for in-app navigation
- JSON-backed config and builders for templates, runtime profiles, and routes

This removes the need for a separate per-page factory file and eliminates duplicated per-page info components.

## Current Layout

```txt
src/examples/
├── builders/
├── catalog/
├── components/
├── config/
├── definitions/
├── helpers/
├── instances/
├── pages/
│   ├── CatalogPage.jsx
│   ├── DynamicRouter.jsx
│   ├── RuntimePageShell.jsx
│   ├── SchemaFamilyPage.jsx
│   ├── SchemasCatalogPage.jsx
│   ├── UniversalPage.jsx
│   ├── generatePages.js
│   └── pageGenerator.js
└── routes/
```

## Main Patterns

### 1. Instance factories

`src/examples/instances/Instances.js` keeps the instance construction centralized so each runtime mode only declares its differences.

### 2. Data-driven templates

`buildShowcaseTemplate()` and `buildMultiUserShowcaseTemplate()` use JSON-backed layout and sample data, which keeps the examples easy to tune without duplicating constants.

### 3. Shared page runtime

`generatePages.js` produces the runtime pages from config, and `UniversalPage.jsx` renders them with one shared code path.

### 4. Router-driven navigation

`DynamicRouter.jsx` owns `currentPath`, and `helpers/navigation.js` now calls `useNavigate()` so navigation stays inside the router.

## Adding a New Example

1. Add the route and page metadata in `src/examples/config/pagesConfig.json`.
2. Add or reuse an instance factory in `src/examples/instances/Instances.js`.
3. Add any needed builder or selector logic in the shared builders/helpers.
4. Export the page through `generatePages.js` if it belongs to the generated runtime family.

## Useful Commands

```bash
npm run build
npm run lint
```

## Notes

- Keep `src/examples` host-side only.
- Keep navigation on `react-router-dom`.
- Prefer config over page-specific duplication.
