/**
 * Punto de entrada de los ejemplos del runtime reusable.
 *
 * El catálogo, las páginas y los helpers viven en módulos pequeños; este
 * archivo solo registra rutas y reexporta la API pública que consumen tests y
 * host integraciones.
 *
 * Las páginas principales (Designer, Runtime) se generan automáticamente desde
 * config/pagesConfig.json sin duplicidad. Páginas especiales (Catalog, Schemas)
 * siguen siendo explícitas.
 */
import { buildLab } from './definitions/Definitions.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { DesignerMultiUserPage, DesignerSingleUserPage, RuntimeFormPage, RuntimeViewerPage } from './pages/generatePages.js';
import { SchemaFamilyPage } from './pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './pages/SchemasCatalogPage.jsx';

export function getLab() {
  return buildLab();
}

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
export { IMMERSIVE_ROUTE_OPTIONS, PRIMARY_ROUTE_GROUPS } from './routes/routeDefinitions.js';
export { _CONFIG_PROFILES, createRuntimeConfig } from './config/runtimeConfig.js';
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
