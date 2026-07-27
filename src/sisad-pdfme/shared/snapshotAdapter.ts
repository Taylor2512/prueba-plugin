/**
 * FASE 7 — Snapshot Adapter
 *
 * Serializa/deserializa el estado del designer hacia/desde OfficialTemplateSnapshot.
 * Migra snapshots legacy (pdfme ~4.x sin campo version) a v2.
 *
 * Estrategia de migración:
 *   - Detección: ausencia de 'version' o version < "2.0.0"
 *   - Ejecución: en import time (no lazy)
 *   - Pérdida aceptable: historial Yjs, estado de locks, metadatos por schema individuales
 *   - Pérdida inaceptable: schemas, recipients, assignments, firma
 */
import type {
  OfficialTemplateSnapshot,
  SnapshotDocument,
  SnapshotPage,
  SnapshotRecipient,
  SnapshotAssignment,
  SnapshotConnectivity,
  SnapshotFileConnectivity,
  SnapshotSchemaConnectivity,
  SnapshotContributor,
  SignatureConfig,
  SerializeOptions,
  SchemaWithDesigner,
} from './snapshot.js';
import {
  SNAPSHOT_VERSION,
  isLegacySnapshot,
} from './snapshot.js';
import { asRecord } from './objectGuards.js';
import { normalizeLooseText } from './text.js';
import { cloneDeep } from '@sisad-pdfme/common';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Estado interno serializable: comparte exactamente el payload operativo del
 * snapshot oficial, excluyendo identidad, timestamps y metadata de cabecera.
 */
export type DesignerState = Omit<
  OfficialTemplateSnapshot,
  'version' | 'templateId' | 'createdAt' | 'updatedAt' | 'metadata'
>;

const normalizeConnectivityRecord = <T extends Record<string, unknown>>(value: unknown): T | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return cloneDeep(value) as T;
};

export const normalizeSnapshotConnectivity = (
  connectivity?: SnapshotConnectivity | null,
): SnapshotConnectivity | undefined => {
  if (!connectivity || typeof connectivity !== 'object') return undefined;
  const byFile = normalizeConnectivityRecord<Record<string, SnapshotFileConnectivity>>(connectivity.byFile);
  const bySchema = normalizeConnectivityRecord<Record<string, Record<string, SnapshotSchemaConnectivity>>>(connectivity.bySchema);
  const byRecipient = normalizeConnectivityRecord<Record<string, unknown>>(connectivity.byRecipient);
  const legacyMapping = normalizeConnectivityRecord<Record<string, unknown>>(connectivity.legacyMapping);

  if (!byFile && !bySchema && !byRecipient && !legacyMapping) return undefined;

  return {
    byFile: byFile || legacyMapping || undefined,
    bySchema: bySchema || undefined,
    byRecipient: byRecipient || undefined,
    legacyMapping: legacyMapping || undefined,
  };
};

const resolveSnapshotConnectivityRecord = (snapshot: unknown): SnapshotConnectivity | undefined => {
  const record = asRecord(snapshot) || {};
  const connectivity = asRecord(record.connectivity);
  const legacyMapping = asRecord(record.connectivityMapping);
  if (!connectivity && !legacyMapping) return undefined;
  return normalizeSnapshotConnectivity({
    byFile: asRecord(connectivity?.byFile) || legacyMapping || undefined,
    bySchema: asRecord(connectivity?.bySchema) || undefined,
    byRecipient: asRecord(connectivity?.byRecipient) || undefined,
    legacyMapping: legacyMapping || undefined,
  });
};

const normalizeConnectivityKey = normalizeLooseText;

class SnapshotAdapterImpl {
  /**
   * Serializa el estado del designer a OfficialTemplateSnapshot.
   * Por defecto usa backgroundMode: 'base64' para funcionar sin backend.
   * Usar backgroundMode: 'url' solo cuando hay servidor que sirva los PDFs.
   */
  serialize(
    state: DesignerState,
    metadata: OfficialTemplateSnapshot['metadata'],
    options: SerializeOptions = { backgroundMode: 'base64' },
  ): OfficialTemplateSnapshot {
    const now = new Date().toISOString();
    const documents = options.backgroundMode === 'url'
      ? state.documents
      : this._convertBackgroundsToBase64(state.documents);

    const snapshot: OfficialTemplateSnapshot = {
      version: SNAPSHOT_VERSION,
      templateSchemaVersion: state.templateSchemaVersion || SNAPSHOT_VERSION,
      templateId: this._generateTemplateId(),
      createdAt: now,
      updatedAt: now,
      metadata,
      activeDocumentId: state.activeDocumentId ?? null,
      documents,
      uploadedDocuments: state.uploadedDocuments ?? state.documents,
      recipients: state.recipients,
      assignments: state.assignments,
      connectivity: normalizeSnapshotConnectivity(state.connectivity),
      inputs: state.inputs,
      contributors: state.contributors,
      history: state.history,
      signatureConfig: state.signatureConfig,
      signaturePolicyId: state.signaturePolicyId ?? null,
      signatureMode: state.signatureMode ?? null,
      signatureProviderKey: state.signatureProviderKey ?? null,
      providerConfig: state.providerConfig,
      delivery: state.delivery,
      message: state.message,
      security: state.security,
      comments: state.comments,
    };

    return snapshot;
  }

  /** Restaura el estado del designer desde un snapshot */
  deserialize(snapshot: OfficialTemplateSnapshot): DesignerState {
    return {
      templateSchemaVersion: snapshot.templateSchemaVersion,
      activeDocumentId: snapshot.activeDocumentId ?? null,
      documents: snapshot.documents,
      uploadedDocuments: snapshot.uploadedDocuments,
      recipients: snapshot.recipients,
      assignments: snapshot.assignments,
      connectivity: normalizeSnapshotConnectivity(snapshot.connectivity),
      inputs: snapshot.inputs,
      contributors: snapshot.contributors,
      history: snapshot.history,
      signatureConfig: snapshot.signatureConfig,
      signaturePolicyId: snapshot.signaturePolicyId ?? null,
      signatureMode: snapshot.signatureMode ?? null,
      signatureProviderKey: snapshot.signatureProviderKey ?? null,
      providerConfig: snapshot.providerConfig,
      delivery: snapshot.delivery,
      message: snapshot.message,
      security: snapshot.security,
      comments: snapshot.comments,
    };
  }

  /**
   * Migra un snapshot de cualquier versión anterior a v2.
   * Siempre retorna un OfficialTemplateSnapshot válido en v2.
   * Ejecutar en import time.
   */
  migrate(raw: unknown): OfficialTemplateSnapshot {
    if (!isLegacySnapshot(raw)) {
      // Ya es v2 (o superior) — retornar tal cual
      return raw as OfficialTemplateSnapshot;
    }

    // Legacy pdfme ~4.x: { schemas: SchemaPageArray[][], basePdf?: string, ... }
    const legacy = asRecord(raw) || {};
    const now = new Date().toISOString();
    const legacySchemas = this._extractLegacySchemas(legacy);
    const legacyRecipients = this._extractLegacyRecipients(legacy);
    const uploadedDocuments =
      Array.isArray(legacy.uploadedDocuments) && legacy.uploadedDocuments.length > 0
        ? (legacy.uploadedDocuments as SnapshotDocument[])
        : undefined;
    const legacySignaturePolicyId = this._resolveLegacySignaturePolicyId(legacy);
    const legacySignatureMode = this._resolveLegacySignatureMode(legacy, legacySignaturePolicyId);
    const legacyConnectivity = this._resolveLegacyConnectivity(legacy);

    const documents: SnapshotDocument[] = [
      {
        documentId: this._generateId(),
        name: typeof legacy.name === 'string' ? legacy.name : 'Documento importado',
        order: 0,
        pages: legacySchemas.map((pageSchemas, index) => ({
          pageNumber: index + 1,
          schemas: pageSchemas.map((schema) =>
            this._migrateSchema(schema, index + 1, 'doc-0'),
          ),
          background: this._migrateBackground(legacy, index),
        })),
      },
    ];

    return {
      version: SNAPSHOT_VERSION,
      templateSchemaVersion:
        typeof legacy.templateSchemaVersion === 'string'
          ? legacy.templateSchemaVersion
          : SNAPSHOT_VERSION,
      templateId: typeof legacy.templateId === 'string' ? legacy.templateId : this._generateId(),
      createdAt: now,
      updatedAt: now,
      metadata: {
        name: typeof legacy.name === 'string' ? legacy.name : 'Template migrado',
        createdByUserId: 'migration',
        description: 'Migrado automáticamente desde formato pdfme v1',
      },
      activeDocumentId:
        typeof legacy.activeDocumentId === 'string' && legacy.activeDocumentId.trim()
          ? legacy.activeDocumentId.trim()
          : documents[0]?.documentId ?? null,
      documents,
      uploadedDocuments: uploadedDocuments ?? documents,
      recipients: legacyRecipients,
      assignments: this._extractLegacyAssignments(legacySchemas),
      connectivity: normalizeSnapshotConnectivity(legacyConnectivity),
      inputs: Array.isArray(legacy.inputs) ? (legacy.inputs as Array<Record<string, unknown>>) : undefined,
      contributors: Array.isArray(legacy.contributors)
        ? (legacy.contributors as SnapshotContributor[])
        : undefined,
      history: Array.isArray(legacy.history) ? (legacy.history as Array<Record<string, unknown>>) : undefined,
      signatureConfig: {
        defaultMode: legacySignatureMode,
        allowedModes: ['draw', 'image', 'p12', 'provider'],
      },
      signaturePolicyId: legacySignaturePolicyId,
      signatureMode: legacySignatureMode,
      signatureProviderKey:
        typeof legacy.signatureProviderKey === 'string'
          ? legacy.signatureProviderKey
          : typeof legacy.signatureProvider === 'string'
            ? legacy.signatureProvider
            : null,
      providerConfig: {
        defaultProvider: legacySignatureMode === 'provider' ? 'provider' : 'draw',
        allowedProviders: ['draw', 'image', 'p12', 'provider'],
      },
      delivery: asRecord(legacy.delivery) || undefined,
      message: asRecord(legacy.message) || undefined,
      security: asRecord(legacy.security) || undefined,
    };
  }

  /** Valida que un snapshot sea compatible con el sistema */
  validate(snapshot: unknown): ValidationResult {
    const errors: string[] = [];

    if (!snapshot || typeof snapshot !== 'object') {
      return { valid: false, errors: ['El snapshot no es un objeto válido'] };
    }

    const obj = asRecord(snapshot);
    if (!obj) {
      return { valid: false, errors: ['El snapshot no es un objeto válido'] };
    }

    if (!obj.version || typeof obj.version !== 'string') {
      errors.push('Campo "version" faltante o inválido');
    }
    if (!obj.templateId || typeof obj.templateId !== 'string') {
      errors.push('Campo "templateId" faltante o inválido');
    }
    if (!Array.isArray(obj.documents)) {
      errors.push('Campo "documents" faltante o no es array');
    }
    if (!Array.isArray(obj.recipients)) {
      errors.push('Campo "recipients" faltante o no es array');
    }
    if (!Array.isArray(obj.assignments)) {
      errors.push('Campo "assignments" faltante o no es array');
    }
    if (!obj.signatureConfig || typeof obj.signatureConfig !== 'object') {
      errors.push('Campo "signatureConfig" faltante');
    }
    if (!obj.metadata || typeof obj.metadata !== 'object') {
      errors.push('Campo "metadata" faltante');
    }

    return { valid: errors.length === 0, errors };
  }

  // ── Privados de migración ──────────────────────────────────────────────

  private _extractLegacySchemas(legacy: unknown): unknown[][] {
    const record = asRecord(legacy) || {};
    // pdfme v4: { schemas: [[...], [...]] } o { schemas: { '0': [...] } }
    const schemas = record.schemas;
    if (Array.isArray(schemas)) return schemas as unknown[][];
    if (schemas && typeof schemas === 'object' && !Array.isArray(schemas)) {
      return Object.values(schemas as Record<string, unknown[]>);
    }
    return [[]];
  }

  private _extractLegacyRecipients(legacy: unknown): SnapshotRecipient[] {
    const record = asRecord(legacy) || {};
    // pdfme v4 no tiene recipients nativos — retornar vacío
    const recipients = record.recipients;
    if (Array.isArray(recipients)) {
      return recipients as SnapshotRecipient[];
    }
    return [];
  }

  private _extractLegacyAssignments(legacyPages: unknown[][]): SnapshotAssignment[] {
    const assignments: SnapshotAssignment[] = [];
    for (const page of legacyPages) {
      for (const schema of page) {
        const schemaRecord = asRecord(schema);
        if (!schemaRecord) continue;
        const uid = typeof schemaRecord.schemaUid === 'string'
          ? schemaRecord.schemaUid
          : typeof schemaRecord.id === 'string'
            ? schemaRecord.id
            : typeof schemaRecord.name === 'string'
              ? schemaRecord.name
              : '';
        if (!uid) continue;
        const recipientId =
          typeof schemaRecord.ownerRecipientId === 'string'
            ? schemaRecord.ownerRecipientId
            : typeof schemaRecord.recipientId === 'string'
              ? schemaRecord.recipientId
              : '';
        if (recipientId) {
          assignments.push({
            schemaUid: uid,
            recipientId,
            scope: 'recipient',
          });
        }
      }
    }
    return assignments;
  }

  private _resolveLegacyConnectivity(legacy: Record<string, unknown>): SnapshotConnectivity | undefined {
    const legacyMapping = asRecord(legacy.connectivityMapping);
    const connectivity = asRecord(legacy.connectivity);
    const byFile = asRecord(connectivity?.byFile);
    const bySchema = asRecord(connectivity?.bySchema);
    const byRecipient = asRecord(connectivity?.byRecipient);

    if (!legacyMapping && !byFile && !bySchema && !byRecipient) return undefined;

    return normalizeSnapshotConnectivity({
      byFile: byFile || legacyMapping || undefined,
      bySchema: bySchema || undefined,
      byRecipient: byRecipient || undefined,
      legacyMapping: legacyMapping || undefined,
    });
  }

  private _resolveLegacySignaturePolicyId(legacy: Record<string, unknown>): string | null {
    const policy = typeof legacy.signaturePolicyId === 'string'
      ? legacy.signaturePolicyId.trim()
      : typeof legacy.singType === 'string'
        ? legacy.singType.trim()
        : typeof legacy.signaturePolicy === 'string'
          ? legacy.signaturePolicy.trim()
          : '';

    return policy || null;
  }

  private _resolveLegacySignatureMode(
    legacy: Record<string, unknown>,
    signaturePolicyId: string | null,
  ): SignatureConfig['defaultMode'] {
    const rawMode = typeof legacy.signatureMode === 'string'
      ? legacy.signatureMode.trim()
      : typeof legacy.signatureType === 'string'
        ? legacy.signatureType.trim()
        : '';

    const normalizedMode = rawMode.toLowerCase();
    if (normalizedMode === 'draw' || normalizedMode === 'image' || normalizedMode === 'p12' || normalizedMode === 'provider') {
      return normalizedMode;
    }

    const normalizedPolicy = (signaturePolicyId || '').toLowerCase();
    if (normalizedPolicy === 'electronica' || normalizedPolicy === 'p12') return 'p12';
    if (normalizedPolicy === 'oneshot' || normalizedPolicy === 'provider') return 'provider';
    return 'draw';
  }

  private _migrateSchema(
    schema: unknown,
    pageNumber: number,
    documentId: string,
  ): SchemaWithDesigner {
    const s = asRecord(schema) || {};
    const existingMeta = asRecord(s.__designer);

    return {
      ...s,
      __designer: {
        ...existingMeta,
        schemaUid:
          (typeof existingMeta?.schemaUid === 'string' && existingMeta.schemaUid) ||
          (typeof s.schemaUid === 'string' && s.schemaUid) ||
          (typeof s.id === 'string' && s.id) ||
          this._generateId(),
        templateVersion: SNAPSHOT_VERSION,
        documentId,
        pageNumber,
        recipientId:
          (typeof existingMeta?.recipientId === 'string' && existingMeta.recipientId) ||
          (typeof s.ownerRecipientId === 'string' && s.ownerRecipientId) ||
          (typeof s.recipientId === 'string' && s.recipientId) ||
          undefined,
        recipientName:
          (typeof existingMeta?.recipientName === 'string' && existingMeta.recipientName) ||
          (typeof s.ownerRecipientName === 'string' && s.ownerRecipientName) ||
          undefined,
        recipientColor:
          (typeof existingMeta?.recipientColor === 'string' && existingMeta.recipientColor) ||
          (typeof s.userColor === 'string' && s.userColor) ||
          (typeof s.ownerColor === 'string' && s.ownerColor) ||
          undefined,
        assignment: {
          scope: (s.ownerRecipientId || s.recipientId) ? 'recipient' : 'global',
        },
        ownership: {
          readonly: Boolean(s.readonly || s.locked),
        },
        version: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private _migrateBackground(
    legacy: unknown,
    _pageIndex: number,
  ): SnapshotPage['background'] {
    const record = asRecord(legacy) || {};
    const basePdf = record.basePdf;
    if (!basePdf) return { type: 'none' };
    if (typeof basePdf === 'string') {
      if (basePdf.startsWith('data:')) {
        return { type: 'base64', data: basePdf, mimeType: 'application/pdf' };
      }
      return { type: 'url', url: basePdf };
    }
    return { type: 'none' };
  }

  private _convertBackgroundsToBase64(documents: SnapshotDocument[]): SnapshotDocument[] {
    // En una implementación real, descargaría las URLs y las convertiría a base64.
    // Aquí retornamos los documentos tal cual — la conversión real es async y
    // requiere un fetch, lo que escapa al scope del adapter síncrono.
    return documents;
  }

  private _generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }

  private _generateTemplateId(): string {
    return this._generateId();
  }
}

export const snapshotAdapter = new SnapshotAdapterImpl();

/** Exportar también la clase para extensión en tests */
export { SnapshotAdapterImpl };

const normalizeSnapshotText = normalizeLooseText;

const normalizeSnapshotTemplate = (template: unknown) => {
  if (!template || typeof template !== 'object') return null;
  const record = asRecord(template) || {};
  return {
    ...cloneDeep(record),
    schemas: Array.isArray(record.schemas) ? record.schemas : [[]],
  };
};

const normalizeSnapshotDocuments = (snapshot: unknown) => {
  const record = asRecord(snapshot) || {};
  if (Array.isArray(record.documents) && record.documents.length > 0) {
    return record.documents;
  }
  if (Array.isArray(record.files)) {
    return record.files;
  }
  return [];
};

export const parsePdfmeSnapshot = (payload: unknown = {}) =>
  payload && typeof payload === 'object' ? payload : {};

export const extractDocumentsFromSnapshot = (snapshot: unknown = {}) =>
  normalizeSnapshotDocuments(snapshot);

export const resolveDocumentSnapshot = (snapshot: unknown = {}, documentId: string | null = null) => {
  const normalizedId = normalizeSnapshotText(documentId);
  const documents = normalizeSnapshotDocuments(snapshot);
  if (!normalizedId) return documents[0] || null;
  return (
    documents.find((document) => normalizeSnapshotText((document as Record<string, unknown>)?.id) === normalizedId) ||
    null
  );
};

export const resolveDocumentTemplate = (snapshot: unknown = {}, documentId: string | null = null) => {
  const document = resolveDocumentSnapshot(snapshot, documentId) as Record<string, unknown> | null;
  if (!document) return null;
  return normalizeSnapshotTemplate(document.template || document.originalForm);
};

export const extractOriginalFormFromSnapshot = (snapshot: unknown = {}, documentId: string | null = null) =>
  resolveDocumentTemplate(snapshot, documentId);

export const extractAssignmentsFromSnapshot = (snapshot: unknown = {}, documentId: string | null = null) => {
  const document = resolveDocumentSnapshot(snapshot, documentId) as Record<string, unknown> | null;
  if (!document) return {};
  return (document.assignments && typeof document.assignments === 'object' ? cloneDeep(document.assignments) : {}) as Record<string, unknown>;
};

export const resolveSnapshotConnectivity = (snapshot: unknown = {}): SnapshotConnectivity | undefined =>
  resolveSnapshotConnectivityRecord(snapshot);

export const resolveSnapshotConnectivityByFile = (
  snapshot: unknown = {},
  fileId: string | null = null,
): SnapshotFileConnectivity | null => {
  const normalizedFileId = normalizeConnectivityKey(fileId);
  if (!normalizedFileId) return null;
  const connectivity = resolveSnapshotConnectivityRecord(snapshot);
  const byFile = asRecord(connectivity?.byFile);
  return (byFile ? asRecord(byFile[normalizedFileId]) : null) as SnapshotFileConnectivity | null;
};

export const resolveSnapshotConnectivityBySchema = (
  snapshot: unknown = {},
  fileId: string | null = null,
  schemaUid: string | null = null,
): SnapshotSchemaConnectivity | null => {
  const normalizedSchemaUid = normalizeConnectivityKey(schemaUid);
  if (!normalizedSchemaUid) return null;
  const connectivity = resolveSnapshotConnectivityRecord(snapshot);
  const bySchema = asRecord(connectivity?.bySchema);
  const normalizedFileId = normalizeConnectivityKey(fileId);

  if (normalizedFileId) {
    const fileSchemas = asRecord(bySchema?.[normalizedFileId]);
    return (fileSchemas ? asRecord(fileSchemas[normalizedSchemaUid]) : null) as SnapshotSchemaConnectivity | null;
  }

  for (const fileSchemas of Object.values(bySchema || {})) {
    const schemaEntry = asRecord(fileSchemas);
    if (!schemaEntry) continue;
    const resolved = asRecord(schemaEntry[normalizedSchemaUid]);
    if (resolved) return resolved as SnapshotSchemaConnectivity;
  }

  return null;
};

export const serializeSnapshotForTxt = (snapshot: unknown = {}) => JSON.stringify(snapshot || {}, null, 2);
