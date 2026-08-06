/**
 * recipientTypes — contratos canónicos de recipients para `sisad-pdfme`.
 *
 * Rol arquitectónico:
 * - Fuente única del modelo genérico `SisadPdfmeRecipient`. El host puede tener
 *   usuarios/firmantes/aprobadores con su propio modelo; el core solo conoce
 *   este contrato (los adapters convierten en la frontera).
 * - `config/SisadPdfmeConfig.ts` re-exporta estos tipos para la fachada pública;
 *   este módulo NO debe importar desde `config` (evita ciclos).
 */

/** Recipient genérico registrado en el core. */
export type SisadPdfmeRecipient = {
  id: string;
  label: string;
  name?: string;
  role?: string;
  email?: string;
  color?: string;
  order?: number;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
};

/** Configuración global de la capa de recipients. */
export type SisadPdfmeRecipientsConfig = {
  enabled?: boolean;
  activeRecipientId?: string | null;
  allowUnassigned?: boolean;
  allowShared?: boolean;
  allowMultipleOwners?: boolean;
  defaultOwnerStrategy?: 'none' | 'activerecipient' | 'firstrecipient';
  colorStrategy?: 'recipient' | 'schema' | 'theme' | 'auto';
  missingRecipientBehavior?: 'keep-id' | 'fallback-active' | 'mark-unassigned';
};

/** Estado observable del registry (inmutable por emisión). */
export type SisadPdfmeRecipientRegistryState = {
  recipients: SisadPdfmeRecipient[];
  byId: Map<string, SisadPdfmeRecipient>;
  activeRecipientId: string | null;
  activeRecipient: SisadPdfmeRecipient | null;
  colorById: Map<string, string>;
  labelById: Map<string, string>;
};

/** Eventos emitidos por el registry. */
export type SisadPdfmeRecipientRegistryEvents = {
  onRecipientsChange?: (recipients: SisadPdfmeRecipient[]) => void;
  onActiveRecipientChange?: (recipient: SisadPdfmeRecipient | null) => void;
};

/** Payload del evento de reasignación de schemas. */
export type SisadPdfmeAssignmentChangePayload = {
  schemaIds: string[];
  previousRecipientId: string | null;
  nextRecipientId: string | null;
};

/** Apariencia de owner resuelta para un schema (Canvas/ListView/DetailView). */
export type SchemaOwnerAppearance = {
  ownerRecipientId: string | null;
  ownerLabel: string;
  ownerColor: string;
  isOwnedByActiveRecipient: boolean;
  isShared: boolean;
  isUnassigned: boolean;
};

/** Vista mínima de un schema con metadata de ownership. */
export type OwnerAwareSchemaLike = {
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[] | string | null;
  ownerRecipientName?: string | null;
  ownerMode?: string | null;
  ownerColor?: string | null;
  recipientId?: string | null;
  recipientColor?: string | null;
  userColor?: string | null;
  createdBy?: string | null;
  lastModifiedBy?: string | null;
  [key: string]: unknown;
};

/** API pública del registry. */
export type SisadPdfmeRecipientRegistry = {
  getState(): SisadPdfmeRecipientRegistryState;
  getRecipients(): SisadPdfmeRecipient[];
  getRecipient(recipientId: string | null | undefined): SisadPdfmeRecipient | null;
  getAssignableRecipients(): SisadPdfmeRecipient[];
  getActiveRecipient(): SisadPdfmeRecipient | null;
  getActiveRecipientId(): string | null;
  getActiveRecipientColor(): string | null;
  getRecipientColor(recipientId: string | null | undefined): string | null;
  getRecipientLabel(recipientId: string | null | undefined): string | null;
  setRecipients(recipients: SisadPdfmeRecipient[]): void;
  setActiveRecipient(recipientId: string | null): void;
  subscribe(listener: (state: SisadPdfmeRecipientRegistryState) => void): () => void;
  toSnapshot(): SisadPdfmeRecipientsSnapshot;
  restoreSnapshot(snapshot: unknown): void;
};

/** Sección de recipients dentro de un snapshot serializable. */
export type SisadPdfmeRecipientsSnapshot = {
  recipients: Array<{
    id: string;
    name: string;
    color: string;
    role?: string;
    order?: number;
  }>;
  activeRecipientId: string | null;
  recipientColorMap: Record<string, string>;
  recipientNameMap: Record<string, string>;
};
