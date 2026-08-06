import PagesConfig from '../config/pagesConfig.json';
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
  const nav = navigationHelpers;
  return {
    go: (path) => {
      window.history.pushState({ path }, '', path);
      // Trigger popstate to update router
      window.dispatchEvent(new PopStateEvent('popstate', { state: { path } }));
    },
    // Shortcuts
    toCatalog: () => window.history.pushState({ path: '/' }, '', '/'),
    toDesignerSingleUser: () => window.history.pushState({ path: nav.toDesignerSingleUser() }, '', nav.toDesignerSingleUser()),
    toDesignerMultiUser: () => window.history.pushState({ path: nav.toDesignerMultiUser() }, '', nav.toDesignerMultiUser()),
    toRuntimeForm: () => window.history.pushState({ path: nav.toRuntimeForm() }, '', nav.toRuntimeForm()),
    toRuntimeViewer: () => window.history.pushState({ path: nav.toRuntimeViewer() }, '', nav.toRuntimeViewer()),
    toSchemas: () => window.history.pushState({ path: '/schemas' }, '', '/schemas'),
    toSchemaFamily: (slug) => window.history.pushState({ path: navigationHelpers.toSchemaFamily(slug) }, '', navigationHelpers.toSchemaFamily(slug)),
  };
}
