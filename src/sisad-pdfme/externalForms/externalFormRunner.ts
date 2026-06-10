/**
 * FASE 9 — ExternalForms como runner
 *
 * Contratos del runner de formularios externos.
 * externalForms NO implementa renderer propio — usa Form/Viewer de sisad-pdfme.
 * externalForms NO gestiona el orden de destinatarios — recibe flowState del padre.
 * La persistencia de inputs es responsabilidad del padre (inyectada como storage).
 *
 * Tres estados de visibilidad por schema:
 *   editable  → Form de sisad-pdfme
 *   readonly  → Viewer de sisad-pdfme
 *   hidden    → no renderizado
 */
import type { OfficialTemplateSnapshot, SnapshotAssignment } from '../shared/snapshot.js';
import type { SignaturePolicy } from '../shared/signatureRegistry.js';

// ── Estado del flujo ────────────────────────────────────────────────────────

export interface FlowState {
  /** IDs de destinatarios que ya completaron su turno */
  completedRecipients: string[];
  currentStep: number;
  totalSteps: number;
}

// ── Persistencia de inputs ──────────────────────────────────────────────────

/**
 * Contrato de almacenamiento de inputs.
 * La implementación concreta la provee el padre:
 *   - sessionStorage para progreso temporal
 *   - Backend REST para progreso persistido
 *
 * La clave de almacenamiento debe ser namespace por recipientId
 * para evitar colisiones entre destinatarios.
 */
export interface ExternalFormStorage {
  /** Guarda el valor de un campo por su schemaUid */
  saveInput(schemaUid: string, value: unknown): void;
  /** Obtiene todos los inputs guardados para un destinatario */
  getInputs(recipientId: string): Record<string, unknown>;
  /** Verifica si un campo ya tiene valor guardado */
  hasInput(schemaUid: string): boolean;
  /** Limpia inputs — si recipientId es undefined, limpia todos */
  clearInputs(recipientId?: string): void;
}

// ── Props del componente runner ─────────────────────────────────────────────

export interface ExternalFormRunnerProps {
  snapshot: OfficialTemplateSnapshot;
  currentRecipientId: string;
  flowState: FlowState;
  storage: ExternalFormStorage;
  signaturePolicy: SignaturePolicy;
  onComplete: (pdfBlob: Blob) => void;
  onSaveProgress: (inputs: Record<string, unknown>) => void;
  /** Llamado cuando snapshot.version cambia mientras el runner está activo */
  onSnapshotVersionMismatch?: () => void;
}

// ── Visibilidad de schemas ──────────────────────────────────────────────────

export type SchemaVisibility = 'editable' | 'readonly' | 'hidden';

/**
 * Determina la visibilidad de un schema para el destinatario actual.
 *
 * Reglas en orden de prioridad:
 * 1. ownership.readonly === true → siempre readonly
 * 2. Schema de firma con valor ya guardado → readonly
 * 3. scope === 'global' → visible; editable si es su turno
 * 4. scope === 'recipient' && recipientId coincide → editable si su turno
 * 5. scope === 'recipient' && recipientId no coincide → hidden
 * 6. scope === 'group' → requiere resolución externa (asume editable)
 */
export function getSchemaVisibility(
  schemaAssignment: SnapshotAssignment | undefined,
  schemaUid: string,
  isReadonly: boolean | undefined,
  currentRecipientId: string,
  flowState: FlowState,
  hasValue: boolean,
  isSignatureSchema: boolean,
): SchemaVisibility {
  // Regla 1: readonly explícito siempre gana
  if (isReadonly) return 'readonly';

  // Regla 2: firma ya completada → readonly
  if (isSignatureSchema && hasValue) return 'readonly';

  const isMyTurn = !flowState.completedRecipients.includes(currentRecipientId);
  const scope = schemaAssignment?.scope ?? 'global';

  if (scope === 'global') {
    // Global: visible para todos, editable solo si es su turno
    return isMyTurn ? 'editable' : 'readonly';
  }

  if (scope === 'recipient') {
    const belongs = schemaAssignment?.recipientId === currentRecipientId;
    if (!belongs) return 'hidden';
    return isMyTurn ? 'editable' : 'readonly';
  }

  if (scope === 'group') {
    // La resolución de grupo es responsabilidad del padre
    // El currentRecipientId ya fue validado contra el grupo externamente
    return isMyTurn ? 'editable' : 'readonly';
  }

  return 'hidden';
}

/**
 * Determina si todos los campos requeridos están completos para habilitar "Firmar/Completar".
 *
 * Un campo es requerido si su visibilidad es 'editable'.
 * Un campo está completo si storage.hasInput(schemaUid) === true.
 */
export function areAllRequiredFieldsComplete(
  editableSchemaUids: string[],
  storage: ExternalFormStorage,
): boolean {
  return editableSchemaUids.every((uid) => storage.hasInput(uid));
}

// ── Implementación de storage en memoria (para tests y dev) ──────────────────

export class InMemoryExternalFormStorage implements ExternalFormStorage {
  private store = new Map<string, unknown>();
  private recipientIndex = new Map<string, Set<string>>();

  saveInput(schemaUid: string, value: unknown): void {
    this.store.set(schemaUid, value);
  }

  getInputs(recipientId: string): Record<string, unknown> {
    const uids = this.recipientIndex.get(recipientId) ?? new Set();
    const result: Record<string, unknown> = {};
    for (const uid of uids) {
      if (this.store.has(uid)) {
        result[uid] = this.store.get(uid);
      }
    }
    return result;
  }

  hasInput(schemaUid: string): boolean {
    return this.store.has(schemaUid) && this.store.get(schemaUid) !== undefined;
  }

  clearInputs(recipientId?: string): void {
    if (!recipientId) {
      this.store.clear();
      this.recipientIndex.clear();
      return;
    }
    const uids = this.recipientIndex.get(recipientId) ?? new Set();
    for (const uid of uids) {
      this.store.delete(uid);
    }
    this.recipientIndex.delete(recipientId);
  }

  /** Asocia un schemaUid al recipientId que lo llena (para getInputs por recipient) */
  registerSchemaForRecipient(schemaUid: string, recipientId: string): void {
    if (!this.recipientIndex.has(recipientId)) {
      this.recipientIndex.set(recipientId, new Set());
    }
    this.recipientIndex.get(recipientId)!.add(schemaUid);
  }
}
