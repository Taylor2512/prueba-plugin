/**
 * Catálogo canónico, tipado y versionado de eventos SISAD PDFME.
 *
 * Sustituye el `type: string` libre del hub de runtime por una unión
 * discriminada. Este archivo es **solo contrato**: no crea un segundo bus ni
 * emite nada. El transporte sigue siendo el hub existente
 * (`createDesignerRuntimeEventHub`) y el enrutado hacia los callbacks públicos
 * es responsabilidad del dispatcher (COREUX-006).
 *
 * Reglas del catálogo (`reports/core-ux/03-EVENT-CATALOG.md`):
 *
 * - un evento describe un hecho consumado; una intención entra por Command;
 * - todo evento lleva `version`, `eventId`, `timestamp` e `instanceId`, y
 *   opcionalmente `correlationId` para encadenar solicitud → resultado;
 * - los payloads son serializables: nada de funciones, nodos DOM ni instancias.
 *   Esto permite atravesar `postMessage`, logs y snapshots de diagnóstico.
 */

/** Versión del contrato de eventos. Sube al romper forma de payload. */
export const SISAD_PDFME_EVENT_VERSION = 1;

/**
 * Nombres canónicos agrupados por dominio.
 *
 * El objeto es la fuente única: el tipo unión se deriva de él, así que añadir
 * un evento aquí lo hace válido en todo el sistema sin tocar más sitios.
 */
export const SISAD_PDFME_EVENTS = {
  lifecycle: ['designer.ready', 'designer.disposed', 'designer.error'],
  configuration: ['config.changed'],
  template: ['template.changed'],
  schema: [
    'schema.added',
    'schema.updated',
    'schema.removed',
    'schema.duplicated',
    'schema.reordered',
  ],
  selection: ['selection.changed'],
  interaction: [
    'interaction.phase.changed',
    'inline-edit.started',
    'inline-edit.committed',
    'inline-edit.cancelled',
  ],
  navigation: ['page.changed', 'zoom.changed', 'viewport.fit'],
  surface: ['sidebar.changed', 'right-panel.changed', 'view-feature.changed'],
  recipients: ['recipient.registry.changed', 'recipient.active.changed'],
  assignment: ['assignment.changed'],
  documents: [
    'document.added',
    'document.changed',
    'document.reordered',
    'document.removed',
  ],
  comments: [
    'comment.created',
    'comment.replied',
    'comment.resolved',
    'comment.reopened',
    'comment.moved',
    'comment.deleted',
  ],
  signature: ['signature.requested', 'signature.completed', 'signature.failed'],
  validation: ['validation.completed'],
  persistence: ['save.requested', 'save.started', 'save.succeeded', 'save.failed'],
  artifacts: ['export.started', 'export.succeeded', 'export.failed'],
} as const;

export type SisadPdfmeEventDomain = keyof typeof SISAD_PDFME_EVENTS;

/** Unión cerrada de nombres canónicos. */
export type SisadPdfmeEventName =
  (typeof SISAD_PDFME_EVENTS)[SisadPdfmeEventDomain][number];

/**
 * Extensión controlada para eventos de host o de plugin.
 *
 * No se admite cualquier string: el prefijo obliga a declarar que el evento
 * está fuera del catálogo, así que un typo en un nombre canónico sigue siendo
 * un error de tipos.
 */
export type SisadPdfmeCustomEventName = `custom:${string}`;

export type SisadPdfmeAnyEventName = SisadPdfmeEventName | SisadPdfmeCustomEventName;

/** Lista plana, útil para validaciones y pruebas de cobertura. */
export const SISAD_PDFME_EVENT_NAMES = Object.values(SISAD_PDFME_EVENTS).flat() as
  readonly SisadPdfmeEventName[];

/** Dominio al que pertenece cada nombre canónico. */
export const SISAD_PDFME_EVENT_DOMAIN_BY_NAME = Object.fromEntries(
  (Object.entries(SISAD_PDFME_EVENTS) as Array<[SisadPdfmeEventDomain, readonly string[]]>)
    .flatMap(([domain, names]) => names.map((name) => [name, domain] as const)),
) as Record<SisadPdfmeEventName, SisadPdfmeEventDomain>;

/* ------------------------------------------------------------------ */
/* Payloads                                                            */
/* ------------------------------------------------------------------ */

/** Valor serializable: lo único admitido dentro de un payload. */
export type SisadPdfmeSerializable =
  | string
  | number
  | boolean
  | null
  | SisadPdfmeSerializable[]
  | { [key: string]: SisadPdfmeSerializable };

type SchemaRef = { schemaId: string; documentId?: string | null; pageNumber?: number };

type ErrorPayload = {
  code: string;
  message: string;
  cause?: string | null;
  recoverable?: boolean;
};

/**
 * Forma del payload de cada evento canónico.
 *
 * Todos los campos son serializables por construcción: identificadores,
 * primitivos y registros planos. Nunca instancias del runtime.
 */
export type SisadPdfmeEventPayloads = {
  'designer.ready': { capabilities: string[]; configVersion: number };
  'designer.disposed': { reason?: string };
  'designer.error': ErrorPayload;

  'config.changed': { paths: string[]; revision: number; impact?: string };

  'template.changed': { revision: number; cause: string; changedSchemaIds: string[] };

  'schema.added': SchemaRef & { type: string };
  'schema.updated': SchemaRef & { patch: Record<string, SisadPdfmeSerializable>; cause: string };
  'schema.removed': { schemaIds: string[]; documentId?: string | null };
  'schema.duplicated': { sourceIds: string[]; createdIds: string[] };
  'schema.reordered': { schemaIds: string[]; before?: number; after?: number };

  'selection.changed': {
    ids: string[];
    mode: 'replace' | 'add' | 'toggle' | 'clear';
    documentId?: string | null;
    pageNumber?: number;
  };

  'interaction.phase.changed': { previous: string; current: string; reason?: string };
  'inline-edit.started': SchemaRef & { target?: string };
  'inline-edit.committed': SchemaRef & { patch: Record<string, SisadPdfmeSerializable> };
  'inline-edit.cancelled': SchemaRef & { reason?: string };

  'page.changed': { previous: number; current: number; total: number; documentId?: string | null };
  'zoom.changed': { previous: number; current: number; cause: string };
  'viewport.fit': { mode: 'page' | 'width' | 'device' | 'actual-size'; zoom: number };

  'sidebar.changed': {
    side: 'left' | 'right';
    expanded: boolean;
    presentation: 'docked' | 'overlay' | 'auto';
    cause?: string;
  };
  'right-panel.changed': {
    previous: 'fields' | 'detail' | 'comments' | 'documents' | null;
    current: 'fields' | 'detail' | 'comments' | 'documents';
  };
  'view-feature.changed': { feature: string; enabled: boolean };

  'recipient.registry.changed': {
    revision: number;
    recipients: Array<{ id: string; name?: string }>;
  };
  'recipient.active.changed': { previousId: string | null; currentId: string | null };

  'assignment.changed': {
    schemaIds: string[];
    previousOwnerIds: string[];
    ownerId: string | null;
  };

  'document.added': { documentId: string; index: number };
  'document.changed': { previousId: string | null; currentId: string };
  'document.reordered': { order: string[] };
  'document.removed': { documentId: string; nextActiveId: string | null };

  'comment.created': { commentId: string; scope: string; anchor?: Record<string, SisadPdfmeSerializable> };
  'comment.replied': { commentId: string; replyId: string };
  'comment.resolved': { commentId: string };
  'comment.reopened': { commentId: string };
  'comment.moved': { commentId: string; anchor: Record<string, SisadPdfmeSerializable> };
  'comment.deleted': { commentId: string };

  'signature.requested': { schemaId: string; recipientId: string | null; providerKey: string };
  'signature.completed': { schemaId: string; status: string; metadata?: Record<string, SisadPdfmeSerializable> };
  'signature.failed': { schemaId: string; error: ErrorPayload };

  'validation.completed': { profile: string; valid: boolean; issues: number };

  'save.requested': { revision: number };
  'save.started': Record<string, never>;
  'save.succeeded': { revision: number };
  'save.failed': { error: ErrorPayload };

  'export.started': { format: string };
  'export.succeeded': { format: string; size: number };
  'export.failed': { format: string; error: ErrorPayload };
};

/* ------------------------------------------------------------------ */
/* Sobre del evento                                                    */
/* ------------------------------------------------------------------ */

/** Metadatos comunes a todo evento del catálogo. */
export type SisadPdfmeEventEnvelope = {
  version: number;
  eventId: string;
  timestamp: number;
  instanceId: string;
  /** Encadena solicitud → resultado (p. ej. `save.requested` → `save.succeeded`). */
  correlationId?: string;
  source?: string;
};

export type SisadPdfmeEvent<TName extends SisadPdfmeEventName = SisadPdfmeEventName> =
  SisadPdfmeEventEnvelope & {
    name: TName;
    domain: SisadPdfmeEventDomain;
    payload: SisadPdfmeEventPayloads[TName];
  };

/** Evento fuera del catálogo, con payload libre pero serializable. */
export type SisadPdfmeCustomEvent = SisadPdfmeEventEnvelope & {
  name: SisadPdfmeCustomEventName;
  domain: 'custom';
  payload: Record<string, SisadPdfmeSerializable>;
};

/** Unión discriminada por `name`, que es lo que consumen los listeners. */
export type SisadPdfmeAnyEvent =
  | { [K in SisadPdfmeEventName]: SisadPdfmeEvent<K> }[SisadPdfmeEventName]
  | SisadPdfmeCustomEvent;

/* ------------------------------------------------------------------ */
/* Guards y factory                                                    */
/* ------------------------------------------------------------------ */

const KNOWN_NAMES = new Set<string>(SISAD_PDFME_EVENT_NAMES);

/** ¿El nombre pertenece al catálogo canónico? */
export const isSisadPdfmeEventName = (value: unknown): value is SisadPdfmeEventName =>
  typeof value === 'string' && KNOWN_NAMES.has(value);

/** ¿El nombre es una extensión controlada de host/plugin? */
export const isSisadPdfmeCustomEventName = (
  value: unknown,
): value is SisadPdfmeCustomEventName =>
  typeof value === 'string' && value.startsWith('custom:') && value.length > 'custom:'.length;

/** ¿El valor es un evento con sobre completo? */
export const isSisadPdfmeEvent = (value: unknown): value is SisadPdfmeAnyEvent => {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<SisadPdfmeAnyEvent>;
  return (
    (isSisadPdfmeEventName(event.name) || isSisadPdfmeCustomEventName(event.name)) &&
    typeof event.version === 'number' &&
    typeof event.eventId === 'string' &&
    typeof event.timestamp === 'number' &&
    typeof event.instanceId === 'string'
  );
};

/** Guard estrecho por nombre, para listeners que solo atienden un evento. */
export const isSisadPdfmeEventOf = <TName extends SisadPdfmeEventName>(
  name: TName,
  value: unknown,
): value is SisadPdfmeEvent<TName> => isSisadPdfmeEvent(value) && value.name === name;

let eventSequence = 0;

/**
 * Identificador de evento estable y ordenable.
 *
 * No usa `crypto.randomUUID` para no depender de contexto seguro: el par
 * timestamp + secuencia basta para correlacionar y ordenar dentro de una
 * instancia, que es el alcance del contrato.
 */
const nextEventId = (instanceId: string): string => {
  eventSequence += 1;
  return `${instanceId}:${Date.now().toString(36)}:${eventSequence.toString(36)}`;
};

export type CreateEventContext = {
  instanceId: string;
  correlationId?: string;
  source?: string;
  timestamp?: number;
};

/** Construye el sobre canónico de un evento del catálogo. */
export function createSisadPdfmeEvent<TName extends SisadPdfmeEventName>(
  name: TName,
  payload: SisadPdfmeEventPayloads[TName],
  context: CreateEventContext,
): SisadPdfmeEvent<TName> {
  return {
    name,
    domain: SISAD_PDFME_EVENT_DOMAIN_BY_NAME[name],
    version: SISAD_PDFME_EVENT_VERSION,
    eventId: nextEventId(context.instanceId),
    timestamp: context.timestamp ?? Date.now(),
    instanceId: context.instanceId,
    ...(context.correlationId ? { correlationId: context.correlationId } : {}),
    ...(context.source ? { source: context.source } : {}),
    payload,
  };
}

/** Construye el sobre de un evento fuera del catálogo. */
export function createSisadPdfmeCustomEvent(
  name: SisadPdfmeCustomEventName,
  payload: Record<string, SisadPdfmeSerializable>,
  context: CreateEventContext,
): SisadPdfmeCustomEvent {
  return {
    name,
    domain: 'custom',
    version: SISAD_PDFME_EVENT_VERSION,
    eventId: nextEventId(context.instanceId),
    timestamp: context.timestamp ?? Date.now(),
    instanceId: context.instanceId,
    ...(context.correlationId ? { correlationId: context.correlationId } : {}),
    ...(context.source ? { source: context.source } : {}),
    payload,
  };
}
