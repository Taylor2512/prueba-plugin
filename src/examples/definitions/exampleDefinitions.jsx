import React from 'react';

import { FAMILY_EXAMPLES } from '../catalog/familyCatalog.js';
import { CatalogPage } from '../pages/CatalogPage.jsx';
import { DesignerMultiUserPage } from '../pages/DesignerMultiUserPage.jsx';
import { DesignerSingleUserPage } from '../pages/DesignerSingleUserPage.jsx';
import { RuntimeFormPage } from '../pages/RuntimeFormPage.jsx';
import { RuntimeViewerPage } from '../pages/RuntimeViewerPage.jsx';
import { SchemaFamilyPage } from '../pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from '../pages/SchemasCatalogPage.jsx';
import { EXAMPLE_ROUTE_PATHS, PRIMARY_ROUTE_GROUPS, getExampleSchemaRoute } from '../routes/routeDefinitions.js';

const PRIMARY_ROUTE_RENDERERS = {
  catalog: () => <CatalogPage primaryRouteDefinitions={PRIMARY_ROUTE_GROUPS} />,
  'single-user': () => <DesignerSingleUserPage currentPath={EXAMPLE_ROUTE_PATHS.designerSingleUser} />,
  'multi-user': () => <DesignerMultiUserPage currentPath={EXAMPLE_ROUTE_PATHS.designerMultiUser} />,
  form: () => <RuntimeFormPage currentPath={EXAMPLE_ROUTE_PATHS.runtimeForm} />,
  viewer: () => <RuntimeViewerPage currentPath={EXAMPLE_ROUTE_PATHS.runtimeViewer} />,
  schemas: () => <SchemasCatalogPage />,
};

export const buildPrimaryExampleRouteDefinitions = () =>
  PRIMARY_ROUTE_GROUPS.map((route) => ({
    ...route,
    shell: route.id === 'catalog' || route.id === 'schemas' ? 'documentation' : 'immersive',
    render: PRIMARY_ROUTE_RENDERERS[route.id] || PRIMARY_ROUTE_RENDERERS.catalog,
  }));

export const buildFamilyExampleRouteDefinitions = () =>
  FAMILY_EXAMPLES.map((family) => ({
    id: family.key,
    path: getExampleSchemaRoute(family.slug),
    title: family.title,
    description: family.description,
    shell: 'immersive',
    render: () => <SchemaFamilyPage family={family} currentPath={getExampleSchemaRoute(family.slug)} />,
  }));

export const buildExampleRouteDefinitions = () => [
  ...buildPrimaryExampleRouteDefinitions(),
  ...buildFamilyExampleRouteDefinitions(),
];

export const buildLabExamples = () =>
  buildExampleRouteDefinitions().map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
    description: route.description,
    shell: route.shell,
    element: route.render(),
  }));
