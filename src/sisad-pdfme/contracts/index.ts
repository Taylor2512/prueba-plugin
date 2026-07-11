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
 * Contratos de assignments de schemas.
 *
 * `SchemaAssignments` representa el formato normalizado actual.
 * `LegacySchemaAssignments` conserva compatibilidad con snapshots antiguos.
 */
export type { SchemaAssignments, LegacySchemaAssignments } from './assignments.js';

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
} from './commands.js';

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
} from './comments.js';

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
} from './plugins.js';

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
} from './schema.js';

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
} from './schema.js';

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
} from '../common/types.js';

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
} from '../shared/interactionGuards.js';

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
} from '../shared/interactionGuards.js';

/**
 * Tipos de comandos y origen de acción.
 *
 * Permiten clasificar operaciones y reconocer desde dónde se originan:
 * canvas, toolbar, sidebar, teclado, API externa, entre otros.
 */
export type { CommandType, ActionSource } from '../shared/commandTypes.js';

/**
 * Catálogos de acciones por riesgo.
 *
 * `MUTATING_ACTIONS` agrupa acciones que modifican estado.
 * `READ_ONLY_SAFE_ACTIONS` agrupa acciones seguras de lectura/navegación.
 */
export { MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS } from '../shared/commandTypes.js';

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
} from '../shared/snapshot.js';

/**
 * Utilidades base del snapshot oficial.
 *
 * `SNAPSHOT_VERSION` define la versión vigente del contrato.
 * `isLegacySnapshot` detecta formatos anteriores.
 * `makeEmptySnapshot` crea un snapshot vacío válido.
 */
export { SNAPSHOT_VERSION, isLegacySnapshot, makeEmptySnapshot } from '../shared/snapshot.js';

/**
 * Adaptador oficial para serializar, hidratar, validar y migrar entre
 * estado del diseñador, template y snapshot.
 */
export { snapshotAdapter } from '../shared/snapshotAdapter.js';

/**
 * Tipos auxiliares del adaptador de snapshot.
 *
 * `ValidationResult` describe el resultado de validación.
 * `DesignerState` representa el estado reconstruido o serializable.
 */
export type { ValidationResult, DesignerState } from '../shared/snapshotAdapter.js';

/* ── Fase 8: Provider Registry ──────────────────────────────────────────────── */

/**
 * Contratos del registry de providers de firma.
 *
 * Esta capa desacopla los schemas de firma de proveedores concretos
 * como SISAD, Uanataca, OneShot u otros integradores externos.
 */
export type {
  SignatureProvider,
  SignaturePolicy,
  SignatureCaptureContext,
  SignatureExecutionContext,
  SignatureResult,
  SignatureValidation,
  ExternalSignatureAdapter,
} from '../shared/signatureRegistry.js';

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
} from '../shared/signatureRegistry.js';