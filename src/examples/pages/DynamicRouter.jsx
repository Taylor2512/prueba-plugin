import React, { useCallback, useMemo, useState } from 'react';
import { EXAMPLE_PRIMARY_ROUTES, EXAMPLE_ROUTE_MAP } from '../config/examplesManifest.js';
import { FAMILY } from '../catalog/familyCatalog.js';
import { generatePages, GENERATED_ROUTES } from './generatePages.js';
import { CatalogPage } from './CatalogPage.jsx';
import { SchemaFamilyPage } from './SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './SchemasCatalogPage.jsx';

export function DynamicRouter({ initialPath = '/' }) {
  const [currentPath, setCurrentPath] = useState(
    () => initialPath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );
  const generatedPageComponents = useMemo(() => generatePages(), []);
  const routeKeyByPath = useMemo(
    () =>
      Object.fromEntries([
        ...EXAMPLE_PRIMARY_ROUTES.map((route) => [route.path || EXAMPLE_ROUTE_MAP[route.id], route.id]),
        ...Object.entries(GENERATED_ROUTES),
      ].filter(([, path]) => Boolean(path))),
    [],
  );

  const getPageKeyFromPath = useCallback((path) => {
    if (path.startsWith('/schemas/')) return 'schema-family';
    return routeKeyByPath[path] || 'catalog';
  }, [routeKeyByPath]);

  const getCurrentPageComponent = useCallback(() => {
    const pageKey = getPageKeyFromPath(currentPath);

    if (pageKey === 'catalog') return <CatalogPage currentPath={currentPath} />;
    if (pageKey === 'schemas') return <SchemasCatalogPage currentPath={currentPath} />;
    if (pageKey === 'schema-family') {
      const schemaSlug = currentPath.replace('/schemas/', '');
      const familyPage = FAMILY.find((family) => family.slug === schemaSlug);
      return (
        <SchemaFamilyPage
          currentPath={currentPath}
          family={{
            ...familyPage,
            key: familyPage?.key || schemaSlug,
            slug: familyPage?.slug || schemaSlug,
            title: familyPage?.title || schemaSlug,
            description: familyPage?.description || schemaSlug,
            types: familyPage?.types || [],
          }}
        />
      );
    }

    if (generatedPageComponents[pageKey]) {
      const GeneratedPage = generatedPageComponents[pageKey];
      return <GeneratedPage currentPath={currentPath} />;
    }

    return <CatalogPage currentPath={currentPath} />;
  }, [currentPath, getPageKeyFromPath, generatedPageComponents]);

  const navigateTo = useCallback((path) => {
    setCurrentPath(path);
    window.history.pushState({ path }, '', path);
  }, []);

  // Handle browser back/forward
  React.useEffect(() => {
    const handlePopState = (event) => {
      const path = event.state?.path || window.location.pathname || '/';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <DynamicRouterContext.Provider value={{ currentPath, navigateTo }}>
      {getCurrentPageComponent()}
    </DynamicRouterContext.Provider>
  );
}

export const DynamicRouterContext = React.createContext({
  currentPath: '/',
  navigateTo: () => {},
});

export function useRouter() {
  return React.useContext(DynamicRouterContext);
}
