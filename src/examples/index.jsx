/**
 * API pública del laboratorio de ejemplos del runtime reusable.
 *
 * `getLab()` devuelve las rutas ya resueltas para el router del host; el resto
 * de exports son la superficie que consumen tests e integraciones.
 */
import { buildRouteDefinitions } from './pages.jsx';

export function getLab() {
  return buildRouteDefinitions().map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
    description: route.description,
    shell: route.shell,
    element: route.render(),
  }));
}

export { buildRouteDefinitions };

export { CatalogPage, RuntimePage, RuntimePageShell, SchemaFamilyPage, SchemasCatalogPage } from './pages.jsx';

export {
  ControllerPanel,
  DocumentationShell,
  DynamicInfoPanel,
  EventLog,
  FamilyBadgeList,
  FamilyOverview,
  ImmersiveShell,
  InfoCard,
  InfoPanelStack,
  MetricGrid,
  PreviewFrame,
  RouteCard,
  RuntimeViewport,
  Topbar,
  resolvePath,
} from './ui.jsx';

export {
  CONFIG_PROFILES,
  DEMO_DOCUMENTS,
  EXAMPLES_MANIFEST,
  EXAMPLE_PRIMARY_ROUTES,
  EXAMPLE_ROUTE_MAP,
  FAMILY,
  FAMILY_META,
  FAMILY_ROUTE_CONFIG,
  FAMILY_ROUTE_GROUPS,
  IMMERSIVE_ROUTE_OPTIONS,
  MULTI_USER_FAMILY_KEYS,
  MULTI_USER_RECIPIENTS,
  PAGE_ROUTES,
  PRIMARY_ROUTE_GROUPS,
  ROUTE_PATHS,
  createRuntimeConfig,
  getExamplePageConfig,
  getSchemaRoute,
  resolveFamilyGroups,
  typesOf,
} from './catalog.js';

export {
  buildMultiUserShowcaseTemplate,
  buildShowcaseTemplate,
  buildSnapshotFormTemplate,
  buildSnapshotFormValues,
} from './builders.js';

export { createExampleInstance } from './instances.js';

export { useController, useEventLog, useRuntimeConfig } from './hooks.js';

export {
  appendTemplatePages,
  buildBundle,
  buildHref,
  clone,
  create,
  createCollaboration,
  createTemplate,
  createUploadedDocument,
  getBundleFilename,
  normalizeHostData,
} from './hostBundle.js';
