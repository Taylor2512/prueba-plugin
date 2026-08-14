/**
 * Metadatos de runtime por familia semántica de schema.
 *
 * ## Por qué vive en `schemas/` y no en `runtime/`
 *
 * `runtime/schemaManifest.ts` mantenía sus propios conjuntos de tipos
 * —`choiceTypes`, `signingTypes`, `visualTypes`, `complexTypes`,
 * `computedTypes`— para clasificar cada schema. Eso era una SEGUNDA autoridad
 * de producto sobre la taxonomía, paralela a `SEMANTIC_FAMILY_BY_TYPE` de
 * `schemaFamilies.ts`, y las dos podían desincronizarse sin que nada fallara.
 *
 * Ya lo estaban: `computedTypes` contenía el literal `'barcodes'`, que es la
 * CLAVE del mapa de plugins, no un tipo de schema. Los trece tipos reales
 * (`qrcode`, `ean13`, `code128`, `pdf417`…) no coincidían con ningún conjunto
 * y caían al `default`, clasificados como `input` con
 * `completion: 'required-value'`. Es decir: las proyecciones de completitud
 * exigían al usuario «rellenar» un código de barras generado (RTP-475).
 *
 * La taxonomía es del registry. Este módulo declara qué implica cada familia
 * para el runtime, y `buildSchemaRuntimeManifest` pasa a ser una proyección
 * pura sin listas de tipos propias.
 */
import { resolveSchemaSemanticFamily, type SchemaSemanticFamily } from './schemaFamilies.js';

/** Naturaleza de la interacción que admite un schema. */
export type SchemaInteractionKind =
  | 'input'
  | 'choice'
  | 'signing'
  | 'artifact'
  | 'action'
  | 'computed'
  | 'visual'
  | 'complex';

/** Qué cuenta como «completado» para este schema. */
export type SchemaCompletionPolicy =
  | 'required-value'
  | 'selection'
  | 'signing'
  | 'artifact'
  | 'action'
  | 'none';

/** Codec semántico del valor. Decide igualdad y vacío, no truthiness. */
export type SchemaCodecId = 'string' | 'number' | 'date' | 'boolean' | 'array' | 'opaque';

export type SchemaRuntimeMetadata = {
  family: SchemaSemanticFamily;
  interactionKind: SchemaInteractionKind;
  completion: SchemaCompletionPolicy;
  codec: SchemaCodecId;
};

/**
 * Implicaciones de runtime por familia.
 *
 * `media` y `shape` son visuales: existen en la página pero el usuario no los
 * «completa». `barcode` es computado: su contenido se deriva, no se rellena.
 */
const METADATA_BY_FAMILY: Record<SchemaSemanticFamily, Omit<SchemaRuntimeMetadata, 'family'>> = {
  text: { interactionKind: 'input', completion: 'required-value', codec: 'string' },
  multiVariableText: { interactionKind: 'input', completion: 'required-value', codec: 'string' },
  signature: { interactionKind: 'signing', completion: 'signing', codec: 'opaque' },
  action: { interactionKind: 'action', completion: 'action', codec: 'string' },
  table: { interactionKind: 'complex', completion: 'required-value', codec: 'array' },
  barcode: { interactionKind: 'computed', completion: 'none', codec: 'string' },
  boolean: { interactionKind: 'choice', completion: 'selection', codec: 'boolean' },
  choice: { interactionKind: 'choice', completion: 'selection', codec: 'array' },
  dateTime: { interactionKind: 'input', completion: 'required-value', codec: 'date' },
  media: { interactionKind: 'visual', completion: 'none', codec: 'opaque' },
  shape: { interactionKind: 'visual', completion: 'none', codec: 'string' },
};

/**
 * Excepciones por tipo, cuando el tipo concreto difiere de su familia.
 *
 * Se mantienen deliberadamente cortas: cada entrada aquí es una familia que no
 * describe bien a uno de sus miembros y, por tanto, deuda de taxonomía.
 */
const METADATA_BY_TYPE: Record<string, Partial<Omit<SchemaRuntimeMetadata, 'family'>>> = {
  // Firma con fecha: es firma en cuanto a completitud, pero su valor es una fecha.
  datesigned: { codec: 'date' },
  // El adjunto produce un artefacto, no un valor de texto.
  attachment: { interactionKind: 'artifact', completion: 'artifact', codec: 'opaque' },
  // Un radio es elección ÚNICA: su valor es un escalar, no una lista.
  radiogroup: { codec: 'string' },
  number: { codec: 'number' },
};

/** Metadatos de runtime de un tipo de schema, derivados del registry. */
export const resolveSchemaRuntimeMetadata = (schemaType: string): SchemaRuntimeMetadata => {
  const normalizedType = String(schemaType || '').trim().toLowerCase();
  const family = resolveSchemaSemanticFamily(normalizedType);
  return {
    family,
    ...METADATA_BY_FAMILY[family],
    ...(METADATA_BY_TYPE[normalizedType] || {}),
  };
};

/** Familias declaradas. Útil para pruebas de cobertura del registry. */
export const SCHEMA_RUNTIME_FAMILIES = Object.keys(METADATA_BY_FAMILY) as SchemaSemanticFamily[];
