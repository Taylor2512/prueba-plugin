/**
 * Barrel público de contratos SISAD PDFME.
 *
 * Este módulo centraliza los tipos, helpers y adaptadores que forman parte
 * del contrato estable consumido por hosts, runtime, diseñador, formularios,
 * viewer, generator e integraciones externas.
 *
 * Responsabilidades:
 *
 * - exponer contratos de dominio: assignments, comandos, comentarios,
 *   plugins y schemas;
 * - publicar tipos base de template/schema/plugin desde `common/types`;
 * - exponer guards oficiales de interacción;
 * - exponer snapshot oficial y su adaptador;
 * - exponer registry de providers de firma;
 * - evitar imports profundos desde consumidores externos.
 *
 * Restricciones:
 *
 * - no agregar lógica de negocio en este archivo;
 * - no importar componentes React, estilos, Canvas, Moveable ni Selecto;
 * - no exponer APIs internas experimentales si no son contrato estable.
 */

/**
 * Contratos base del sistema de comandos.
 *
 * Incluye el comando reversible, su contexto de ejecución y los eventos
 * observables emitidos por el bus.
 */
export type {
  Command,
  CommandExecutionContext,
  CommandObserverEvent,
  CommandObserverPayload,
} from '@sisad-pdfme/contracts/commands';

/**
 * Contratos de comentarios PDF.
 *
 * Incluye anchors visuales/lógicos, comentarios principales, respuestas
 * y entradas top-level serializables dentro del template o snapshot.
 */
export type {
  CommentAnchor,
  PdfComment,
  PdfCommentReply,
  TopLevelPdfCommentEntry,
} from '@sisad-pdfme/contracts/comments';

/**
 * Contratos de plugins y secciones del inspector.
 *
 * Estos tipos permiten describir acciones, familias, estrategias y secciones
 * configurables sin acoplar la definición del plugin a una UI concreta.
 */
export type {
  PluginActionDefinition,
  PluginFamilyDefinition,
  PluginStrategyDefinition,
  SchemaInspectorSection,
} from '@sisad-pdfme/contracts/plugins';

/**
 * Contratos de identidad, colaboración y metadata de diseñador para schemas.
 *
 * Estos tipos son usados para preservar identidad estable, ownership,
 * trazabilidad y metadata interna en operaciones de crear, duplicar,
 * pegar, serializar o sincronizar schemas.
 */
export type {
  CollaborativeSchemaContract,
  SchemaIdentity,
  SchemaDesignerMeta,
} from '@sisad-pdfme/contracts/schema';

/**
 * Helpers oficiales para crear o transformar metadata de diseñador.
 *
 * Usar estos helpers evita perder campos críticos como identidad,
 * owner, timestamps, origen de duplicación o metadata necesaria
 * para snapshots y colaboración.
 */
export {
  createSchemaDesignerMeta,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
} from '@sisad-pdfme/contracts/schema';

/**
 * Tipos base del core común.
 *
 * Estos contratos son compartidos por Designer, Form, Viewer, Generator,
 * schemas, plugins y runtime.
 */
export type {
  Template,
  Schema,
  SchemaForUI,
  GenerateProps,
  DesignerProps,
  PreviewProps,
  UIProps,
  Plugin,
} from '@sisad-pdfme/common/types';

/* ── Fase 2: Guards e Interaction Layer ─────────────────────────────────────── */

/**
 * Tipos del layer de guards de interacción.
 *
 * Esta capa valida si una acción puede ejecutarse sobre uno o varios schemas,
 * tomando en cuenta permisos, locks, selección, ownership y contexto runtime.
 */
export type {
  InteractionGuardContext,
  GuardResult,
  GuardRejectionReason,
} from '@sisad-pdfme/shared/interactionGuards';

/**
 * Helpers oficiales para validar interacciones del diseñador.
 *
 * Se usan antes de ejecutar acciones mutantes para separar schemas permitidos
 * de schemas bloqueados y evitar cambios inválidos sobre elementos protegidos.
 */
export {
  validateInteraction,
  validateBulkInteraction,
  getBlockedSchemas,
  getAllowedSchemas,
} from '@sisad-pdfme/shared/interactionGuards';

/**
 * Tipos de comandos y origen de acción.
 *
 * Permiten clasificar operaciones y reconocer desde dónde se originan:
 * canvas, toolbar, sidebar, teclado, API externa, entre otros.
 */
export type { CommandType, ActionSource } from '@sisad-pdfme/shared/commandTypes';

/**
 * Catálogos de acciones por riesgo.
 *
 * `MUTATING_ACTIONS` agrupa acciones que modifican estado.
 * `READ_ONLY_SAFE_ACTIONS` agrupa acciones seguras de lectura/navegación.
 */
export { MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS } from '@sisad-pdfme/shared/commandTypes';

/* ── Fase 7: Snapshot oficial ───────────────────────────────────────────────── */

/**
 * Contratos del snapshot oficial SISAD PDFME.
 *
 * El snapshot representa el estado serializable del diseñador:
 * documentos, páginas, destinatarios, assignments, firma, comentarios,
 * metadata, backgrounds y schemas enriquecidos.
 */
export type {
  OfficialTemplateSnapshot,
  SnapshotDocument,
  SnapshotPage,
  SnapshotRecipient,
  SnapshotAssignment,
  SignatureConfig,
  ProviderConfig,
  SnapshotComment,
  SnapshotMetadata,
  PageBackground,
  SerializeOptions,
  SchemaWithDesigner,
} from '@sisad-pdfme/shared/snapshot';

/**
 * Utilidades base del snapshot oficial.
 *
 * `SNAPSHOT_VERSION` define la versión vigente del contrato.
 * `makeEmptySnapshot` crea un snapshot vacío válido.
 */
export { SNAPSHOT_VERSION, makeEmptySnapshot } from '@sisad-pdfme/shared/snapshot';

/**
 * Adaptador oficial para serializar, hidratar y validar el snapshot actual.
 */
export { snapshotAdapter } from '@sisad-pdfme/shared/snapshotAdapter';

/**
 * Tipos auxiliares del adaptador de snapshot.
 *
 * `ValidationResult` describe el resultado de validación.
 * `DesignerState` representa el estado reconstruido o serializable.
 */
export type { ValidationResult, DesignerState } from '@sisad-pdfme/shared/snapshotAdapter';

/* ── Fase 8: Provider Registry ──────────────────────────────────────────────── */

/**
 * Contratos del registry de providers de firma.
 *
 * Esta capa desacopla los schemas de firma de proveedores concretos
 * definidos por el host u otros integradores externos.
 */
export type {
  SignatureProvider,
  SignaturePolicy,
  SignatureCaptureContext,
  SignatureExecutionContext,
  SignatureResult,
  SignatureValidation,
  ExternalSignatureAdapter,
} from '@sisad-pdfme/shared/signatureRegistry';

/**
 * API pública del registry de providers de firma.
 *
 * Permite consultar providers disponibles, resolver defaults y manejar
 * errores cuando un provider no está registrado.
 */
export {
  signatureProviderRegistry,
  ProviderNotRegisteredError,
  getAvailableProvidersForSchema,
  getDefaultProviderForSchema,
} from '@sisad-pdfme/shared/signatureRegistry';
/**
 * Catálogo canónico de eventos.
 *
 * Unión discriminada + sobre versionado que reemplaza el `type: string` libre
 * del hub de runtime. Es contrato puro: no transporta ni emite.
 */
export {
  SISAD_PDFME_EVENT_VERSION,
  SISAD_PDFME_EVENTS,
  SISAD_PDFME_EVENT_NAMES,
  SISAD_PDFME_EVENT_DOMAIN_BY_NAME,
  isSisadPdfmeEventName,
  isSisadPdfmeCustomEventName,
  isSisadPdfmeEvent,
  isSisadPdfmeEventOf,
  createSisadPdfmeEvent,
  createSisadPdfmeCustomEvent,
} from '@sisad-pdfme/contracts/events';

export type {
  SisadPdfmeEventDomain,
  SisadPdfmeEventName,
  SisadPdfmeCustomEventName,
  SisadPdfmeAnyEventName,
  SisadPdfmeEventPayloads,
  SisadPdfmeEventEnvelope,
  SisadPdfmeEvent,
  SisadPdfmeCustomEvent,
  SisadPdfmeAnyEvent,
  SisadPdfmeSerializable,
  CreateEventContext,
} from '@sisad-pdfme/contracts/events';
