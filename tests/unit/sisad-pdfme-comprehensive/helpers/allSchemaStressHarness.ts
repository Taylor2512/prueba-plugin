/**
 * Harness de estrés derivado del registry vivo (RTP-515).
 *
 * ## Por qué se deriva y no se enumera
 *
 * Una matriz de pruebas escrita a mano miente en cuanto alguien registra un
 * schema nuevo: el tipo entra en producción y la matriz sigue verde porque
 * nunca supo de él. Aquí la lista de tipos, familias e implicaciones de runtime
 * sale de `getBuiltInFields()` + `buildSchemaRuntimeManifest()`, que son las
 * mismas fuentes que usa el runtime. Registrar un schema lo mete en la matriz
 * automáticamente; si ese schema rompe un invariante, la matriz falla sola.
 *
 * ## Qué modela
 *
 * - **multi-instancia**: N instancias del mismo tipo conviviendo. El defecto
 *   clásico —dos campos del mismo tipo compartiendo nombre y por tanto valor—
 *   sólo aparece con más de una instancia.
 * - **pairwise por familia**: cada par de familias semánticas conviviendo en el
 *   mismo documento. El par completo por tipo son cientos de combinaciones que
 *   no añaden señal; la familia es la unidad que define el comportamiento.
 * - **no-rollback**: escribir en una instancia no puede revertir a las demás a
 *   su valor de plantilla, que fue el P0 de sibling rollback.
 * - **diagnostics**: recuento por familia/interacción/codec/binding, para que
 *   una deriva de taxonomía sea visible en vez de silenciosa.
 */
import type { SchemaForUI } from '../../../../src/sisad-pdfme/common';
import {
  createDefaultSchema,
  getBuiltInFields,
  getSchemaPluginByType,
} from '../../../../src/sisad-pdfme/schemas';
import {
  buildSchemaRuntimeManifest,
  type SchemaInteractionKind,
  type SchemaRuntimeManifest,
} from '../../../../src/sisad-pdfme/runtime/schemaManifest';

/**
 * Interacciones que el usuario no completa.
 *
 * `visual` son formas e imágenes de fondo; `computed` deriva su contenido (un
 * código de barras se calcula, no se rellena). Excluirlos no es una lista de
 * tipos: es una consulta sobre el metadato que ya publica el registry.
 */
const NON_INTERACTIVE_KINDS: SchemaInteractionKind[] = ['visual', 'computed'];

/** Manifest de runtime de todos los tipos registrados. */
export const listRegisteredSchemaManifest = (): SchemaRuntimeManifest[] =>
  buildSchemaRuntimeManifest(getBuiltInFields());

/** Sólo los tipos que un usuario puede completar en Form. */
export const listInteractiveSchemaManifest = (): SchemaRuntimeManifest[] =>
  listRegisteredSchemaManifest().filter((entry) => !NON_INTERACTIVE_KINDS.includes(entry.interactionKind));

export type StressInstance = {
  type: string;
  family: string;
  /** Ordinal de la instancia dentro de su tipo. */
  ordinal: number;
  schema: SchemaForUI;
  /** Nombre efectivo tras la desambiguación del registry. */
  name: string;
};

/**
 * Crea `instancesPerType` instancias de cada tipo del manifest.
 *
 * Las instancias se acumulan en `existingSchemas` a propósito: así
 * `createDefaultSchema` tiene que desambiguar el nombre contra las hermanas ya
 * creadas, que es justo el camino que se quiere ejercer.
 */
export const buildStressInstances = (
  manifest: SchemaRuntimeManifest[],
  instancesPerType: number,
): StressInstance[] => {
  const created: SchemaForUI[] = [];
  const instances: StressInstance[] = [];

  manifest.forEach((entry) => {
    for (let ordinal = 0; ordinal < instancesPerType; ordinal += 1) {
      const uid = `${entry.type}-${ordinal}`;
      const schema = createDefaultSchema(entry.type, {
        existingSchemas: created,
        schemaUid: uid,
        id: uid,
      });
      created.push(schema);
      instances.push({ type: entry.type, family: entry.family, ordinal, schema, name: schema.name });
    }
  });

  return instances;
};

/** Un tipo representante por familia semántica, en orden estable. */
export const representativesByFamily = (manifest: SchemaRuntimeManifest[]): SchemaRuntimeManifest[] => {
  const seen = new Map<string, SchemaRuntimeManifest>();
  manifest.forEach((entry) => {
    if (!seen.has(entry.family)) seen.set(entry.family, entry);
  });
  return [...seen.values()];
};

/** Todos los pares no ordenados y sin repetición. */
export const unorderedPairs = <T>(items: T[]): Array<[T, T]> => {
  const pairs: Array<[T, T]> = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) pairs.push([items[i], items[j]]);
  }
  return pairs;
};

/** Matriz pairwise de familias, con un tipo representante por lado. */
export const familyPairwiseMatrix = (
  manifest: SchemaRuntimeManifest[],
): Array<[SchemaRuntimeManifest, SchemaRuntimeManifest]> => unorderedPairs(representativesByFamily(manifest));

export type StressDiagnostics = {
  totalTypes: number;
  interactiveTypes: number;
  byFamily: Record<string, number>;
  byInteractionKind: Record<string, number>;
  byCodec: Record<string, number>;
  byDataBinding: Record<string, number>;
  /** Tipos cuyo manifest no resolvió alguna implicación de runtime. */
  incomplete: string[];
};

const tally = (values: string[]): Record<string, number> =>
  values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

export const collectStressDiagnostics = (manifest: SchemaRuntimeManifest[]): StressDiagnostics => ({
  totalTypes: manifest.length,
  interactiveTypes: manifest.filter((entry) => !NON_INTERACTIVE_KINDS.includes(entry.interactionKind)).length,
  byFamily: tally(manifest.map((entry) => entry.family)),
  byInteractionKind: tally(manifest.map((entry) => entry.interactionKind)),
  byCodec: tally(manifest.map((entry) => entry.codec)),
  byDataBinding: tally(manifest.map((entry) => entry.dataBinding)),
  incomplete: manifest
    .filter((entry) => !entry.family || !entry.interactionKind || !entry.completion || !entry.codec || !entry.dataBinding)
    .map((entry) => entry.type),
});

export type MountedInstance = {
  root: HTMLDivElement;
  /** Cambios que el plugin emitió por su propio `onChange`. */
  changes: unknown[];
  instance: StressInstance;
};

/**
 * Monta una instancia en su propia raíz desconectada.
 *
 * Cada montaje recibe raíz y `onChange` propios: si un plugin guardara estado
 * en su módulo, dos montajes del mismo tipo se contaminarían y el harness lo
 * vería como cambios apareciendo en el `onChange` equivocado.
 */
export const mountStressInstance = async (
  instance: StressInstance,
  mode: 'designer' | 'form' | 'viewer',
): Promise<MountedInstance> => {
  const plugin = getSchemaPluginByType(instance.type);
  const root = document.createElement('div');
  const changes: unknown[] = [];

  await plugin?.ui({
    schema: instance.schema,
    basePdf: '',
    mode,
    value: String(instance.schema.content ?? ''),
    rootElement: root,
    options: {},
    theme: { colorPrimaryBg: '#ffffff', colorPrimary: '#1677ff', colorWhite: '#ffffff' },
    i18n: (key: string) => key,
    scale: 1,
    _cache: new Map(),
    onChange: (change: unknown) => changes.push(change),
    stopEditing: () => undefined,
  } as never);

  return { root, changes, instance };
};

/** Fila de inputs de Form con el valor inicial de cada instancia. */
export const initialInputRow = (instances: StressInstance[]): Record<string, string> =>
  instances.reduce<Record<string, string>>((row, instance) => {
    row[instance.name] = String(instance.schema.content ?? '');
    return row;
  }, {});

/** Valor determinista y distinto por instancia, para poder rastrear reversiones. */
export const stressValueFor = (instance: StressInstance): string =>
  `${instance.type}#${instance.ordinal}`;

/**
 * Documento de snapshot con todas las instancias en una única página.
 *
 * Un documento de estrés real vive en una página: es donde conviven todas las
 * familias y donde una serialización que pierda o funda instancias se nota.
 */
export const buildStressSnapshotDocument = (instances: StressInstance[], documentId = 'stress-doc') => ({
  documentId,
  name: 'stress',
  order: 0,
  pages: [
    {
      pageNumber: 1,
      background: { type: 'none' as const },
      schemas: instances.map((instance) => ({
        ...(instance.schema as unknown as Record<string, unknown>),
        __designer: {
          schemaUid: String(instance.schema.schemaUid),
          templateVersion: '2.0.0',
          documentId,
          pageNumber: 1,
        },
      })),
    },
  ],
});
