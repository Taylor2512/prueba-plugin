import React from 'react';

import { FAMILY } from '../catalog/familyCatalog.js';
import { CatalogPage } from '../pages/CatalogPage.jsx';
import { SchemaFamilyPage } from '../pages/SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from '../pages/SchemasCatalogPage.jsx';
import { GENERATED_PAGE_COMPONENTS } from '../pages/generatePages.js';
import { PRIMARY_ROUTE_GROUPS, getSchemaRoute } from '../routes/routeDefinitions.js';

const GENERATED_ROUTE_RENDERERS = Object.fromEntries(
  Object.entries(GENERATED_PAGE_COMPONENTS).map(([pageKey, PageComponent]) => [
    pageKey,
    (route) => <PageComponent currentPath={route.path} />,
  ]),
);

const PRIMARYROUTE_RENDERERS = {
  catalog: () => <CatalogPage primaryRouteDefinitions={PRIMARY_ROUTE_GROUPS} />,
  schemas: () => <SchemasCatalogPage />,
  ...GENERATED_ROUTE_RENDERERS,
};

export const buildPrimaryRouteDefinitions = () =>
  PRIMARY_ROUTE_GROUPS.map((route) => ({
    ...route,
    shell: route.id === 'catalog' || route.id === 'schemas' ? 'documentation' : 'immersive',
    render: () => {
      const renderer = PRIMARYROUTE_RENDERERS[route.id] || PRIMARYROUTE_RENDERERS.catalog;
      return renderer(route);
    },
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
