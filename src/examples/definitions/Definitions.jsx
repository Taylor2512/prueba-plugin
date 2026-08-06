import React from 'react';

import { FAMILY } from '../catalog/familyCatalog.js';
import { CatalogPage } from '../pages/CatalogPage.jsx';
import { SchemaFamilyPage } from '../pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from '../pages/SchemasCatalogPage.jsx';
import {
  DesignerMultiUserPage,
  DesignerSingleUserPage,
  RuntimeFormPage,
  RuntimeViewerPage,
} from '../pages/generatePages.js';
import { ROUTE_PATHS, PRIMARY_ROUTE_GROUPS, getSchemaRoute } from '../routes/routeDefinitions.js';

const PRIMARYROUTE_RENDERERS = {
  catalog: () => <CatalogPage primaryRouteDefinitions={PRIMARY_ROUTE_GROUPS} />,
  'designer-single-user': () => <DesignerSingleUserPage currentPath={ROUTE_PATHS.designerSingleUser} />,
  'designer-multi-user': () => <DesignerMultiUserPage currentPath={ROUTE_PATHS.designerMultiUser} />,
  'runtime-form': () => <RuntimeFormPage currentPath={ROUTE_PATHS.runtimeForm} />,
  'runtime-viewer': () => <RuntimeViewerPage currentPath={ROUTE_PATHS.runtimeViewer} />,
  schemas: () => <SchemasCatalogPage />,
};

export const buildPrimaryRouteDefinitions = () =>
  PRIMARY_ROUTE_GROUPS.map((route) => ({
    ...route,
    shell: route.id === 'catalog' || route.id === 'schemas' ? 'documentation' : 'immersive',
    render: PRIMARYROUTE_RENDERERS[route.id] || PRIMARYROUTE_RENDERERS.catalog,
  }));

export const buildFamilyRouteDefinitions = () =>
  FAMILY.map((family) => ({
    id: family.key,
    path: getSchemaRoute(family.slug),
    title: family.title,
    description: family.description,
    shell: 'immersive',
    render: () => <SchemaFamilyPage family={family} currentPath={getSchemaRoute(family.slug)} />,
  }));

export const buildRouteDefinitions = () => [
  ...buildPrimaryRouteDefinitions(),
  ...buildFamilyRouteDefinitions(),
];

export const buildLab = () =>
  buildRouteDefinitions().map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
    description: route.description,
    shell: route.shell,
    element: route.render(),
  }));
