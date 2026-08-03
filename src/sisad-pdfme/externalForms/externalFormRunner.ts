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
import type { OfficialTemplateSnapshot, SnapshotAssignment, SchemaWithDesigner } from '../shared/snapshot.js';
import { asRecord } from '../shared/objectGuards.js';

// ── Estado del flujo ────────────────────────────────────────────────────────

interface FlowState {
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

// ── Visibilidad de schemas ──────────────────────────────────────────────────

export type SchemaVisibility = 'editable' | 'readonly' | 'hidden';

export type ExternalFormSchemaState = {
  documentId: string;
  pageNumber: number;
  schemaUid: string;
  visibility: SchemaVisibility;
  hasValue: boolean;
  assignment?: SnapshotAssignment;
  isSignatureSchema: boolean;
};

type ExternalFormPageState = {
  documentId: string;
  pageNumber: number;
  editableSchemaUids: string[];
  readonlySchemaUids: string[];
  hiddenSchemaUids: string[];
  visibleSchemaUids: string[];
  hasEditableFields: boolean;
  canRenderForm: boolean;
};

type ExternalFormDocumentState = {
  documentId: string;
  name: string;
  order: number;
  pageCount: number;
  pageNumbers: number[];
  visibleSchemaUids: string[];
  editableSchemaUids: string[];
  readonlySchemaUids: string[];
  hiddenSchemaUids: string[];
  canRenderForm: boolean;
};

export type ExternalFormRuntimeState = {
  snapshotVersion: string;
  templateSchemaVersion: string | null;
  currentRecipientId: string;
  mode: 'form' | 'viewer';
  documents: ExternalFormDocumentState[];
  pages: ExternalFormPageState[];
  editableSchemaUids: string[];
  readonlySchemaUids: string[];
  hiddenSchemaUids: string[];
  schemaStates: ExternalFormSchemaState[];
  savedInputs: Record<string, unknown>;
  canComplete: boolean;
};

export type ExternalFormRuntimeStateOptions = {
  snapshot: OfficialTemplateSnapshot;
  currentRecipientId: string;
  flowState: FlowState;
  storage: ExternalFormStorage;
  isSignatureSchema?: (schema: SchemaWithDesigner) => boolean;
};

export type ExternalFormRunnerProps = ExternalFormRuntimeStateOptions;

const normalizeExternalFormText = (value: unknown): string => String(value ?? '').trim();

const extractSchemaUid = (schema: SchemaWithDesigner): string => {
  const record = asRecord(schema);
  const designer = asRecord(record.__designer);
  const identity = asRecord(designer.identity);
  return (
    normalizeExternalFormText(identity.schemaUid) ||
    normalizeExternalFormText(designer.schemaUid) ||
    normalizeExternalFormText(record.schemaUid) ||
    normalizeExternalFormText(record.id) ||
    normalizeExternalFormText(record.name)
  );
};

const extractAssignment = (snapshot: OfficialTemplateSnapshot, schemaUid: string): SnapshotAssignment | undefined =>
  snapshot.assignments.find((assignment) => normalizeExternalFormText(assignment.schemaUid) === normalizeExternalFormText(schemaUid));

const extractSignatureSchema = (schema: SchemaWithDesigner): boolean => {
  const record = asRecord(schema);
  const type = normalizeExternalFormText(record.type);
  if (type === 'signature') return true;

  const designer = asRecord(record.__designer);
  const runtimeSignature = asRecord(designer.signature);
  return (
    Boolean(normalizeExternalFormText(runtimeSignature.mode)) ||
    Boolean(normalizeExternalFormText(runtimeSignature.providerKey)) ||
    Boolean(normalizeExternalFormText(runtimeSignature.defaultProvider))
  );
};

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
 * Recorre el snapshot y resuelve el estado runtime de cada schema.
 *
 * externalForms usa este helper para decidir qué delegar al Form y qué
 * degradar a Viewer, sin duplicar reglas de assignments/ownership.
 */
export function resolveExternalFormRuntimeState(
  options: ExternalFormRuntimeStateOptions,
): ExternalFormRuntimeState {
  const isSignatureSchema = options.isSignatureSchema ?? extractSignatureSchema;
  const schemaStates: ExternalFormSchemaState[] = [];

  for (const document of options.snapshot.documents || []) {
    for (const page of document.pages || []) {
      for (const schema of page.schemas || []) {
        const schemaUid = extractSchemaUid(schema);
        if (!schemaUid) continue;

        const assignment = extractAssignment(options.snapshot, schemaUid);
        const record = asRecord(schema);
        const designer = asRecord(record.__designer);
        const ownership = asRecord(designer.ownership);
        const hasValue = options.storage.hasInput(schemaUid);
        const visibility = getSchemaVisibility(
          assignment,
          schemaUid,
          Boolean(record.readOnly || record.readonly || ownership.readonly),
          options.currentRecipientId,
          options.flowState,
          hasValue,
          isSignatureSchema(schema),
        );

        schemaStates.push({
          documentId: normalizeExternalFormText(document.documentId),
          pageNumber: Number(page.pageNumber) || 0,
          schemaUid,
          visibility,
          hasValue,
          assignment,
          isSignatureSchema: isSignatureSchema(schema),
        });
      }
    }
  }

  const editableSchemaUids = schemaStates.filter((entry) => entry.visibility === 'editable').map((entry) => entry.schemaUid);
  const readonlySchemaUids = schemaStates.filter((entry) => entry.visibility === 'readonly').map((entry) => entry.schemaUid);
  const hiddenSchemaUids = schemaStates.filter((entry) => entry.visibility === 'hidden').map((entry) => entry.schemaUid);
  const pagesByKey = new Map<string, ExternalFormPageState>();
  const documentsById = new Map<string, ExternalFormDocumentState>();

  for (const document of options.snapshot.documents || []) {
    const documentId = normalizeExternalFormText(document.documentId);
    const documentName = normalizeExternalFormText(document.name) || documentId || 'Documento';
    const pageNumbers = Array.from(new Set((document.pages || []).map((page) => Number(page.pageNumber) || 0).filter((pageNumber) => pageNumber > 0)));

    documentsById.set(documentId, {
      documentId,
      name: documentName,
      order: Number(document.order) || 0,
      pageCount: pageNumbers.length,
      pageNumbers,
      visibleSchemaUids: [],
      editableSchemaUids: [],
      readonlySchemaUids: [],
      hiddenSchemaUids: [],
      canRenderForm: false,
    });
  }

  for (const state of schemaStates) {
    const key = `${state.documentId}:${state.pageNumber}`;
    const pageState = pagesByKey.get(key) ?? {
      documentId: state.documentId,
      pageNumber: state.pageNumber,
      editableSchemaUids: [],
      readonlySchemaUids: [],
      hiddenSchemaUids: [],
      visibleSchemaUids: [],
      hasEditableFields: false,
      canRenderForm: false,
    };

    pageState.visibleSchemaUids.push(state.schemaUid);
    if (state.visibility === 'editable') {
      pageState.editableSchemaUids.push(state.schemaUid);
      pageState.hasEditableFields = true;
      pageState.canRenderForm = true;
    } else if (state.visibility === 'readonly') {
      pageState.readonlySchemaUids.push(state.schemaUid);
    } else {
      pageState.hiddenSchemaUids.push(state.schemaUid);
    }

    pagesByKey.set(key, pageState);

    const documentState = documentsById.get(state.documentId);
    if (documentState) {
      documentState.visibleSchemaUids.push(state.schemaUid);
      if (state.visibility === 'editable') {
        documentState.editableSchemaUids.push(state.schemaUid);
        documentState.canRenderForm = true;
      } else if (state.visibility === 'readonly') {
        documentState.readonlySchemaUids.push(state.schemaUid);
      } else {
        documentState.hiddenSchemaUids.push(state.schemaUid);
      }
    }
  }

  return {
    snapshotVersion: normalizeExternalFormText(options.snapshot.version),
    templateSchemaVersion: normalizeExternalFormText(options.snapshot.templateSchemaVersion) || null,
    currentRecipientId: normalizeExternalFormText(options.currentRecipientId),
    mode: editableSchemaUids.length > 0 ? 'form' : 'viewer',
    documents: Array.from(documentsById.values()).sort((a, b) => a.order - b.order),
    pages: Array.from(pagesByKey.values()).sort((a, b) =>
      a.documentId === b.documentId
        ? a.pageNumber - b.pageNumber
        : a.documentId.localeCompare(b.documentId),
    ),
    editableSchemaUids,
    readonlySchemaUids,
    hiddenSchemaUids,
    schemaStates,
    savedInputs: options.storage.getInputs(options.currentRecipientId),
    canComplete: editableSchemaUids.length === 0 || areAllRequiredFieldsComplete(editableSchemaUids, options.storage),
  };
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
