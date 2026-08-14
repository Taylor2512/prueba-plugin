/**
 * Manifest de runtime derivado del registry vivo.
 *
 * Este módulo es una PROYECCIÓN, no una autoridad. Antes mantenía sus propios
 * conjuntos de tipos (`choiceTypes`, `signingTypes`, `visualTypes`,
 * `complexTypes`, `computedTypes`) para clasificar cada schema, duplicando la
 * taxonomía que `schemas/schemaFamilies.ts` ya poseía. La duplicación estaba
 * rota: `computedTypes` contenía `'barcodes'` —la clave del mapa de plugins—
 * y ninguno de los trece tipos reales de código de barras coincidía, así que
 * todos se clasificaban como entrada obligatoria (RTP-475).
 *
 * La taxonomía la resuelve `schemas/schemaRuntimeMetadata.ts`.
 */
import type { SchemaDefinition } from '../schemas/schemaBuilder.js';
import { resolveSchemaRuntimeMetadata } from '../schemas/schemaRuntimeMetadata.js';
import type {
  SchemaCodecId,
  SchemaCompletionPolicy,
  SchemaInteractionKind,
} from '../schemas/schemaRuntimeMetadata.js';

export type { SchemaInteractionKind, SchemaCompletionPolicy, SchemaCodecId };

export type SchemaRuntimeManifest = SchemaDefinition & {
  aliases: string[];
  /** Familia semántica del registry, no la categoría de catálogo. */
  family: string;
  /** Categoría de catálogo, tal y como la declara el plugin. */
  category: string;
  interactionKind: SchemaInteractionKind;
  completion: SchemaCompletionPolicy;
  codec: SchemaCodecId;
};

export const buildSchemaRuntimeManifest = (
  definitions: SchemaDefinition[],
  aliases: Record<string, string[]> = {},
): SchemaRuntimeManifest[] =>
  definitions.map((definition) => {
    const type = definition.type.toLowerCase();
    const metadata = resolveSchemaRuntimeMetadata(type);
    return {
      ...definition,
      aliases: [...(aliases[type] ?? [])],
      family: metadata.family,
      interactionKind: metadata.interactionKind,
      completion: metadata.completion,
      codec: metadata.codec,
    };
  });

/** Índice por tipo y alias. Un tipo desconocido devuelve `null`, no un default. */
export const indexSchemaRuntimeManifest = (
  manifest: SchemaRuntimeManifest[],
): Map<string, SchemaRuntimeManifest> => {
  const index = new Map<string, SchemaRuntimeManifest>();
  manifest.forEach((entry) => {
    index.set(entry.type.toLowerCase(), entry);
    entry.aliases.forEach((alias) => index.set(alias.toLowerCase(), entry));
  });
  return index;
};
