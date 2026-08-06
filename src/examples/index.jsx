/**
 * Punto de entrada de los ejemplos del runtime reusable.
 *
 * AppShell: Punto de entrada único con routing dinámico (sin recarga de página)
 * generatePages: Factory que crea páginas automáticamente desde pagesConfig.json
 * API pública reexportada para tests y host integraciones
 */
import { buildLab } from './definitions/Definitions.jsx';
import { AppShell } from './pages/AppShell.jsx';
import { DynamicRouter, useRouter } from './pages/DynamicRouter.jsx';
import { DesignerMultiUserPage, DesignerSingleUserPage, RuntimeFormPage, RuntimeViewerPage } from './pages/generatePages.js';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { SchemaFamilyPage } from './pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './pages/SchemasCatalogPage.jsx';

export function getLab() {
  return buildLab();
}

// Main entry point with dynamic routing (no page reload)
export { AppShell, DynamicRouter, useRouter };

// Individual page exports (for direct access / testing)
export {
  CatalogPage,
  DesignerMultiUserPage,
  DesignerSingleUserPage,
  RuntimeFormPage,
  RuntimeViewerPage,
  SchemaFamilyPage,
  SchemasCatalogPage,
};

export {
  ControllerPanel,
  DocumentationShell,
  EventLog,
  ImmersiveShell,
  InfoPanelStack,
  Topbar,
  FamilyBadgeList,
  InfoCard,
  MetricGrid,
  PreviewFrame,
  RouteCard,
  RuntimeViewport,
} from './components/Ui.jsx';

export { FAMILY } from './catalog/familyCatalog.js';
export { DEMO_DOCUMENTS } from './fixtures/documents.js';
export { MULTI_USER_FAMILY_KEYS, MULTI_USER_RECIPIENTS } from './fixtures/recipients.js';
export { IMMERSIVE_ROUTE_OPTIONS, PRIMARY_ROUTE_GROUPS, PAGE_ROUTES, ROUTE_PATHS } from './routes/routeDefinitions.js';
export { CONFIG_PROFILES, createRuntimeConfig } from './config/runtimeConfig.js';
export { buildMultiUserShowcaseTemplate } from './builders/multiUserShowcase.js';
export { buildShowcaseTemplate } from './builders/showcaseTemplate.js';
export {
  appendTemplatePages,
  createCollaboration,
  create,
  createTemplate,
  createUploadedDocument,
  clone,
} from './domain/Builder.js';
export {
  buildBundle,
  buildHref,
  getBundleFilename,
  normalizeHostData,
} from './exporters/Bundle.js';
