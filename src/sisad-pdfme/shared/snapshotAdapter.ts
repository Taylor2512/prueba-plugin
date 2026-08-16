/**
 * FASE 7 — Snapshot Adapter
 *
 * Serializa/deserializa el estado del designer hacia/desde OfficialTemplateSnapshot.
 * Serializa únicamente la representación actual del snapshot.
 */
import type {
  OfficialTemplateSnapshot,
  SnapshotDocument,
  SnapshotConnectivity,
  SnapshotFileConnectivity,
  SnapshotSchemaConnectivity,
  SerializeOptions,
} from '@sisad-pdfme/shared/snapshot';
import { SNAPSHOT_VERSION } from '@sisad-pdfme/shared/snapshot';
import { asRecord } from '@sisad-pdfme/shared/objectGuards';
import { normalizeLooseText } from '@sisad-pdfme/shared/text';
import { cloneDeep } from '@sisad-pdfme/common';
import { stripSecrets } from '@sisad-pdfme/common/secrets';

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

const normalizeSnapshotFileConnectivityMap = (value: unknown): Record<string, SnapshotFileConnectivity> | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  const out: Record<string, SnapshotFileConnectivity> = {};
  for (const k of Object.keys(record)) {
    const entry = asRecord(record[k]);
    if (!entry) continue;
    const normalized: SnapshotFileConnectivity = {
      cabinetId: typeof entry.cabinetId === 'string' ? entry.cabinetId : entry.cabinetId === null ? null : undefined,
      folderId: typeof entry.folderId === 'string' ? entry.folderId : entry.folderId === null ? null : undefined,
      subfolderId: typeof entry.subfolderId === 'string' ? entry.subfolderId : entry.subfolderId === null ? null : undefined,
      fileTypeId: typeof entry.fileTypeId === 'string' ? entry.fileTypeId : entry.fileTypeId === null ? null : undefined,
      ...cloneDeep(entry),
    };
    const key = normalizeLooseText(k);
    out[key] = normalized;
  }
  return Object.keys(out).length ? out : undefined;
};

const normalizeSnapshotSchemaConnectivityMap = (value: unknown): Record<string, Record<string, SnapshotSchemaConnectivity>> | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  const out: Record<string, Record<string, SnapshotSchemaConnectivity>> = {};
  for (const fileKey of Object.keys(record)) {
    const fileEntry = asRecord(record[fileKey]);
    if (!fileEntry) continue;
    const inner: Record<string, SnapshotSchemaConnectivity> = {};
    for (const schemaKey of Object.keys(fileEntry)) {
      const schemaRec = asRecord(fileEntry[schemaKey]);
      if (!schemaRec) continue;
      const normalized: SnapshotSchemaConnectivity = {
        indexId: typeof schemaRec.indexId === 'string' ? schemaRec.indexId : schemaRec.indexId === null ? null : undefined,
        indexName: typeof schemaRec.indexName === 'string' ? schemaRec.indexName : schemaRec.indexName === null ? null : undefined,
        schemaName: typeof schemaRec.schemaName === 'string' ? schemaRec.schemaName : schemaRec.schemaName === null ? null : undefined,
        schemaType: typeof schemaRec.schemaType === 'string' ? schemaRec.schemaType : schemaRec.schemaType === null ? null : undefined,
        ...cloneDeep(schemaRec),
      };
      const sKey = normalizeLooseText(schemaKey);
      inner[sKey] = normalized;
    }
    const fKey = normalizeLooseText(fileKey);
    if (Object.keys(inner).length) out[fKey] = inner;
  }
  return Object.keys(out).length ? out : undefined;
};

const normalizeGenericRecord = (value: unknown): Record<string, unknown> | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  return cloneDeep(record) as Record<string, unknown>;
};

export const normalizeSnapshotConnectivity = (
  connectivity?: SnapshotConnectivity | null,
): SnapshotConnectivity | undefined => {
  if (!connectivity || typeof connectivity !== 'object') return undefined;

  const byFile = normalizeSnapshotFileConnectivityMap(connectivity.byFile || connectivity.sourceMapping);
  const bySchema = normalizeSnapshotSchemaConnectivityMap(connectivity.bySchema);
  const byRecipient = normalizeGenericRecord(connectivity.byRecipient);
  const sourceMapping = normalizeGenericRecord(connectivity.sourceMapping);

  if (!byFile && !bySchema && !byRecipient && !sourceMapping) return undefined;

  return {
    byFile: byFile || undefined,
    bySchema: bySchema || undefined,
    byRecipient: byRecipient || undefined,
    sourceMapping: sourceMapping || undefined,
  };
};

const resolveSnapshotConnectivityRecord = (snapshot: unknown): SnapshotConnectivity | undefined => {
  const record = asRecord(snapshot) || {};
  const connectivity = asRecord(record.connectivity);
  const sourceMapping = asRecord(record.connectivityMapping);
  if (!connectivity && !sourceMapping) return undefined;
  return normalizeSnapshotConnectivity({
    byFile: asRecord(connectivity?.byFile) || sourceMapping || undefined,
    bySchema: asRecord(connectivity?.bySchema) || undefined,
    byRecipient: asRecord(connectivity?.byRecipient) || undefined,
    sourceMapping: sourceMapping || undefined,
  } as unknown as SnapshotConnectivity);
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

  /** Valida y devuelve sólo snapshots de la representación actual. */
  assertCurrent(raw: unknown): OfficialTemplateSnapshot {
    const result = this.validate(raw);
    if (!result.valid) {
      throw new Error(`Invalid current snapshot: ${result.errors.join('; ')}`);
    }
    return raw as OfficialTemplateSnapshot;

  }

  /** Valida la representación actual del snapshot. */
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

/**
 * Serializa un snapshot para escribirlo a fichero.
 *
 * **Retira credenciales.** La configuración declarativa de conexión
 * (`SchemaHttpAuthConfig`) admite `token`, `username`, `password` y
 * `headerValue`, se edita desde el inspector y se guarda **dentro del propio
 * schema**; los schemas van en `documents[].pages[].schemas[]`. Sin esta
 * limpieza, exportar un snapshot escribía la contraseña del host en un fichero
 * que el usuario comparte.
 *
 * `createSisadPdfmeInstanceBundle` ya aplicaba `stripSecrets` por esta misma
 * razón. Esta ruta —la que de verdad sale de la máquina— no lo hacía.
 *
 * Consecuencia asumida: un snapshot exportado y vuelto a importar pierde la
 * credencial escrita a mano y hay que volver a introducirla. Es el precio
 * correcto; la alternativa es publicarla. La solución de fondo es que el
 * template no admita secretos literales, y eso sigue abierto.
 */
export const serializeSnapshotForTxt = (snapshot: unknown = {}) =>
  JSON.stringify(stripSecrets(snapshot || {}).value, null, 2);
