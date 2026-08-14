/**
 * Inventario canónico de capabilities de SISAD-PDFME.
 *
 * Hasta RTP-430 la pregunta «¿qué puede hacer este runtime?» se respondía en
 * seis sitios distintos —`featureRegistry`, `actionConfigRegistry`,
 * `componentRegistry`, `VIEW_FEATURES`, el resolver de schemas y los dominios
 * del controller—, cada uno con su propio espacio de ids y sin relación
 * declarada entre ellos. Un botón podía resolver «visible» mientras el
 * controller equivalente resolvía «no soportado».
 *
 * Este módulo NO reimplementa la resolución: cada registry sigue siendo la
 * autoridad de su propio estado. Lo que aporta es la topología —el conjunto
 * completo de capabilities, su espacio de ids namespaced y sus dependencias—
 * para que `capabilityGraph` pueda resolver cualquiera de forma fail-closed.
 *
 * Los ids son `${kind}:${id}`. El namespace evita colisiones reales:
 * `inspector` existe como feature Y como component, y `runtime` existe como
 * feature Y como superficie de schema.
 */
import { featureRegistry, type FeatureId } from './featureRegistry.js';
import { featureDependencies } from './featureDependencies.js';
import { actionConfigRegistry, type ActionId } from './actionConfigRegistry.js';
import { componentRegistry, type ComponentId } from './componentRegistry.js';
import { VIEW_FEATURES, type ViewFeature } from '../ui/commands/viewCommands.js';
import type { SisadPdfmeControllerCapabilityDomain } from './SisadPdfmeConfig.js';

export type CapabilityKind =
  | 'feature'
  | 'action'
  | 'component'
  | 'view'
  | 'schema-surface'
  | 'controller-domain';

export type CapabilityId = string;

export type CapabilityDescriptor = {
  /** Id namespaced y estable: `${kind}:${id}`. */
  capabilityId: CapabilityId;
  kind: CapabilityKind;
  /** Id dentro de su registry de origen. */
  id: string;
  /** Rutas de configuración que deciden su estado. */
  sources: string[];
  /** Capabilities de las que depende, en ids namespaced. */
  dependsOn: CapabilityId[];
};

export const capabilityId = (kind: CapabilityKind, id: string): CapabilityId => `${kind}:${id}`;

/** Superficies por las que cada schema puede estar disponible. */
export const SCHEMA_SURFACES = ['catalog', 'canvas', 'inspector', 'runtime', 'configuration'] as const;
export type SchemaSurface = (typeof SCHEMA_SURFACES)[number];

/** Dominios del controller público, en el mismo orden que el tipo público. */
export const CONTROLLER_DOMAINS: readonly SisadPdfmeControllerCapabilityDomain[] = [
  'template',
  'schema',
  'selection',
  'pages',
  'viewport',
  'sidebars',
  'documents',
  'recipients',
  'validation',
  'snapshot',
  'save',
];

/**
 * Dependencias de acciones sobre features/components.
 *
 * Una acción nunca es ejecutable si su superficie anfitriona no lo es: el menú
 * contextual del canvas no puede ejecutar `delete-schema` con el canvas
 * deshabilitado, aunque `visibility.actions.delete` siga en `true`.
 */
const actionDependencies: Record<ActionId, CapabilityId[]> = {
  'reassignrecipient': ['feature:assignment'],
  'duplicate-schema': ['feature:canvas'],
  'delete-schema': ['feature:canvas'],
  copy: ['feature:canvas'],
  paste: ['feature:canvas'],
  'lock-position': ['feature:canvas'],
  'unlock-position': ['feature:canvas'],
  'hide-schema': ['feature:canvas'],
  'show-schema': ['feature:canvas'],
  align: ['feature:canvas'],
  distribute: ['feature:canvas'],
  'match-size': ['feature:canvas'],
  'switch-right-panel-fields': ['component:right-sidebar'],
  'switch-right-panel-detail': ['component:right-sidebar'],
  'switch-right-panel-comments': ['component:right-sidebar', 'feature:comments'],
  'switch-right-panel-documents': ['component:right-sidebar', 'feature:documents'],
  'add-comment': ['feature:comments'],
};

const componentDependencies: Record<ComponentId, CapabilityId[]> = {
  'left-sidebar': ['feature:sidebars'],
  'right-sidebar': ['feature:sidebars'],
  'canvas-toolbar': ['feature:canvas'],
  'canvas-context-menu': ['feature:canvas'],
  inspector: ['feature:inspector'],
  'comments-panel': ['component:right-sidebar', 'feature:comments'],
  'documents-panel': ['component:right-sidebar', 'feature:documents'],
  'fields-panel': ['component:right-sidebar'],
  'detail-panel': ['component:right-sidebar', 'feature:inspector'],
  'assignment-dialog': ['feature:assignment'],
  'shortcut-help-panel': ['feature:runtime'],
};

/**
 * Fuentes de cada toggle de vista.
 *
 * `canvas.*` decide comportamiento y `visibility.canvas.*` decide presencia:
 * son ramas distintas y ambas cuentan como fuente (ver `viewCommands`).
 */
const viewSources = (feature: ViewFeature): string[] => [`canvas.${feature}`, `visibility.canvas.${feature}`];

const schemaSurfaceDependencies: Record<SchemaSurface, CapabilityId[]> = {
  catalog: ['component:left-sidebar'],
  canvas: ['feature:canvas'],
  inspector: ['feature:inspector'],
  runtime: ['feature:runtime'],
  configuration: ['feature:runtime'],
};

const schemaSurfaceSources: Record<SchemaSurface, string[]> = {
  catalog: ['schemas.enabledTypes', 'visibility.schemas.catalog'],
  canvas: ['visibility.schemas.canvas'],
  inspector: ['visibility.schemas.inspector'],
  runtime: ['schemas.enabledTypes', 'visibility.schemas.runtime'],
  configuration: ['visibility.inspector.fieldsBySchemaType'],
};

const controllerDependencies: Record<SisadPdfmeControllerCapabilityDomain, CapabilityId[]> = {
  template: ['feature:runtime'],
  schema: ['feature:canvas'],
  selection: ['feature:canvas'],
  pages: ['feature:canvas'],
  viewport: ['feature:canvas'],
  sidebars: ['feature:sidebars'],
  documents: ['feature:documents'],
  recipients: ['feature:collaboration'],
  validation: ['feature:runtime'],
  snapshot: ['feature:runtime'],
  save: ['feature:persistence'],
};

const controllerSources: Record<SisadPdfmeControllerCapabilityDomain, string[]> = {
  template: ['runtime.mode'],
  schema: ['canvas.enabled', 'runtime.readonly'],
  selection: ['canvas.enabled', 'canvas.multiSelect'],
  pages: ['canvas.enabled'],
  viewport: ['canvas.enabled'],
  sidebars: ['sidebars.left.enabled', 'sidebars.right.enabled'],
  documents: ['documents.mode', 'documents.activeDocumentStrategy'],
  recipients: ['recipients.activeRecipientId', 'collaboration.enabled'],
  validation: ['schemas.validateUniqueNames'],
  snapshot: ['persistence.serializeSnapshot'],
  save: ['persistence.mode', 'persistence.autosave'],
};

const buildInventory = (): CapabilityDescriptor[] => {
  const descriptors: CapabilityDescriptor[] = [];

  (Object.keys(featureRegistry) as FeatureId[]).forEach((id) => {
    descriptors.push({
      capabilityId: capabilityId('feature', id),
      kind: 'feature',
      id,
      sources: [...featureRegistry[id].sources],
      dependsOn: (featureDependencies[id] || []).map((dependency) => capabilityId('feature', dependency)),
    });
  });

  (Object.keys(actionConfigRegistry) as ActionId[]).forEach((id) => {
    descriptors.push({
      capabilityId: capabilityId('action', id),
      kind: 'action',
      id,
      sources: [...actionConfigRegistry[id].sources],
      dependsOn: [...(actionDependencies[id] || [])],
    });
  });

  (Object.keys(componentRegistry) as ComponentId[]).forEach((id) => {
    descriptors.push({
      capabilityId: capabilityId('component', id),
      kind: 'component',
      id,
      sources: [...componentRegistry[id].sources],
      dependsOn: [...(componentDependencies[id] || [])],
    });
  });

  VIEW_FEATURES.forEach((id) => {
    descriptors.push({
      capabilityId: capabilityId('view', id),
      kind: 'view',
      id,
      sources: viewSources(id),
      dependsOn: ['feature:canvas'],
    });
  });

  SCHEMA_SURFACES.forEach((id) => {
    descriptors.push({
      capabilityId: capabilityId('schema-surface', id),
      kind: 'schema-surface',
      id,
      sources: [...schemaSurfaceSources[id]],
      dependsOn: [...schemaSurfaceDependencies[id]],
    });
  });

  CONTROLLER_DOMAINS.forEach((id) => {
    descriptors.push({
      capabilityId: capabilityId('controller-domain', id),
      kind: 'controller-domain',
      id,
      sources: [...controllerSources[id]],
      dependsOn: [...controllerDependencies[id]],
    });
  });

  return descriptors;
};

export const capabilityInventory: readonly CapabilityDescriptor[] = Object.freeze(buildInventory());

const inventoryById = new Map(capabilityInventory.map((descriptor) => [descriptor.capabilityId, descriptor]));

export const findCapability = (id: CapabilityId): CapabilityDescriptor | null => inventoryById.get(id) ?? null;

export const capabilitiesOfKind = (kind: CapabilityKind): CapabilityDescriptor[] =>
  capabilityInventory.filter((descriptor) => descriptor.kind === kind);

export const capabilityIds = (): CapabilityId[] => capabilityInventory.map((descriptor) => descriptor.capabilityId);
