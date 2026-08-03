/**
 * Punto de entrada de los ejemplos del runtime reusable.
 *
 * El catálogo, las páginas y los helpers viven en módulos pequeños; este
 * archivo solo registra rutas y reexporta la API pública que consumen tests y
 * host integraciones.
 */
import { buildLabExamples } from './definitions/exampleDefinitions.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { DesignerMultiUserPage } from './pages/DesignerMultiUserPage.jsx';
import { DesignerSingleUserPage } from './pages/DesignerSingleUserPage.jsx';
import { RuntimeFormPage } from './pages/RuntimeFormPage.jsx';
import { RuntimeViewerPage } from './pages/RuntimeViewerPage.jsx';
import { SchemaFamilyPage } from './pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './pages/SchemasCatalogPage.jsx';

export function getLabExamples() {
  return buildLabExamples();
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
  ExampleControllerPanel,
  ExampleDocumentationShell,
  ExampleEventLog,
  ExampleImmersiveShell,
  ExampleInfoPanelStack,
  ExampleTopbar,
  FamilyBadgeList,
  InfoCard,
  MetricGrid,
  PreviewFrame,
  RouteCard,
  RuntimeViewport,
} from './components/exampleUi.jsx';

export { FAMILY_EXAMPLES } from './catalog/familyCatalog.js';
export { DEMO_DOCUMENTS } from './fixtures/documents.js';
export { MULTI_USER_FAMILY_KEYS, MULTI_USER_RECIPIENTS } from './fixtures/recipients.js';
export { IMMERSIVE_ROUTE_OPTIONS, PRIMARY_ROUTE_GROUPS } from './routes/routeDefinitions.js';
export { EXAMPLE_CONFIG_PROFILES, createRuntimeConfig } from './config/runtimeConfig.js';
export { buildMultiUserShowcaseTemplate } from './builders/multiUserShowcase.js';
export { buildShowcaseTemplate } from './builders/showcaseTemplate.js';
export {
  appendTemplatePages,
  createCollaboration,
  createExample,
  createTemplate,
  createUploadedDocument,
  cloneExample,
} from './domain/exampleBuilder.js';
export {
  buildExampleBundle,
  buildExampleHref,
  getExampleBundleFilename,
  normalizeExampleHostData,
} from './exporters/exampleBundle.js';
