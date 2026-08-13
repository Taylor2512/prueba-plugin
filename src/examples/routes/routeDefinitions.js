import { FAMILY } from '../catalog/familyCatalog.js';
import { EXAMPLE_PRIMARY_ROUTES, EXAMPLE_ROUTE_MAP } from '../config/examplesManifest.js';

export const ROUTE_PATHS = Object.freeze({
  catalog: '/',
  designerSingleUser: '/designer/single-user',
  designerMultiUser: '/designer/multi-user',
  runtimeForm: '/runtime/form',
  runtimeViewer: '/runtime/viewer',
  schemas: '/schemas',
});

export const PAGE_ROUTES = EXAMPLE_ROUTE_MAP || {};

export const getSchemaRoute = (slug) => `${ROUTE_PATHS.schemas}/${slug}`;

export const PRIMARY_ROUTE_GROUPS = EXAMPLE_PRIMARY_ROUTES.map((route) => ({
  id: route.id,
  path: route.path || EXAMPLE_ROUTE_MAP[route.id] || ROUTE_PATHS[route.id] || route.id,
  title: route.title,
  description: route.description,
}));

export const FAMILY_ROUTE_GROUPS = FAMILY.map((family) => ({
  path: getSchemaRoute(family.slug),
  title: family.title,
  description: family.description,
}));

export const SEMANTIC_ROUTE = FAMILY.map((family) => ({
  id: family.key,
  path: getSchemaRoute(family.slug),
  title: family.title,
  description: family.description,
}));

export const IMMERSIVE_ROUTE_OPTIONS = [
  ...PRIMARY_ROUTE_GROUPS.filter((route) => route.path !== ROUTE_PATHS.catalog),
  ...SEMANTIC_ROUTE,
].map((route) => ({ path: route.path, title: route.title }));

export const getRouteCatalog = () => [
  ...PRIMARY_ROUTE_GROUPS,
  ...SEMANTIC_ROUTE,
].map((route) => ({
  id: route.id || route.path,
  path: route.path,
  title: route.title,
  description: route.description,
}));
