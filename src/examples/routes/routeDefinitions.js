import { FAMILY_EXAMPLES } from '../catalog/familyCatalog.js';

export const EXAMPLE_ROUTE_PATHS = Object.freeze({
  catalog: '/',
  designerSingleUser: '/examples/designer/single-user',
  designerMultiUser: '/examples/designer/multi-user',
  runtimeForm: '/examples/runtime/form',
  runtimeViewer: '/examples/runtime/viewer',
  schemas: '/examples/schemas',
});

export const getExampleSchemaRoute = (slug) => `${EXAMPLE_ROUTE_PATHS.schemas}/${slug}`;

export const PRIMARY_ROUTE_GROUPS = [
  { id: 'catalog', path: EXAMPLE_ROUTE_PATHS.catalog, title: 'Catálogo', description: 'Puerta de entrada a todos los ejemplos.' },
  { id: 'single-user', path: EXAMPLE_ROUTE_PATHS.designerSingleUser, title: 'Designer: un usuario', description: 'Un solo usuario con todas las familias de schema.' },
  { id: 'multi-user', path: EXAMPLE_ROUTE_PATHS.designerMultiUser, title: 'Designer: multiusuario', description: 'Colaboración con varios usuarios y cambio de actor activo.' },
  { id: 'form', path: EXAMPLE_ROUTE_PATHS.runtimeForm, title: 'Runtime: Form', description: 'Modo de llenado con prefill y resumen lateral.' },
  { id: 'viewer', path: EXAMPLE_ROUTE_PATHS.runtimeViewer, title: 'Runtime: Viewer', description: 'Modo de solo lectura para revisión y auditoría.' },
  { id: 'schemas', path: EXAMPLE_ROUTE_PATHS.schemas, title: 'Schemas', description: 'Catálogo por familia y por tipo de schema.' },
];

export const FAMILY_ROUTE_GROUPS = FAMILY_EXAMPLES.map((family) => ({
  path: getExampleSchemaRoute(family.slug),
  title: family.title,
  description: family.description,
}));

export const SEMANTIC_ROUTE_EXAMPLES = FAMILY_EXAMPLES.map((family) => ({
  id: family.key,
  path: getExampleSchemaRoute(family.slug),
  title: family.title,
  description: family.description,
}));

export const IMMERSIVE_ROUTE_OPTIONS = [
  ...PRIMARY_ROUTE_GROUPS.filter((route) => route.path !== EXAMPLE_ROUTE_PATHS.catalog),
  ...SEMANTIC_ROUTE_EXAMPLES,
].map((route) => ({ path: route.path, title: route.title }));

export const getExampleRouteCatalog = () => [
  ...PRIMARY_ROUTE_GROUPS,
  ...SEMANTIC_ROUTE_EXAMPLES,
].map((route) => ({
  id: route.id || route.path,
  path: route.path,
  title: route.title,
  description: route.description,
}));
