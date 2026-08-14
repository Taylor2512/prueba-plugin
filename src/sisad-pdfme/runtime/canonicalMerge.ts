export type CanonicalSchemaDelta = {
  schemaUid: string;
  value: unknown;
  revision: number;
  executionId: string;
};

export type CanonicalMergeConflict = {
  schemaUid: string;
  executions: string[];
  revisions: number[];
  values: unknown[];
};

export type CanonicalMergeResult = {
  values: Record<string, unknown>;
  conflicts: CanonicalMergeConflict[];
  acceptedDeltas: CanonicalSchemaDelta[];
};

const sameValue = (left: unknown, right: unknown): boolean => JSON.stringify(left) === JSON.stringify(right);

export const mergeCanonicalDeltas = (deltas: CanonicalSchemaDelta[]): CanonicalMergeResult => {
  const bySchema = new Map<string, CanonicalSchemaDelta[]>();
  deltas.forEach((delta) => bySchema.set(delta.schemaUid, [...(bySchema.get(delta.schemaUid) ?? []), delta]));
  const values: Record<string, unknown> = {};
  const conflicts: CanonicalMergeConflict[] = [];
  const acceptedDeltas: CanonicalSchemaDelta[] = [];
  bySchema.forEach((entries, schemaUid) => {
    const ordered = [...entries].sort((left, right) => right.revision - left.revision);
    const winner = ordered[0];
    values[schemaUid] = winner.value;
    acceptedDeltas.push(winner);
    const divergent = ordered.filter((entry) => !sameValue(entry.value, winner.value));
    if (divergent.length) {
      conflicts.push({
        schemaUid,
        executions: ordered.map((entry) => entry.executionId),
        revisions: ordered.map((entry) => entry.revision),
        values: ordered.map((entry) => entry.value),
      });
    }
  });
  return { values, conflicts, acceptedDeltas };
};
