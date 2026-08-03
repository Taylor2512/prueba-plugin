/**
 * Punto de entrada de los ejemplos del runtime reusable.
 *
 * El catálogo, las páginas y los helpers viven en módulos pequeños; este
 * archivo solo registra rutas y reexporta la API pública que consumen tests y
 * host integraciones.
 */
import React from 'react';

import { FAMILY_EXAMPLES } from './catalog/familyCatalog.js';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { DesignerMultiUserPage } from './pages/DesignerMultiUserPage.jsx';
import { DesignerSingleUserPage } from './pages/DesignerSingleUserPage.jsx';
import { RuntimeFormPage } from './pages/RuntimeFormPage.jsx';
import { RuntimeViewerPage } from './pages/RuntimeViewerPage.jsx';
import { SchemaFamilyPage } from './pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './pages/SchemasCatalogPage.jsx';
import { EXAMPLE_ROUTE_PATHS, PRIMARY_ROUTE_GROUPS, getExampleSchemaRoute } from './routes/routeDefinitions.js';

const PRIMARY_ROUTE_DEFINITIONS = PRIMARY_ROUTE_GROUPS.map((route) => {
  switch (route.id) {
    case 'catalog':
      return {
        ...route,
        shell: 'documentation',
        render: () => <CatalogPage primaryRouteDefinitions={PRIMARY_ROUTE_GROUPS} />,
      };
    case 'single-user':
      return {
        ...route,
        shell: 'immersive',
        render: () => <DesignerSingleUserPage currentPath={EXAMPLE_ROUTE_PATHS.designerSingleUser} />,
      };
    case 'multi-user':
      return {
        ...route,
        shell: 'immersive',
        render: () => <DesignerMultiUserPage currentPath={EXAMPLE_ROUTE_PATHS.designerMultiUser} />,
      };
    case 'form':
      return {
        ...route,
        shell: 'immersive',
        render: () => <RuntimeFormPage currentPath={EXAMPLE_ROUTE_PATHS.runtimeForm} />,
      };
    case 'viewer':
      return {
        ...route,
        shell: 'immersive',
        render: () => <RuntimeViewerPage currentPath={EXAMPLE_ROUTE_PATHS.runtimeViewer} />,
      };
    case 'schemas':
      return {
        ...route,
        shell: 'documentation',
        render: () => <SchemasCatalogPage />,
      };
    default:
      return {
        ...route,
        shell: 'documentation',
        render: () => <CatalogPage primaryRouteDefinitions={PRIMARY_ROUTE_GROUPS} />,
      };
  }
});

const buildFamilyRouteDefinitions = (families) =>
  families.map((family) => ({
    id: family.key,
    path: getExampleSchemaRoute(family.slug),
    title: family.title,
    description: family.description,
    shell: 'immersive',
    render: () => <SchemaFamilyPage family={family} currentPath={getExampleSchemaRoute(family.slug)} />,
  }));

export function getLabExamples() {
  return [...PRIMARY_ROUTE_DEFINITIONS, ...buildFamilyRouteDefinitions(FAMILY_EXAMPLES)].map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
    description: route.description,
    shell: route.shell,
    element: route.render(),
  }));
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
