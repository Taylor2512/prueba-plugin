/**
 * Resolución fail-closed de capabilities sobre el inventario canónico.
 *
 * Contrato (RTP-440):
 *
 * 1. Una capability desconocida NO es «permisiva por defecto»: devuelve un
 *    estado con todos los flags en `false` y `reason: 'unknown-capability'`.
 *    Un id mal escrito debe apagar el botón, no habilitarlo.
 * 2. Las dependencias se resuelven transitivamente. Si alguna no es
 *    `executable`, la capability tampoco lo es.
 * 3. Un ciclo en el grafo se corta y devuelve estado apagado, nunca recursión
 *    infinita.
 * 4. `enabled`, `visible`, `permitted`, `available` y `executable` NO son
 *    sinónimos y se propagan por separado. Sólo `executable` se contagia por
 *    dependencia: una superficie oculta no vuelve invisible a su hija, pero sí
 *    la vuelve inejecutable.
 *
 * El grafo no reimplementa la resolución de cada dominio: delega en el registry
 * que ya es autoridad (`featureRegistry`, `actionConfigRegistry`,
 * `componentRegistry`, `resolveViewFeatureState`) y aporta la composición.
 */
import {
  capabilityId,
  findCapability,
  capabilityInventory,
  type CapabilityDescriptor,
  type CapabilityId,
  type CapabilityKind,
  type IntegrationCapability,
  type SchemaSurface,
} from '@sisad-pdfme/config/capabilityInventory';
import type { SisadPdfmeIntegrationResources } from '@sisad-pdfme/integration/http/integrationResources';
import {
  selectActionState,
  selectComponentState,
  selectFeatureState,
  type SisadPdfmeConfigSource,
} from '@sisad-pdfme/config/configSelectors';
import type { SisadPdfmeFeatureState } from '@sisad-pdfme/config/featureRegistry';
import type { ActionId } from '@sisad-pdfme/config/actionConfigRegistry';
import type { ComponentId } from '@sisad-pdfme/config/componentRegistry';
import type { FeatureId } from '@sisad-pdfme/config/featureRegistry';
import { resolveViewFeatureState, type ViewFeature } from '@sisad-pdfme/ui/commands/viewCommands';
import type { SisadPdfmeControllerCapabilityDomain } from '@sisad-pdfme/config/SisadPdfmeConfig';

export type CapabilityResolutionContext = {
  readOnly?: boolean;
  canEditStructure?: boolean;
  selectionCount?: number;
  recipientCount?: number;
  hasClipboard?: boolean;
  /**
   * Estado de sesión de los toggles de vista. Es UI state, no política: se
   * aplica encima de la configuración, nunca la sustituye.
   */
  viewSession?: Partial<Record<ViewFeature, boolean>>;
  /** Restringe una superficie de schema a un tipo concreto. */
  schemaType?: string;
  /**
   * Qué dominios soporta la instancia viva. La configuración decide política;
   * la instancia decide soporte real. Ausente = soporte desconocido, y lo
   * desconocido es fail-closed.
   */
  controllerSupport?: Partial<Record<SisadPdfmeControllerCapabilityDomain, boolean>>;
  /**
   * Recursos de integración que el host inyectó de verdad.
   *
   * No es configuración: es presencia de un recurso vivo. Se pasa aparte
   * porque `ResolvedConfig` es serializable y estos recursos no.
   */
  integrations?: SisadPdfmeIntegrationResources | null;
};

export type CapabilityState = SisadPdfmeFeatureState & {
  capabilityId: CapabilityId;
  kind: CapabilityKind | 'unknown';
  /** Dependencias que impidieron la ejecución, en ids namespaced. */
  blockedBy: CapabilityId[];
};

const closedState = (
  id: CapabilityId,
  reason: string,
  kind: CapabilityKind | 'unknown' = 'unknown',
  sources: string[] = [],
): CapabilityState => ({
  capabilityId: id,
  kind,
  id: id.slice(id.indexOf(':') + 1) || id,
  registered: false,
  supported: false,
  enabled: false,
  visible: false,
  permitted: false,
  available: false,
  active: false,
  executable: false,
  reason,
  sources,
  blockedBy: [],
});

const normalizeType = (value: string) => value.trim().toLowerCase();

const resolveViewCapability = (
  source: SisadPdfmeConfigSource,
  feature: ViewFeature,
  context: CapabilityResolutionContext,
): Omit<CapabilityState, 'capabilityId' | 'kind' | 'blockedBy'> => {
  const snapshot = source;
  const canvasConfig = snapshot.config.canvas as Partial<Record<ViewFeature, boolean>>;
  const visibilityConfig = snapshot.visibility.canvas as Partial<Record<ViewFeature, boolean>> | undefined;
  const effective = resolveViewFeatureState({
    canvas: canvasConfig,
    visibility: visibilityConfig,
    session: context.viewSession,
  })[feature];
  const visible = visibilityConfig?.[feature] !== false;
  return {
    id: feature,
    registered: true,
    supported: true,
    enabled: canvasConfig?.[feature] !== false,
    visible,
    // Un toggle de vista no muta el documento: sigue siendo alternable en
    // readonly. `permitted` refleja quién puede cambiarlo, no readonly.
    permitted: visible,
    available: visible,
    active: effective,
    executable: visible,
    reason: visible ? undefined : 'hidden-by-config',
    sources: [`canvas.${feature}`, `visibility.canvas.${feature}`],
  };
};

const resolveSchemaSurfaceCapability = (
  source: SisadPdfmeConfigSource,
  surface: SchemaSurface,
  context: CapabilityResolutionContext,
): Omit<CapabilityState, 'capabilityId' | 'kind' | 'blockedBy'> => {
  const snapshot = source;
  const perSurface = (snapshot.visibility.schemas as Record<string, Record<string, boolean> | undefined> | undefined)?.[surface];
  const enabledTypes = snapshot.config.schemas?.enabledTypes;
  const schemaType = context.schemaType ? normalizeType(context.schemaType) : null;

  const hiddenByVisibility = schemaType
    ? Object.entries(perSurface || {}).some(([type, value]) => normalizeType(type) === schemaType && value === false)
    : false;
  const gatedByEnabledTypes =
    schemaType && Array.isArray(enabledTypes) && enabledTypes.length > 0
      ? !enabledTypes.some((type) => normalizeType(String(type)) === schemaType)
      : false;
  // Sin `schemaType` la pregunta es «¿existe la superficie?», no «¿está este
  // tipo permitido?»: no se puede responder por un tipo que no se ha nombrado.
  const gated = (surface === 'catalog' || surface === 'runtime') && gatedByEnabledTypes;
  const visible = !hiddenByVisibility;
  const enabled = !gated;

  return {
    id: surface,
    registered: true,
    supported: true,
    enabled,
    visible,
    permitted: true,
    available: enabled && visible,
    active: enabled && visible,
    executable: enabled && visible,
    reason: !visible ? 'hidden-by-config' : !enabled ? 'schema-type-disabled' : undefined,
    sources: [`visibility.schemas.${surface}`, 'schemas.enabledTypes'],
  };
};

const resolveControllerCapability = (
  source: SisadPdfmeConfigSource,
  domain: SisadPdfmeControllerCapabilityDomain,
  context: CapabilityResolutionContext,
  descriptor: CapabilityDescriptor,
): Omit<CapabilityState, 'capabilityId' | 'kind' | 'blockedBy'> => {
  const readOnly = context.readOnly === true || source.config.runtime.readonly === true;
  // El soporte lo declara la instancia viva. Sin declaración es desconocido, y
  // lo desconocido no se asume disponible.
  const declared = context.controllerSupport?.[domain];
  const supported = declared === true;
  const mutating = domain !== 'template' && domain !== 'snapshot' && domain !== 'sidebars' && domain !== 'viewport' && domain !== 'pages';
  return {
    id: domain,
    registered: true,
    supported,
    enabled: supported,
    visible: true,
    permitted: !(mutating && readOnly),
    available: supported,
    active: false,
    executable: supported && !(mutating && readOnly),
    reason: !supported
      ? declared === false
        ? `${domain}-unavailable`
        : 'controller-support-unknown'
      : mutating && readOnly
        ? 'readonly'
        : undefined,
    sources: [...descriptor.sources],
  };
};

/**
 * Un recurso de integración está disponible si el host lo inyectó.
 *
 * Ausente = fail-closed. Es la diferencia entre «el host no lo configuró» y
 * «asumamos que hay red»: lo segundo produce peticiones que nadie puede
 * ejecutar y errores en tiempo de uso en vez de una superficie apagada.
 */
const resolveIntegrationCapability = (
  source: SisadPdfmeConfigSource,
  id: IntegrationCapability,
  context: CapabilityResolutionContext,
  descriptor: CapabilityDescriptor,
): Omit<CapabilityState, 'capabilityId' | 'kind' | 'blockedBy'> => {
  const resources = context.integrations ?? null;
  const resource = resources?.[id];
  const present =
    id === 'dataSources' || id === 'signatureExecution'
      ? Boolean(resource && Object.keys(resource as Record<string, unknown>).length > 0)
      : Boolean(resource);
  return {
    id,
    registered: true,
    supported: present,
    enabled: present,
    // Un recurso de integración no tiene superficie propia que ocultar.
    visible: true,
    // Leer datos o fuentes tipográficas es legítimo en solo lectura. La única
    // integración que muta es la firma, y su restricción vive en
    // `feature:signatures`, que es su dependencia declarada.
    permitted: true,
    available: present,
    active: false,
    executable: present,
    reason: present ? undefined : `${id}-not-injected`,
    sources: [...descriptor.sources],
  };
};

const resolveBase = (
  source: SisadPdfmeConfigSource,
  descriptor: CapabilityDescriptor,
  context: CapabilityResolutionContext,
): Omit<CapabilityState, 'capabilityId' | 'kind' | 'blockedBy'> => {
  switch (descriptor.kind) {
    case 'feature':
      return selectFeatureState(source, descriptor.id as FeatureId, context);
    case 'action':
      return selectActionState(source, descriptor.id as ActionId, context);
    case 'component':
      return selectComponentState(source, descriptor.id as ComponentId, context);
    case 'view':
      return resolveViewCapability(source, descriptor.id as ViewFeature, context);
    case 'schema-surface':
      return resolveSchemaSurfaceCapability(source, descriptor.id as SchemaSurface, context);
    case 'integration':
      return resolveIntegrationCapability(
        source,
        descriptor.id as IntegrationCapability,
        context,
        descriptor,
      );
    case 'controller-domain':
      return resolveControllerCapability(
        source,
        descriptor.id as SisadPdfmeControllerCapabilityDomain,
        context,
        descriptor,
      );
    default:
      return closedState(descriptor.capabilityId, 'unknown-capability');
  }
};

const dedupe = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

export const resolveCapabilityState = (
  source: SisadPdfmeConfigSource,
  id: CapabilityId,
  context: CapabilityResolutionContext = {},
  stack: CapabilityId[] = [],
): CapabilityState => {
  if (stack.includes(id)) {
    return closedState(id, 'capability-cycle', findCapability(id)?.kind ?? 'unknown', [`cycle:${[...stack, id].join('>')}`]);
  }
  const descriptor = findCapability(id);
  if (!descriptor) {
    return closedState(id, 'unknown-capability');
  }

  const dependencyStates = descriptor.dependsOn.map((dependencyId) =>
    resolveCapabilityState(source, dependencyId, context, [...stack, id]),
  );
  const blockedBy = dependencyStates.filter((state) => !state.executable).map((state) => state.capabilityId);
  const base = resolveBase(source, descriptor, context);

  return {
    ...base,
    capabilityId: descriptor.capabilityId,
    kind: descriptor.kind,
    id: descriptor.id,
    supported: base.supported && blockedBy.length === 0,
    available: base.available && blockedBy.length === 0,
    executable: base.executable && blockedBy.length === 0,
    reason: base.reason || (blockedBy.length ? 'dependency-unavailable' : undefined),
    sources: dedupe([...(base.sources || []), ...descriptor.sources]),
    blockedBy,
  };
};

export type CapabilityGraph = {
  ids(): CapabilityId[];
  describe(id: CapabilityId): CapabilityDescriptor | null;
  resolve(id: CapabilityId, context?: CapabilityResolutionContext): CapabilityState;
  resolveAll(context?: CapabilityResolutionContext): Record<CapabilityId, CapabilityState>;
};

export const createCapabilityGraph = (source: SisadPdfmeConfigSource): CapabilityGraph => ({
  ids: () => capabilityInventory.map((descriptor) => descriptor.capabilityId),
  describe: (id) => findCapability(id),
  resolve: (id, context = {}) => resolveCapabilityState(source, id, context),
  resolveAll: (context = {}) =>
    capabilityInventory.reduce<Record<CapabilityId, CapabilityState>>((accumulator, descriptor) => {
      accumulator[descriptor.capabilityId] = resolveCapabilityState(source, descriptor.capabilityId, context);
      return accumulator;
    }, {}),
});

export { capabilityId };
