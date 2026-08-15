/**
 * Recursos de integración: la rama NO serializable de `resources`.
 *
 * `SisadPdfmeInstanceResources` ya distinguía recursos portables de
 * `adapters`, y `createSisadPdfmeInstanceBundle` retiraba `adapters` del
 * bundle exportable. Esa intención es correcta y aquí se **generaliza**, no se
 * duplica: `integrations` es una segunda rama con la misma naturaleza —
 * clientes vivos, providers y funciones que no pueden viajar en un JSON.
 *
 * Se declara aparte de `adapters` porque son cosas distintas: `adapters`
 * normaliza DATOS del host; `integrations` aporta CAPACIDAD de ejecución
 * (transporte, fuentes de datos, firma, fuentes tipográficas).
 *
 * Regla dura: nada de aquí entra en template, snapshot ni bundle.
 */
import type { HttpClientAdapter } from '@sisad-pdfme/integration/http/httpClient';

/** Claves de `resources` que jamás pueden serializarse. */
export const NON_PORTABLE_RESOURCE_KEYS = ['adapters', 'integrations'] as const;
export type NonPortableResourceKey = (typeof NON_PORTABLE_RESOURCE_KEYS)[number];

export type SisadPdfmeIntegrationResources = {
  /** Transporte inyectado por el host. Sin él no hay ejecución remota. */
  httpClient?: HttpClientAdapter;
  /** Fuentes de datos programáticas, indexadas por `sourceKey`. */
  dataSources?: Record<string, unknown>;
  /** Providers de ejecución de firma. */
  signatureExecution?: Record<string, unknown>;
  /** Registro de fuentes tipográficas compartido. */
  fonts?: unknown;
};

/**
 * Limpieza de credenciales.
 *
 * El primitivo vive en `common/secrets` porque la configuración que lo
 * necesita se guarda dentro del schema y la consume también
 * `shared/snapshotAdapter`, que no puede importar de `integration` sin
 * invertir las capas. Se reexporta aquí para no romper la superficie pública.
 */
export { SECRET_KEYS, stripSecrets, containsSecrets } from '@sisad-pdfme/common/secrets';
