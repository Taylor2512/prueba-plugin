import React, { useCallback, useMemo, useState } from 'react';
import PagesConfig from '../config/pagesConfig.json';
import { generatePages, GENERATED_ROUTES } from './generatePages.js';
import { CatalogPage } from './CatalogPage.jsx';
import { SchemaFamilyPage } from './SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './SchemasCatalogPage.jsx';

const specialPages = {
  catalog: CatalogPage,
  schemas: SchemasCatalogPage,
  'schema-family': SchemaFamilyPage,
};

export function DynamicRouter({ initialPath = '/' }) {
  const [currentPath, setCurrentPath] = useState(
    () => initialPath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );
  const generatedPageComponents = useMemo(() => generatePages(), []);

  const getPageKeyFromPath = useCallback((path) => {
    if (path === '/') return 'catalog';
    if (path.startsWith('/schemas/')) return 'schema-family';
    if (path === '/schemas') return 'schemas';

    // Busca en GENERATED_ROUTES
    for (const [key, route] of Object.entries(GENERATED_ROUTES)) {
      if (route === path) return key;
    }

    return 'catalog'; // fallback
  }, []);

  const getCurrentPageComponent = useCallback(() => {
    const pageKey = getPageKeyFromPath(currentPath);

    // Páginas especiales
    if (specialPages[pageKey]) {
      const SpecialPage = specialPages[pageKey];
      return <SpecialPage currentPath={currentPath} />;
    }

    // Páginas generadas
    if (generatedPageComponents[pageKey]) {
      const GeneratedPage = generatedPageComponents[pageKey];
      return <GeneratedPage currentPath={currentPath} />;
    }

    // Fallback a catálogo
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
