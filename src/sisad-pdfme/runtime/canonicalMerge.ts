/**
 * Merge canónico de deltas de varias ejecuciones sobre un mismo documento.
 *
 * ## Dos correcciones respecto a la versión anterior (RTP-495)
 *
 * 1. **La igualdad era `JSON.stringify`.** Eso hace divergir valores que son
 *    el mismo dato: `['a','b']` frente a `['b','a']` en una selección múltiple,
 *    `1.50` frente a `1.5` en un número, o la misma fecha en dos formatos. Se
 *    reportaban conflictos inexistentes. Ahora la igualdad la decide el
 *    `SchemaValueCodec` de la familia del schema.
 *
 * 2. **Un conflicto devolvía además un ganador publicable.** `values[uid]`
 *    contenía el valor de mayor revisión aunque hubiera divergencia, así que
 *    un consumidor descuidado publicaba un PDF con un valor en disputa. El
 *    contrato es explícito: un conflicto canónico NO puede devolver a la vez
 *    un ganador publicable. `values` contiene ahora sólo los schemas sin
 *    conflicto, y `publishable` dice si el resultado puede ir al generador.
 */
import { getSchemaValueCodec } from '../schemas/values/schemaValueCodec.js';
import type { SchemaCodecId } from '../schemas/schemaRuntimeMetadata.js';

export type CanonicalSchemaDelta = {
  schemaUid: string;
  value: unknown;
  revision: number;
  executionId: string;
  /** Codec del schema. Por defecto `opaque`, que compara por contenido. */
  codec?: SchemaCodecId;
};

export type CanonicalMergeConflict = {
  schemaUid: string;
  executions: string[];
  revisions: number[];
  values: unknown[];
  reason: 'divergent-values';
};

export type CanonicalMergeResult = {
  /** Sólo schemas SIN conflicto. Un schema en disputa no aparece aquí. */
  values: Record<string, unknown>;
  conflicts: CanonicalMergeConflict[];
  acceptedDeltas: CanonicalSchemaDelta[];
  /** Schemas que quedaron sin resolver por conflicto. */
  unresolvedSchemaUids: string[];
  /** `false` si hay algún conflicto. Nunca hay ganador publicable en disputa. */
  publishable: boolean;
};

const valuesAreEqual = (codecId: SchemaCodecId | undefined, left: unknown, right: unknown): boolean =>
  getSchemaValueCodec(codecId ?? 'opaque').equals(left, right);

export const mergeCanonicalDeltas = (deltas: CanonicalSchemaDelta[]): CanonicalMergeResult => {
  const bySchema = new Map<string, CanonicalSchemaDelta[]>();
  deltas.forEach((delta) => bySchema.set(delta.schemaUid, [...(bySchema.get(delta.schemaUid) ?? []), delta]));

  const values: Record<string, unknown> = {};
  const conflicts: CanonicalMergeConflict[] = [];
  const acceptedDeltas: CanonicalSchemaDelta[] = [];
  const unresolvedSchemaUids: string[] = [];

  bySchema.forEach((entries, schemaUid) => {
    const ordered = [...entries].sort((left, right) => right.revision - left.revision);
    const winner = ordered[0];
    const codec = winner.codec ?? entries.find((entry) => entry.codec)?.codec;
    const divergent = ordered.filter((entry) => !valuesAreEqual(codec, entry.value, winner.value));

    if (divergent.length) {
      conflicts.push({
        schemaUid,
        executions: ordered.map((entry) => entry.executionId),
        revisions: ordered.map((entry) => entry.revision),
        values: ordered.map((entry) => entry.value),
        reason: 'divergent-values',
      });
      unresolvedSchemaUids.push(schemaUid);
      return;
    }

    values[schemaUid] = winner.value;
    acceptedDeltas.push(winner);
  });

  return {
    values,
    conflicts,
    acceptedDeltas,
    unresolvedSchemaUids,
    publishable: conflicts.length === 0,
  };
};
