/**
 * Proyección de los inputs del Form sobre el scope de ejecución activo.
 *
 * ## Por qué existe
 *
 * `ExecutionScopeStore` (RTP-485) ya sabía aislar valores por
 * `runtimeSessionId × userId × documentId × schemaUid`, pero **ningún**
 * consumidor de producción lo usaba: el Form mantenía un único array de inputs
 * plano. La consecuencia observable es que dos documentos de la misma ejecución
 * comparten celda — lo que Alice escribe en D1 aparece en D2 y lo pisa al
 * volver. No es una pérdida de estado: es contaminación cruzada.
 *
 * Este módulo es la traducción entre las dos formas:
 *
 * ```text
 * inputs planos del runtime  ⇄  celdas con scope del store
 * ```
 *
 * Es deliberadamente puro. El ciclo de vida (cuándo proyectar, cuándo
 * committear) pertenece al hook de instancia, no aquí.
 *
 * ## Identidad de celda
 *
 * El runtime Form direcciona un valor por `(index, name)`: `index` es la fila
 * de `inputs` y `name` el schema dentro de ella. Esa pareja es la identidad
 * estable de la celda, así que es la que se usa como `schemaUid` del store.
 *
 * ## Value scope
 *
 * `documentId` **siempre** separa: dos documentos nunca comparten celda, ni
 * siquiera para un schema compartido entre usuarios. Lo que `valueScope`
 * decide es únicamente si el `userId` participa en la clave:
 *
 * - `shared` — un schema sin asignación es editable por todos y su valor es
 *   uno solo para la sesión (el comportamiento que el gate ya caracterizaba);
 * - `per-user` — un schema asignado tiene una celda por usuario.
 */
import type { ExecutionScopeStore, RuntimeScope, ScopeCommitResult } from '@sisad-pdfme/runtime/executionScopeStore';
import type { SchemaValueScope } from '@sisad-pdfme/runtime/schemaAccess';

export type ScopedInputPayload = {
  index: number;
  name: string;
  value: unknown;
};

export type SchemaValueScopeMap = Record<string, SchemaValueScope>;

/** Identidad estable de una celda del Form dentro de un scope. */
export const scopedCellUid = (index: number, name: string): string => `${index}::${name}`;

type SchemaLike = {
  name?: unknown;
  ownerMode?: unknown;
  valueScope?: unknown;
  assignment?: { mode?: unknown; valueScope?: unknown } | null;
};

type TemplateLike = { schemas?: unknown } | null | undefined;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

/** Aplana `schemas` tanto si viene por páginas como si es una lista simple. */
const flattenSchemas = (template: TemplateLike): SchemaLike[] => {
  const pages = (template as { schemas?: unknown })?.schemas;
  if (!Array.isArray(pages)) return [];
  return pages.flatMap((page) => (Array.isArray(page) ? page : [page])).filter(isPlainObject) as SchemaLike[];
};

const isValueScope = (value: unknown): value is SchemaValueScope =>
  value === 'shared' || value === 'per-user';

/**
 * Deriva el scope de valor de cada schema del template.
 *
 * Un `valueScope` explícito manda. Si no lo hay se deriva de la asignación:
 * asignar un schema a usuarios concretos es lo que hace que su valor deje de
 * ser común. Sin asignación el valor es compartido, que es exactamente lo que
 * `resolveSchemaAccess` concede como `unassigned`.
 */
export const deriveSchemaValueScopes = (template: TemplateLike): SchemaValueScopeMap => {
  const scopes: SchemaValueScopeMap = {};

  flattenSchemas(template).forEach((schema) => {
    const name = typeof schema.name === 'string' ? schema.name : '';
    if (!name) return;

    const explicit = isValueScope(schema.valueScope)
      ? schema.valueScope
      : isValueScope(schema.assignment?.valueScope)
        ? (schema.assignment?.valueScope as SchemaValueScope)
        : null;

    if (explicit) {
      scopes[name] = explicit;
      return;
    }

    const mode = schema.assignment?.mode ?? schema.ownerMode;
    scopes[name] = mode === 'single' || mode === 'multiple' ? 'per-user' : 'shared';
  });

  return scopes;
};

const scopeOf = (scopes: SchemaValueScopeMap, name: string): SchemaValueScope => scopes[name] ?? 'shared';

export type ProjectScopedInputsInput = {
  store: ExecutionScopeStore;
  scope: RuntimeScope;
  /** Inputs de partida (plantilla/host). Nunca se mutan. */
  baseInputs: unknown;
  valueScopes?: SchemaValueScopeMap;
};

/**
 * Superpone sobre `baseInputs` los valores que el scope activo tenga guardados.
 *
 * Una celda sin entrada en el store conserva su valor base — así un documento
 * recién abierto muestra los valores de plantilla en vez de quedar vacío, y
 * uno ya visitado recupera exactamente lo que su usuario escribió.
 */
export const projectScopedInputs = ({
  store,
  scope,
  baseInputs,
  valueScopes = {},
}: ProjectScopedInputsInput): unknown[] => {
  if (!Array.isArray(baseInputs)) return [];

  return baseInputs.map((row, index) => {
    if (!isPlainObject(row)) return row;
    const next: Record<string, unknown> = { ...row };

    Object.keys(next).forEach((name) => {
      const entry = store.get(scope, scopedCellUid(index, name), scopeOf(valueScopes, name));
      if (entry) next[name] = entry.value;
    });

    return next;
  });
};

export type CommitScopedInputInput = {
  store: ExecutionScopeStore;
  scope: RuntimeScope;
  payload: ScopedInputPayload;
  valueScopes?: SchemaValueScopeMap;
  executionId?: string;
};

/**
 * Escribe una edición del usuario en la celda del scope activo.
 *
 * La revisión esperada se lee del propio store en el momento del commit: este
 * camino es el de una edición local ya secuenciada por el runtime, no el de
 * dos escritores concurrentes. La detección de conflicto real sigue viviendo
 * en `ExecutionScopeStore.commit`, que es quien asigna la revisión siguiente.
 */
export const commitScopedInput = ({
  store,
  scope,
  payload,
  valueScopes = {},
  executionId = 'runtime-local',
}: CommitScopedInputInput): ScopeCommitResult => {
  const uid = scopedCellUid(payload.index, payload.name);
  const valueScope = scopeOf(valueScopes, payload.name);

  return store.commit({
    scope,
    schemaUid: uid,
    value: payload.value,
    expectedRevision: store.revisionOf(scope, uid, valueScope),
    executionId,
    valueScope,
  });
};
