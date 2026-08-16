/**
 * Catálogo de datos del laboratorio de ejemplos.
 *
 * Todo lo que las páginas necesitan saber — familias de schema, rutas,
 * recipients, documentos y perfiles de configuración — se deriva aquí desde
 * el manifest, el archivo de datos y el registry público del paquete.
 * Ningún módulo de UI declara listas propias.
 */
import { getBuiltInFields, getSchemaFamily } from '@sisad-pdfme/schemas';
import { createProfiledConfig } from '@/sisad-pdfme/config';

import Manifest from './config/examplesManifest.json';
import Data from './config/examplesData.json';
import RuntimeConfig from './config/sisad-pdfme.s.json';
import { buildShowcaseTemplate } from './builders.js';

/* ── Manifest ─────────────────────────────────────────────────────────── */

export const EXAMPLES_MANIFEST = Manifest;
export const EXAMPLE_ROUTE_MAP = Manifest.routes;
export const EXAMPLE_PRIMARY_ROUTES = Manifest.primaryRoutes;
export const FAMILY_ROUTE_CONFIG = Manifest.familyRoutes;

export const getExamplePageConfig = (pageKey) =>
  Manifest.primaryRoutes.find((page) => page.id === pageKey) || null;

/* ── Familias de schema ───────────────────────────────────────────────── */

export const FAMILY_META = Data.families;

/**
 * Cruza los tipos sembrados en el archivo de datos con los que el registry
 * del paquete descubre en tiempo de ejecución: si el runtime gana un tipo
 * nuevo aparece solo, sin editar listas.
 */
const buildFamily = () => {
  const discoveredByFamily = new Map(Object.keys(FAMILY_META).map((key) => [key, []]));

  getBuiltInFields().forEach((definition) => {
    const family = getSchemaFamily(definition.type);
    if (!discoveredByFamily.has(family)) return;
    discoveredByFamily.get(family).push(definition.type);
  });

  return Object.entries(FAMILY_META).map(([key, meta]) => ({
    key,
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    types: Array.from(new Set([...(meta.types || []), ...(discoveredByFamily.get(key) ?? [])])),
  }));
};

export const FAMILY = buildFamily();

export const typesOf = (keys) =>
  FAMILY.filter((family) => keys.includes(family.key)).flatMap((family) => family.types);

export const MULTI_USER_FAMILY_KEYS = Data.familySources.multiUser;

/**
 * Resuelve los grupos `{ title, types }` que consume un template builder a
 * partir de las opciones declaradas en el manifest.
 */
export const resolveFamilyGroups = (options = {}) => {
  const familyKeys = Array.isArray(options.familyKeys)
    ? options.familyKeys
    : Data.familySources[options.familySource] ?? null;

  const selected = familyKeys ? FAMILY.filter((family) => familyKeys.includes(family.key)) : FAMILY;

  return selected.map((family) => ({ title: family.title, types: family.types }));
};

/* ── Rutas ────────────────────────────────────────────────────────────── */

const toCamelCase = (value) =>
  value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export const getSchemaRoute = (slug) => `${FAMILY_ROUTE_CONFIG.basePath}/${slug}`;

export const ROUTE_PATHS = Object.freeze(
  Object.fromEntries(Object.entries(EXAMPLE_ROUTE_MAP).map(([key, path]) => [toCamelCase(key), path])),
);

export const PRIMARY_ROUTE_GROUPS = EXAMPLE_PRIMARY_ROUTES.map((route) => ({
  id: route.id,
  path: route.path || EXAMPLE_ROUTE_MAP[route.id] || `/${route.id}`,
  title: route.title,
  description: route.description,
}));

export const FAMILY_ROUTE_GROUPS = FAMILY.map((family) => ({
  id: family.key,
  path: getSchemaRoute(family.slug),
  title: family.title,
  description: family.description,
}));

export const IMMERSIVE_ROUTE_OPTIONS = [
  ...PRIMARY_ROUTE_GROUPS.filter((route) => route.path !== ROUTE_PATHS.catalog),
  ...FAMILY_ROUTE_GROUPS,
].map((route) => ({ path: route.path, title: route.title }));

/* ── Fixtures ─────────────────────────────────────────────────────────── */

export const MULTI_USER_RECIPIENTS = Data.recipients.multiUser;

const toDemoDocument = (document) => ({
  id: document.id,
  label: document.label,
  template: buildShowcaseTemplate(
    document.groups.map((group) => ({ title: group.title, types: typesOf(group.familyKeys) })),
  ),
});

export const DEMO_DOCUMENTS = Data.demoDocuments.map(toDemoDocument);

/**
 * Dos documentos con la MISMA estructura de schemas.
 *
 * `DEMO_DOCUMENTS` trae plantillas distintas, que sirven para navegar pero no
 * para probar aislamiento: si los schemas no coinciden no hay forma de afirmar
 * que un mismo campo vale una cosa en D1 y otra en D2. Este conjunto existe
 * para esa comprobación (RTP-510.A).
 */
export const MULTI_DOCUMENT_DOCUMENTS = Data.multiDocumentSet.map(toDemoDocument);

/* ── Configuración del runtime ────────────────────────────────────────── */

export const CONFIG_PROFILES = Object.keys(RuntimeConfig.profiles);

export function createRuntimeConfig(profile, overrides = {}) {
  return createProfiledConfig(RuntimeConfig.base, RuntimeConfig.profiles, profile, overrides);
}
