/**
 * FASE 7 — Snapshot oficial
 *
 * Estructura única de snapshot usada por guardar, descargar, importar,
 * externalForms y migración versionada. Una sola fuente de verdad.
 *
 * Versión: "2.0.0" para este formato.
 * Formato anterior al actual: snapshots pdfme ~4.x sin campo version, o version < "2.0.0".
 *
 * Regla de reconciliación de color:
 *   SnapshotRecipient.color tiene prioridad sobre __designer.recipientColor.
 *   Si divergen al cargar, SnapshotRecipient.color gana (fue editado después).
 */
import type { SchemaDesignerMeta } from '@sisad-pdfme/shared/schemaDesignerMeta';
import { asRecord } from '@sisad-pdfme/shared/objectGuards';

/** Versión actual del formato snapshot */
export const SNAPSHOT_VERSION = '2.0.0';

/** Schema con __designer incluido (extiende el Schema base del proyecto) */
export interface SchemaWithDesigner {
  // Todos los campos base de Schema pdfme
  [key: string]: unknown;
  /** Metadata de identidad del designer — siempre presente en el snapshot actual. */
  __designer: SchemaDesignerMeta;
}

/** Background de página — discriminated union para URL vs base64 vs vacío */
export type PageBackground =
  | { type: 'url'; url: string; checksum?: string }
  | { type: 'base64'; data: string; mimeType: string }
  | { type: 'none' };

export interface SnapshotPage {
  /** 1-indexed */
  pageNumber: number;
  /** Schemas con __designer completo */
  schemas: SchemaWithDesigner[];
  background: PageBackground;
}

export interface SnapshotDocument {
  documentId: string;
  name: string;
  /** Para multi-documento: orden de presentación */
  order: number;
  pages: SnapshotPage[];
}

export interface SnapshotRecipient {
  id: string;
  name: string;
  /** Fuente de verdad del color — reconcilia sobre __designer.recipientColor al cargar */
  color: string;
  role?: string;
  /** Orden en el flujo de firma */
  order?: number;
}

export interface SnapshotAssignment {
  schemaUid: string;
  recipientId: string;
  scope: 'recipient' | 'group' | 'global';
  readonly?: boolean;
}

export interface SnapshotConnectivity {
  byFile?: Record<string, SnapshotFileConnectivity>;
  bySchema?: Record<string, Record<string, SnapshotSchemaConnectivity>>;
  byRecipient?: Record<string, unknown>;
  sourceMapping?: Record<string, unknown>;
}

export interface SnapshotFileConnectivity {
  cabinetId?: string | null;
  folderId?: string | null;
  subfolderId?: string | null;
  fileTypeId?: string | null;
  [key: string]: unknown;
}

export interface SnapshotSchemaConnectivity {
  indexId?: string | null;
  indexName?: string | null;
  schemaName?: string | null;
  schemaType?: string | null;
  [key: string]: unknown;
}

export interface SnapshotContributor {
  id: string;
  name?: string;
  role?: string;
  email?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface SignatureConfig {
  defaultMode: 'draw' | 'image' | 'p12' | 'provider';
  /** Lista de providerKeys permitidos */
  allowedModes: string[];
  /** Sobrescribe la config global por recipientId */
  recipientOverrides?: Record<string, Partial<SignatureConfig>>;
}

export interface ProviderConfig {
  defaultProvider: string;
  allowedProviders: string[];
  /**
   * Opaco — el host lo interpreta.
   * No contiene credenciales — solo configuración de tenant.
   */
  tenantConfig?: Record<string, unknown>;
}

export interface SnapshotComment {
  commentId: string;
  schemaUid: string;
  authorUserId: string;
  authorName: string;
  text: string;
  createdAt: string;
  resolved?: boolean;
}

export interface SnapshotMetadata {
  name: string;
  description?: string;
  createdByUserId: string;
  organizationId?: string;
  tags?: string[];
}

/** Snapshot oficial — única estructura de intercambio */
export interface OfficialTemplateSnapshot {
  /** Semver del formato: "2.0.0" */
  version: string;
  /** Versión estructural del template si el host la controla aparte del snapshot. */
  templateSchemaVersion?: string;
  /** UUID inmutable del template desde su creación */
  templateId: string;
  createdAt: string;
  updatedAt: string;
  metadata: SnapshotMetadata;
  /** Documento activo al serializar. */
  activeDocumentId?: string | null;
  documents: SnapshotDocument[];
  /** Copia explícita de documentos subidos si el host la mantiene separada. */
  uploadedDocuments?: SnapshotDocument[];
  recipients: SnapshotRecipient[];
  assignments: SnapshotAssignment[];
  connectivity?: SnapshotConnectivity;
  inputs?: Array<Record<string, unknown>>;
  contributors?: SnapshotContributor[];
  history?: Array<Record<string, unknown>>;
  signatureConfig: SignatureConfig;
  signaturePolicyId?: string | null;
  signatureMode?: string | null;
  signatureProviderKey?: string | null;
  providerConfig: ProviderConfig;
  delivery?: Record<string, unknown>;
  message?: Record<string, unknown>;
  security?: Record<string, unknown>;
  /** Comentarios — referencia de solo lectura, los locks NO se incluyen */
  comments?: SnapshotComment[];
}

/** Opciones de serialización */
export interface SerializeOptions {
  /**
   * Modo de background:
   *   - 'url': ligero, para guardado normal (requiere servidor)
   *   - 'base64': portátil, para exportación offline
   */
  backgroundMode: 'url' | 'base64';
}

/** Helper: detecta si un objeto crudo es un snapshot pre- (pdfme ~4.x) */
export function isPreSnapshot(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const obj = asRecord(raw);
  if (!obj) return false;
  // Sin campo version → pre- pdfme 4.x
  if (!obj.version) return true;
  // version < "2.0.0" → pre-
  if (typeof obj.version === 'string') {
    return compareVersions(obj.version, SNAPSHOT_VERSION) < 0;
  }
  return false;
}

/** Comparación semver simplificada (major.minor.patch). Ignora sufijos pre-release (e.g. "-beta"). */
function compareVersions(a: string, b: string): number {
  const strip = (v: string) => (v.split('-')[0] ?? v);
  const partsA = strip(a).split('.').map(Number);
  const partsB = strip(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Helpers para construir snapshots en tests */
export function makeEmptySnapshot(overrides?: Partial<OfficialTemplateSnapshot>): OfficialTemplateSnapshot {
  const now = new Date().toISOString();
  return {
    version: SNAPSHOT_VERSION,
    templateId: 'test-template-id',
    createdAt: now,
    updatedAt: now,
    metadata: {
      name: 'Test Template',
      createdByUserId: 'test-user',
    },
    documents: [],
    recipients: [],
    assignments: [],
    signatureConfig: {
      defaultMode: 'draw',
      allowedModes: ['draw'],
    },
    providerConfig: {
      defaultProvider: 'draw',
      allowedProviders: ['draw'],
    },
    ...overrides,
  };
}
