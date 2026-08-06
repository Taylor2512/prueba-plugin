# Pages Consolidation

## Current State

`src/examples/pages` now has 8 real files:

```txt
pages/
├─ CatalogPage.jsx
├─ DynamicRouter.jsx
├─ RuntimePageShell.jsx
├─ SchemaFamilyPage.jsx
├─ SchemasCatalogPage.jsx
├─ UniversalPage.jsx
├─ generatePages.js
└─ pageGenerator.js
```

`AppShell` still exists as a public export, but it is now just an alias of `DynamicRouter` from `src/examples/index.jsx`.

## What Was Consolidated

- Generated immersive pages moved into `generatePages.js` and `UniversalPage.jsx`.
- Repeated info panels moved into `DynamicInfoPanel`.
- The old per-page factory file and the old `*Info.jsx` files were removed.
- Navigation now uses `react-router-dom` instead of manual `pushState`.

## Recommended Usage

```javascript
import { AppShell } from '@/examples';

export function App() {
  return <AppShell initialPath="/" />;
}
```

```javascript
import { DesignerSingleUserPage } from '@/examples';

export function Example() {
  return <DesignerSingleUserPage currentPath="/designer/single-user" />;
}
```

```javascript
import { useNavigation } from '@/examples/helpers/navigation.js';

function NavigationMenu() {
  const nav = useNavigation();

  return (
    <>
      <button onClick={nav.toDesignerSingleUser}>Designer</button>
      <button onClick={nav.toRuntimeForm}>Form</button>
      <button onClick={nav.toCatalog}>Catalog</button>
    </>
  );
}
```

## Navigation Contract

1. `Link` and `NavLink` stay client-side.
2. `useNavigation()` delegates to `useNavigate()`.
3. `DynamicRouter` syncs with `window.location.pathname` and `popstate`.

## Verification

- `npm run build`
- Browser navigation across catalog, designer, form, viewer, and schema routes without full reload
