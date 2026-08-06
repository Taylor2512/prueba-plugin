import PagesConfig from '../config/pagesConfig.json';
import { useNavigate } from 'react-router-dom';
import { getSchemaRoute } from '../routes/routeDefinitions.js';

export const navigationHelpers = {
  // Navegar a página generada
  toGeneratedPage: (pageKey) => {
    const route = PagesConfig.routes?.[pageKey];
    if (!route) throw new Error(`Route not found for page: ${pageKey}`);
    return route;
  },

  // Navegar a página especial
  toCatalog: () => '/',
  toSchemas: () => '/schemas',
  toSchemaFamily: (familySlug) => getSchemaRoute(familySlug),

  // Batch navigation helpers
  toDesignerSingleUser: () => navigationHelpers.toGeneratedPage('designer-single-user'),
  toDesignerMultiUser: () => navigationHelpers.toGeneratedPage('designer-multi-user'),
  toRuntimeForm: () => navigationHelpers.toGeneratedPage('runtime-form'),
  toRuntimeViewer: () => navigationHelpers.toGeneratedPage('runtime-viewer'),
};

export function useNavigation() {
  const navigate = useNavigate();
  const go = (path) => navigate(path);
  return {
    go,
    // Shortcuts
    toCatalog: () => navigate(navigationHelpers.toCatalog()),
    toDesignerSingleUser: () => navigate(navigationHelpers.toDesignerSingleUser()),
    toDesignerMultiUser: () => navigate(navigationHelpers.toDesignerMultiUser()),
    toRuntimeForm: () => navigate(navigationHelpers.toRuntimeForm()),
    toRuntimeViewer: () => navigate(navigationHelpers.toRuntimeViewer()),
    toSchemas: () => navigate(navigationHelpers.toSchemas()),
    toSchemaFamily: (slug) => navigate(navigationHelpers.toSchemaFamily(slug)),
  };
}
