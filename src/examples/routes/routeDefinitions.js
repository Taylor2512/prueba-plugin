import { FAMILY } from '../catalog/familyCatalog.js';
import PagesConfig from '../config/pagesConfig.json';

export const ROUTE_PATHS = Object.freeze({
  catalog: '/',
  designerSingleUser: '/designer/single-user',
  designerMultiUser: '/designer/multi-user',
  runtimeForm: '/runtime/form',
  runtimeViewer: '/runtime/viewer',
  schemas: '/schemas',
});

// Mapper moderno que usa kebab-case desde pagesConfig
export const PAGE_ROUTES = PagesConfig.routes || {};

export const getSchemaRoute = (slug) => `${ROUTE_PATHS.schemas}/${slug}`;

const PRIMARY_ROUTE_SPEC = {
  catalog: { path: ROUTE_PATHS.catalog, title: 'Catálogo', description: 'Puerta de entrada a todos los ejemplos.' },
  'designer-single-user': { path: PAGE_ROUTES['designer-single-user'], title: 'Designer: un usuario', description: 'Un solo usuario con todas las familias de schema.' },
  'designer-multi-user': { path: PAGE_ROUTES['designer-multi-user'], title: 'Designer: multiusuario', description: 'Colaboración con varios usuarios y cambio de actor activo.' },
  'runtime-form': { path: PAGE_ROUTES['runtime-form'], title: 'Runtime: Form', description: 'Modo de llenado con prefill y resumen lateral.' },
  'runtime-viewer': { path: PAGE_ROUTES['runtime-viewer'], title: 'Runtime: Viewer', description: 'Modo de solo lectura para revisión y auditoría.' },
  schemas: { path: ROUTE_PATHS.schemas, title: 'Schemas', description: 'Catálogo por familia y por tipo de schema.' },
};

export const PRIMARY_ROUTE_GROUPS = Object.entries(PRIMARY_ROUTE_SPEC).map(([id, route]) => ({
  id,
  ...route,
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
