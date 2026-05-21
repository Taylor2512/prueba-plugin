/**
 * FASE 7 — Snapshot oficial
 *
 * Estructura única de snapshot usada por guardar, descargar, importar,
 * externalForms y migración legacy. Una sola fuente de verdad.
 *
 * Versión: "2.0.0" para este formato.
 * Legacy: snapshots pdfme ~4.x sin campo version, o version < "2.0.0".
 *
 * Regla de reconciliación de color:
 *   SnapshotRecipient.color tiene prioridad sobre __designer.recipientColor.
 *   Si divergen al cargar, SnapshotRecipient.color gana (fue editado después).
 */
import type { SchemaDesignerMeta } from './schemaDesignerMeta.js';

/** Versión actual del formato snapshot */
export const SNAPSHOT_VERSION = '2.0.0';

/** Schema con __designer incluido (extiende el Schema base del proyecto) */
export interface SchemaWithDesigner {
  // Todos los campos base de Schema pdfme
  [key: string]: unknown;
  /** Metadata de identidad del designer — siempre presente en snapshots v2 */
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
   * Opaco — ContentCustomForm lo interpreta.
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
  /** UUID inmutable del template desde su creación */
  templateId: string;
  createdAt: string;
  updatedAt: string;
  metadata: SnapshotMetadata;
  documents: SnapshotDocument[];
  recipients: SnapshotRecipient[];
  assignments: SnapshotAssignment[];
  signatureConfig: SignatureConfig;
  providerConfig: ProviderConfig;
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

/** Helper: detecta si un objeto crudo es un snapshot legacy (pdfme ~4.x) */
export function isLegacySnapshot(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const obj = raw as Record<string, unknown>;
  // Sin campo version → legacy pdfme 4.x
  if (!obj.version) return true;
  // version < "2.0.0" → legacy
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
