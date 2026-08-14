import type { SchemaValueScope } from './schemaAccess.js';

export type RuntimeScope = {
  runtimeSessionId: string;
  userId: string;
  documentId: string;
};

export type ScopeConflict = {
  schemaUid: string;
  executions: string[];
  revisions: number[];
  values: unknown[];
};

type Entry = { value: unknown; revision: number; executionId: string };

const scopeKey = (scope: RuntimeScope, valueScope: SchemaValueScope, schemaUid: string) =>
  JSON.stringify([
    scope.runtimeSessionId,
    valueScope === 'shared' ? '*' : scope.userId,
    scope.documentId,
    schemaUid,
  ]);

/** Instance-owned mutable state; no module singleton or cross-Form registry. */
export class ExecutionScopeStore {
  private readonly entries = new Map<string, Entry>();

  get(scope: RuntimeScope, schemaUid: string, valueScope: SchemaValueScope = 'per-user'): Entry | undefined {
    const entry = this.entries.get(scopeKey(scope, valueScope, schemaUid));
    return entry ? { ...entry } : undefined;
  }

  commit(input: {
    scope: RuntimeScope;
    schemaUid: string;
    value: unknown;
    revision: number;
    executionId: string;
    valueScope?: SchemaValueScope;
  }): { accepted: true; revision: number } | { accepted: false; conflict: ScopeConflict } {
    const valueScope = input.valueScope ?? 'per-user';
    const key = scopeKey(input.scope, valueScope, input.schemaUid);
    const previous = this.entries.get(key);
    if (previous && input.revision <= previous.revision) {
      return {
        accepted: false,
        conflict: {
          schemaUid: input.schemaUid,
          executions: [previous.executionId, input.executionId],
          revisions: [previous.revision, input.revision],
          values: [previous.value, input.value],
        },
      };
    }
    this.entries.set(key, { value: input.value, revision: input.revision, executionId: input.executionId });
    return { accepted: true, revision: input.revision };
  }
}

export const createExecutionScopeStore = (): ExecutionScopeStore => new ExecutionScopeStore();
