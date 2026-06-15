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
  SignatureConfig,
  ProviderConfig,
  SerializeOptions,
  SchemaWithDesigner,
} from './snapshot.js';
import {
  SNAPSHOT_VERSION,
  isLegacySnapshot,
} from './snapshot.js';
import { asRecord } from '../ui/components/Designer/shared/objectGuards.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Estado interno del designer que se puede serializar */
export interface DesignerState {
  documents: SnapshotDocument[];
  recipients: SnapshotRecipient[];
  assignments: SnapshotAssignment[];
  signatureConfig: SignatureConfig;
  providerConfig: ProviderConfig;
  comments?: OfficialTemplateSnapshot['comments'];
}

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

    return {
      version: SNAPSHOT_VERSION,
      templateId: this._generateTemplateId(),
      createdAt: now,
      updatedAt: now,
      metadata,
      documents,
      recipients: state.recipients,
      assignments: state.assignments,
      signatureConfig: state.signatureConfig,
      providerConfig: state.providerConfig,
      comments: state.comments,
    };
  }

  /** Restaura el estado del designer desde un snapshot */
  deserialize(snapshot: OfficialTemplateSnapshot): DesignerState {
    return {
      documents: snapshot.documents,
      recipients: snapshot.recipients,
      assignments: snapshot.assignments,
      signatureConfig: snapshot.signatureConfig,
      providerConfig: snapshot.providerConfig,
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
      templateId: typeof legacy.templateId === 'string' ? legacy.templateId : this._generateId(),
      createdAt: now,
      updatedAt: now,
      metadata: {
        name: typeof legacy.name === 'string' ? legacy.name : 'Template migrado',
        createdByUserId: 'migration',
        description: 'Migrado automáticamente desde formato pdfme v1',
      },
      documents,
      recipients: legacyRecipients,
      assignments: this._extractLegacyAssignments(legacySchemas),
      signatureConfig: {
        defaultMode: 'draw',
        allowedModes: ['draw', 'image', 'p12'],
      },
      providerConfig: {
        defaultProvider: 'draw',
        allowedProviders: ['draw', 'image', 'p12'],
      },
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
