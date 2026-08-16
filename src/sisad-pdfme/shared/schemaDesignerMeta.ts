/**
 * FASE 1 — Contratos de identidad de schema
 *
 * SchemaDesignerMeta es el campo __designer que viaja dentro de cada Schema.
 * Es la fuente de verdad de identidad, asignación, ownership y configuración
 * de firma para cada campo del template.
 *
 * Propietarios:
 *   - schemaUid, createdAt     → sisad-pdfme (inmutable tras creación)
 *   - recipientId/Name/Color   → sisad-pdfme via schema.assign_recipient
 *   - assignment, signature    → sisad-pdfme
 *   - ownership                → host (política inyectada)
 *   - integration              → host (opaco para el runtime)
 *   - templateVersion          → host (al guardar)
 *   - version, updatedAt       → sisad-pdfme (auto en cada mutación)
 */
/**
 * Metadatos de agrupación para un schema.
 * Soporta grupos visuales (creados manualmente) y grupos lógicos
 * (RadioGroup, CheckboxGroup, signatureBlock, table, repeatable).
 */
export interface GroupMeta {
  /** UUID  del grupo — estable durante toda la vida del grupo */
  groupId: string;
  /**
   * Tipo de grupo:
   * - visual        → agrupación manual del diseñador (Cmd+G)
   * - radio         → grupo lógico RadioGroup (exclusividad de selección)
   * - checkbox      → grupo lógico CheckboxGroup
   * - signatureBlock → bloque de firma con campos relacionados
   * - table         → tabla con celdas interrelacionadas
   * - repeatable    → sección repetible (tipo FormArray)
   */
  groupType: 'visual' | 'radio' | 'checkbox' | 'signatureBlock' | 'table' | 'repeatable';
  /** Nombre legible del grupo — mostrado en el inspector y en la lista de campos */
  groupName?: string;
  /** ID del grupo padre para grupos anidados */
  parentGroupId?: string;
  /** Orden del schema dentro del grupo (0-indexed) */
  order?: number;
  /**
   * Si true, mover/copiar/eliminar cualquier miembro afecta a todo el grupo.
   * Comportamiento DocuSign-style.
   */
  lockedAsGroup?: boolean;
}

export interface DesignerAssignment {
  scope: 'recipient' | 'group' | 'global';
  recipientIds?: string[];
  groupIds?: string[];
}

export interface DesignerOwnership {
  ownerUserId?: string;
  ownerRecipientId?: string;
  editableBy?: string[];
  readonly?: boolean;
}

export interface DesignerSignatureSettings {
  mode?: 'draw' | 'image' | 'p12' | 'provider';
  providerKey?: string;
  allowedProviders?: string[];
}

export interface DesignerIntegrationBinding {
  provider?: string;
  envelopeId?: string;
  tabId?: string;
  externalRef?: string;
}

export interface SchemaDesignerMeta {
  /** UUID  inmutable — generado en schema.create, nunca regenerado excepto en colisión de import */
  schemaUid: string;
  /** Semver del template completo. Ej: "2.0.0". Versiona el documento, no el schema individual. */
  templateVersion: string;
  /** ID del documento contenedor */
  documentId: string;
  /** Número de página (1-indexed). Mutable solo via page.move command. */
  pageNumber: number;

  /** ID del destinatario asignado — fuente: schema.assign_recipient */
  recipientId?: string;
  /** Nombre desnormalizado del destinatario — para renderizado rápido sin lookup */
  recipientName?: string;
  /** Color hex desnormalizado del destinatario — para border/badge sin lookup */
  recipientColor?: string;

  /** Scope de asignación del schema */
  assignment?: DesignerAssignment;

  /** Política de ownership — escrita por el host, leída por guards */
  ownership?: DesignerOwnership;

  /** Configuración de firma — no hardcodea el provider, usa clave opaca */
  signature?: DesignerSignatureSettings;

  /**
   * Agrupación visual o lógica del schema.
   * Escrito por sisad-pdfme al ejecutar group/ungroup.
   * Los grupos visuales son manuales; los grupos lógicos (radio, checkbox, etc.)
   * se crean automáticamente al insertar ciertos tipos de schema.
   */
  group?: GroupMeta;

  /**
   * Datos de integración con proveedor externo.
   * Completamente opacos para sisad-pdfme — el host los interpreta.
   * Ejemplo: { provider: 'external-provider', externalRef: 'opaque-ref' }
   */
  integration?: DesignerIntegrationBinding;

  /**
   * Contador de mutaciones para reconciliación Yjs.
   * Auto-incrementado en cada mutación. No se usa en la UI.
   */
  version?: number;

  /** ISO 8601 — inmutable tras la creación */
  createdAt?: string;
  /** ISO 8601 — actualizado en cada mutación */
  updatedAt?: string;
}

// ── __designer   contract ─────────────────────────────────────────

/** Identidad inmutable del schema. Escrita en creación, nunca sobreescrita. */
export interface DesignerIdentity {
  schemaUid: string;
  templateVersion: string;
  documentId: string;
  pageNumber: number;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Datos de colaboración y asignación — escritos por sisad-pdfme via commands. */
export interface DesignerCollaboration {
  recipientId?: string;
  recipientName?: string;
  recipientColor?: string;
  assignment?: DesignerAssignment;
  ownership?: DesignerOwnership;
  lock?: {
    lockedBy?: string;
    lockedByName?: string;
    lockedAt?: string;
  };
  comments?: unknown[];
  commentAnchors?: unknown[];
}

/** Bindings a proveedores externos — opacos para el runtime. */
export interface DesignerBindings {
  integration?: DesignerIntegrationBinding;
}

/** Estado de UI del schema — grupo visual, hints de render. */
export interface DesignerUI {
  group?: GroupMeta;
  renderHints?: Record<string, unknown>;
}

/** Estado de runtime del schema — firma, estado del ciclo de vida. */
export interface DesignerRuntime {
  state?: string;
  signature?: DesignerSignatureSettings;
}

/**
 * Contrato  del campo __designer.
 * Organiza los metadatos en sub-objetos semánticos en vez del objeto plano .
 * Backward compatible: el campo plano `SchemaDesignerMeta` sigue funcionando.
 */
export interface DesignerConfig {
  _v: 3;
  identity: DesignerIdentity;
  collaboration?: DesignerCollaboration;
  bindings?: DesignerBindings;
  ui?: DesignerUI;
  runtime?: DesignerRuntime;
}

/** Genera un __designer  inicial para un schema nuevo */
export function createDesignerConfig(params: {
  documentId: string;
  pageNumber: number;
  templateVersion: string;
  recipientId?: string;
  recipientName?: string;
  recipientColor?: string;
}): DesignerConfig {
  const now = new Date().toISOString();
  return {
    _v: 3,
    identity: {
      schemaUid: generateSchemaUid(),
      templateVersion: params.templateVersion,
      documentId: params.documentId,
      pageNumber: params.pageNumber,
      version: 0,
      createdAt: now,
      updatedAt: now,
    },
    collaboration: params.recipientId
      ? {
          recipientId: params.recipientId,
          recipientName: params.recipientName,
          recipientColor: params.recipientColor,
          assignment: { scope: 'recipient', recipientIds: [params.recipientId] },
        }
      : { assignment: { scope: 'global' } },
  };
}

// ──  flat contract () — kept for backward compatibility ───────────────

/** Genera un __designer inicial para un schema nuevo */
export function createSchemaDesignerMeta(params: {
  documentId: string;
  pageNumber: number;
  templateVersion: string;
  recipientId?: string;
  recipientName?: string;
  recipientColor?: string;
}): SchemaDesignerMeta {
  const now = new Date().toISOString();
  return {
    schemaUid: generateSchemaUid(),
    templateVersion: params.templateVersion,
    documentId: params.documentId,
    pageNumber: params.pageNumber,
    recipientId: params.recipientId,
    recipientName: params.recipientName,
    recipientColor: params.recipientColor,
    assignment: params.recipientId
      ? { scope: 'recipient', recipientIds: [params.recipientId] }
      : { scope: 'global' },
    version: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Produce el __designer para un schema duplicado.
 * Nuevo UUID, reset de createdAt/updatedAt y version, resto se copia.
 */
export function duplicateSchemaDesignerMeta(
  source: SchemaDesignerMeta,
): SchemaDesignerMeta {
  const now = new Date().toISOString();
  return {
    ...source,
    schemaUid: generateSchemaUid(),
    version: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Produce el __designer para un schema pegado.
 * Siempre genera nuevo UUID. Resetea integration si cambia de documento.
 */
export function pasteSchemaDesignerMeta(
  source: SchemaDesignerMeta,
  target: { pageNumber: number; documentId: string },
): SchemaDesignerMeta {
  const now = new Date().toISOString();
  const sameDocument = source.documentId === target.documentId;
  return {
    ...source,
    schemaUid: generateSchemaUid(),
    pageNumber: target.pageNumber,
    documentId: target.documentId,
    // integration se resetea al cambiar documento
    integration: sameDocument ? source.integration : {},
    version: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/** Genera un UUID  compatible con browser y Node */
export function generateSchemaUid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para entornos sin crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
