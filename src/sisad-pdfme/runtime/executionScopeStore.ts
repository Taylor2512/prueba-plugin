/**
 * Estado mutable de ejecución, aislado por scope lógico.
 *
 * ## Concurrencia optimista (RTP-485)
 *
 * La versión anterior aceptaba cualquier commit cuya `revision` fuese mayor
 * que la almacenada. Eso permite a un cliente **inventar** una revisión alta y
 * saltarse la detección de conflicto: `revision: 999` ganaba siempre.
 *
 * Ahora es un compare-and-swap real:
 *
 * - el cliente declara `expectedRevision`, que es la que **cree** tener;
 * - el commit sólo se acepta si coincide exactamente con la almacenada;
 * - la revisión siguiente **la asigna el store**, nunca el cliente.
 *
 * Con eso, dos escritores sobre el mismo valor no pueden ganar los dos: el
 * segundo ve un conflicto aunque declare una revisión enorme.
 *
 * ## Scope
 *
 * La clave es `runtimeSessionId × user × documentId × schemaUid`. Un valor
 * `shared` sustituye el usuario por un marcador de scope compartido explícito,
 * de modo que todos los usuarios de la sesión escriben en la misma celda.
 */
import type { SchemaValueScope } from '@sisad-pdfme/runtime/schemaAccess';

export type RuntimeScope = {
  runtimeSessionId: string;
  userId: string;
  documentId: string;
};

export type ScopeConflict = {
  schemaUid: string;
  /** Ejecución que escribió el valor almacenado y la que intentó escribir. */
  executions: string[];
  /** `[revisiónAlmacenada, revisiónEsperadaPorElCliente]`. */
  revisions: number[];
  values: unknown[];
  reason: 'stale-revision';
};

export type ScopeEntry = {
  value: unknown;
  revision: number;
  executionId: string;
};

export type ScopeCommitResult =
  | { accepted: true; revision: number; entry: ScopeEntry }
  | { accepted: false; conflict: ScopeConflict };

/** Marcador del scope lógico compartido. No es un id de usuario válido. */
export const SHARED_SCOPE_USER = '__shared__';

const scopeKey = (scope: RuntimeScope, valueScope: SchemaValueScope, schemaUid: string) =>
  JSON.stringify([
    scope.runtimeSessionId,
    valueScope === 'shared' ? SHARED_SCOPE_USER : scope.userId,
    scope.documentId,
    schemaUid,
  ]);

export type ScopeCommitInput = {
  scope: RuntimeScope;
  schemaUid: string;
  value: unknown;
  /**
   * Revisión que el cliente cree tener. `0` significa «no existe todavía».
   * Debe coincidir con la almacenada o el commit se rechaza.
   */
  expectedRevision: number;
  executionId: string;
  valueScope?: SchemaValueScope;
};

/** Estado mutable propiedad de la instancia; sin singleton ni registro global. */
export class ExecutionScopeStore {
  private readonly entries = new Map<string, ScopeEntry>();

  get(scope: RuntimeScope, schemaUid: string, valueScope: SchemaValueScope = 'per-user'): ScopeEntry | undefined {
    const entry = this.entries.get(scopeKey(scope, valueScope, schemaUid));
    return entry ? { ...entry } : undefined;
  }

  /** Revisión almacenada, o `0` si la celda no existe. */
  revisionOf(scope: RuntimeScope, schemaUid: string, valueScope: SchemaValueScope = 'per-user'): number {
    return this.entries.get(scopeKey(scope, valueScope, schemaUid))?.revision ?? 0;
  }

  commit(input: ScopeCommitInput): ScopeCommitResult {
    const valueScope = input.valueScope ?? 'per-user';
    const key = scopeKey(input.scope, valueScope, input.schemaUid);
    const previous = this.entries.get(key);
    const storedRevision = previous?.revision ?? 0;

    if (input.expectedRevision !== storedRevision) {
      return {
        accepted: false,
        conflict: {
          schemaUid: input.schemaUid,
          executions: [previous?.executionId ?? '', input.executionId],
          revisions: [storedRevision, input.expectedRevision],
          values: [previous?.value, input.value],
          reason: 'stale-revision',
        },
      };
    }

    // La revisión la asigna el store. El cliente no puede elegirla.
    const entry: ScopeEntry = {
      value: input.value,
      revision: storedRevision + 1,
      executionId: input.executionId,
    };
    this.entries.set(key, entry);
    return { accepted: true, revision: entry.revision, entry: { ...entry } };
  }

  /** Elimina el estado de un documento dentro de una sesión. */
  clearDocument(runtimeSessionId: string, documentId: string): number {
    return this.removeWhere((parts) => parts[0] === runtimeSessionId && parts[2] === documentId);
  }

  /** Elimina el estado de una sesión completa. */
  clearSession(runtimeSessionId: string): number {
    return this.removeWhere((parts) => parts[0] === runtimeSessionId);
  }

  /** Elimina el estado de un usuario dentro de una sesión. No toca lo compartido. */
  clearUser(runtimeSessionId: string, userId: string): number {
    return this.removeWhere((parts) => parts[0] === runtimeSessionId && parts[1] === userId);
  }

  /** Elimina todo el estado de esta instancia. */
  clearAll(): number {
    const size = this.entries.size;
    this.entries.clear();
    return size;
  }

  private removeWhere(predicate: (parts: string[]) => boolean): number {
    let removed = 0;
    Array.from(this.entries.keys()).forEach((key) => {
      if (predicate(JSON.parse(key) as string[])) {
        this.entries.delete(key);
        removed += 1;
      }
    });
    return removed;
  }
}

export const createExecutionScopeStore = (): ExecutionScopeStore => new ExecutionScopeStore();
