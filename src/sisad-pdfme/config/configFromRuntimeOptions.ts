/**
 * Extrae la configuración serializable que viaja dentro de las opciones de runtime.
 *
 * Por qué existe: el Designer y el Canvas reciben `options` por contexto y
 * hacían `useSisadPdfmeConfig(options)`, es decir, trataban las OPCIONES como
 * si fueran configuración. El ConfigService clona su entrada con
 * `structuredClone`, así que cualquier valor vivo dentro de las opciones
 * —`designerEngine` con su hub de eventos o sus renderers, por ejemplo— hacía
 * fallar el montaje con `DataCloneError`.
 *
 * Este picker deja pasar únicamente las ramas que son configuración de verdad
 * y descarta lo que es transporte de runtime. Es la condición previa para
 * poder colgar el hub de eventos de `designerEngine` (COREUX-006/007).
 */
import type { SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';

/**
 * Claves de `SisadPdfmeGlobalConfig`. Todo lo demás que aparezca en las
 * opciones (designerEngine, uploadedDocuments, i18n, flags de layout ya
 * resueltos…) es runtime y no debe llegar al ConfigService.
 */
const CONFIG_KEYS = [
  'configVersion',
  'app',
  'runtime',
  'theme',
  'canvas',
  'sidebars',
  'schemas',
  'recipients',
  'collaboration',
  'assignment',
  'documents',
  'signatures',
  'persistence',
  'events',
  'debug',
  'visibility',
  'ui',
] as const satisfies readonly (keyof SisadPdfmeGlobalConfig)[];

/**
 * `events` puede contener funciones cuando el host las pasa programáticamente.
 * No sobreviven a `structuredClone`, así que se filtran a los valores
 * declarativos (`'host' | false`) que sí son configuración.
 */
const sanitizeEvents = (events: unknown): Record<string, unknown> | undefined => {
  if (!events || typeof events !== 'object') return undefined;
  const entries = Object.entries(events as Record<string, unknown>).filter(
    ([, value]) => value === 'host' || value === false,
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

/**
 * Devuelve la porción de configuración contenida en `options`.
 *
 * El resultado es siempre serializable, así que es seguro entregarlo al
 * ConfigService.
 */
export const configFromRuntimeOptions = (
  options: unknown,
): SisadPdfmeGlobalConfig => {
  if (!options || typeof options !== 'object') return {};
  const source = options as Record<string, unknown>;
  const config: Record<string, unknown> = {};

  CONFIG_KEYS.forEach((key) => {
    if (!(key in source) || source[key] === undefined) return;
    if (key === 'events') {
      const events = sanitizeEvents(source[key]);
      if (events) config[key] = events;
      return;
    }
    config[key] = source[key];
  });

  return config as SisadPdfmeGlobalConfig;
};
