/**
 * Bundle de instancia portable: activos incrustados.
 *
 * Rol arquitectónico:
 * - `createSisadPdfmeInstanceBundle` produce un bundle *limpio*: retira las
 *   ramas vivas y las credenciales, pero deja los `basePdf` tal cual los
 *   entregó el host. Si venían como URL o como binario, el JSON resultante no
 *   se puede restaurar fuera de ese host.
 * - Este módulo cierra esa diferencia: convierte todos los `basePdf`
 *   alcanzables —el de la plantilla y los de cada documento, en `definition` y
 *   en `resources`— a data URI base64 ANTES de armar el bundle.
 *
 * Por qué antes y no después: la limpieza de secretos reconstruye cada objeto
 * a partir de sus claves enumerables, así que un `Uint8Array` sobreviviría como
 * `{ "0": 37, "1": 80, … }`. Una vez dentro del bundle, el binario ya no se
 * puede recuperar; incrustarlo primero lo convierte en una cadena, que sí
 * atraviesa la limpieza intacta.
 *
 * Es la única capacidad del antiguo exportador de ejemplos sin equivalente
 * productivo: la normalización de datos del host vive en `normalizeHostData`, y
 * el armado y la serialización en `SisadPdfmeInstanceBundle`, que además limpia
 * credenciales — algo que el exportador de ejemplos no hacía.
 *
 * Límites del módulo:
 * - No valida el bundle: eso es de `validateSisadPdfmeInstanceBundle`.
 * - No decide transporte; recibe las opciones de descarga del host.
 */

import { getB64BasePdf } from '@sisad-pdfme/common/helper';
import {
  createSisadPdfmeInstanceBundle,
  type SisadPdfmeInstanceBundle,
  type SisadPdfmeInstanceBundleInput,
} from '@sisad-pdfme/integration/SisadPdfmeInstanceBundle';

/** Codificación declarada por un bundle cuyos activos ya viajan incrustados. */
export const SISAD_PDFME_BUNDLE_ASSET_ENCODING = 'base64-inline';

export type SisadPdfmeInlinedInstanceBundle = SisadPdfmeInstanceBundle & {
  assetEncoding: typeof SISAD_PDFME_BUNDLE_ASSET_ENCODING;
};

/** Opciones de descarga para los `basePdf` que aún son una URL. */
export type SisadPdfmeInstanceBundleAssetOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Un `basePdf` sólo necesita descarga cuando es una referencia externa.
 *
 * `BlankPdf` (un objeto con medidas) ya es autocontenido, y un data URI
 * también: reenviarlos a `getB64BasePdf` sería trabajo inútil y, en el caso de
 * la URL, una petición de red por cada exportación.
 */
const needsInlining = (basePdf: unknown): boolean => {
  if (typeof basePdf === 'string') return !basePdf.startsWith('data:application/pdf;');
  return basePdf instanceof ArrayBuffer || ArrayBuffer.isView(basePdf);
};

const inlineTemplate = async (
  template: unknown,
  options: SisadPdfmeInstanceBundleAssetOptions,
): Promise<unknown> => {
  if (!isRecord(template)) return template;
  const { basePdf } = template;
  if (!needsInlining(basePdf)) return template;
  return {
    ...template,
    basePdf: await getB64BasePdf(basePdf as ArrayBuffer | Uint8Array | string, options),
  };
};

const inlineDocuments = async (
  documents: unknown,
  options: SisadPdfmeInstanceBundleAssetOptions,
): Promise<unknown> => {
  if (!Array.isArray(documents)) return documents;
  return Promise.all(
    documents.map(async (document) => {
      if (!isRecord(document)) return document;
      const template = await inlineTemplate(document.template, options);
      return template === document.template ? document : { ...document, template };
    }),
  );
};

const inlineTemplateMap = async (
  templates: unknown,
  options: SisadPdfmeInstanceBundleAssetOptions,
): Promise<unknown> => {
  if (!isRecord(templates)) return templates;
  const entries = await Promise.all(
    Object.entries(templates).map(
      async ([key, template]) => [key, await inlineTemplate(template, options)] as const,
    ),
  );
  return Object.fromEntries(entries);
};

/**
 * Devuelve la misma entrada con todos sus `basePdf` incrustados.
 *
 * Recorre las dos ramas que pueden llevar plantillas: la `definition` (lo que
 * el host declaró) y `resources` (lo que resolvió), incluidos el mapa
 * `templates` y la lista de `documents` de cada una.
 *
 * Cualquier fallo de descarga se propaga: un bundle al que le falta el PDF base
 * es indistinguible de uno íntegro una vez serializado, así que no puede
 * producirse en silencio.
 */
export const inlineSisadPdfmeInstanceAssets = async (
  input: SisadPdfmeInstanceBundleInput,
  options: SisadPdfmeInstanceBundleAssetOptions = {},
): Promise<SisadPdfmeInstanceBundleInput> => {
  const [definitionTemplate, definitionDocuments] = await Promise.all([
    inlineTemplate(input.definition?.template, options),
    inlineDocuments(input.definition?.documents, options),
  ]);

  const resources = input.resources;
  const [resourceTemplate, resourceTemplates, resourceDocuments] = await Promise.all([
    inlineTemplate(resources?.template, options),
    inlineTemplateMap(resources?.templates, options),
    inlineDocuments(resources?.documents, options),
  ]);

  return {
    definition: {
      ...input.definition,
      template: definitionTemplate,
      documents: definitionDocuments as SisadPdfmeInstanceBundleInput['definition']['documents'],
    },
    ...(resources
      ? {
          resources: {
            ...resources,
            template: resourceTemplate,
            templates: resourceTemplates as NonNullable<
              SisadPdfmeInstanceBundleInput['resources']
            >['templates'],
            documents: resourceDocuments as NonNullable<
              SisadPdfmeInstanceBundleInput['resources']
            >['documents'],
          },
        }
      : {}),
  };
};

/**
 * Arma un bundle autocontenido: activos incrustados y credenciales limpiadas.
 *
 * Es la vía recomendada para exportar una instancia a otro host: el JSON
 * resultante se restaura sin acceso a la red ni a los binarios originales.
 */
export const createPortableSisadPdfmeInstanceBundle = async (
  input: SisadPdfmeInstanceBundleInput,
  options: SisadPdfmeInstanceBundleAssetOptions = {},
): Promise<SisadPdfmeInlinedInstanceBundle> => ({
  ...createSisadPdfmeInstanceBundle(await inlineSisadPdfmeInstanceAssets(input, options)),
  assetEncoding: SISAD_PDFME_BUNDLE_ASSET_ENCODING,
});

/**
 * `true` cuando el bundle declara llevar sus activos incrustados.
 *
 * Permite a un host decidir si puede restaurar el bundle sin acceso a la red
 * original antes de intentarlo.
 */
export const isInlinedSisadPdfmeInstanceBundle = (
  bundle: unknown,
): bundle is SisadPdfmeInlinedInstanceBundle =>
  isRecord(bundle) && bundle.assetEncoding === SISAD_PDFME_BUNDLE_ASSET_ENCODING;
