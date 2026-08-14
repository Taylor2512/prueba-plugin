import {
  validateSisadPdfmeInstanceDefinition,
  type SisadPdfmeInstanceDefinitionIssue,
} from './validateSisadPdfmeInstanceDefinition.js';
import type {
  SisadPdfmeInstanceDefinition,
  SisadPdfmeInstanceResources,
} from './resolveSisadPdfmeInstance.js';
import {
  NON_PORTABLE_RESOURCE_KEYS,
  stripSecrets,
  type NonPortableResourceKey,
} from './http/integrationResources.js';

export type SisadPdfmeInstanceBundleVersion = 1;

/**
 * Recursos que SÍ pueden viajar en el bundle.
 *
 * Se excluyen las dos ramas no serializables: `adapters` (normalizadores de
 * datos del host) e `integrations` (clientes vivos, providers y funciones).
 * La lista canónica vive en `NON_PORTABLE_RESOURCE_KEYS` para que añadir una
 * rama nueva no requiera acordarse de tocar este tipo (RTP-470).
 */
export type SisadPdfmeInstanceBundleResources = Omit<
  SisadPdfmeInstanceResources,
  NonPortableResourceKey
>;

export type SisadPdfmeInstanceBundle = {
  version: SisadPdfmeInstanceBundleVersion;
  definition: SisadPdfmeInstanceDefinition;
  resources?: SisadPdfmeInstanceBundleResources;
  issues: SisadPdfmeInstanceDefinitionIssue[];
  valid: boolean;
};

export type SisadPdfmeInstanceBundleReadResult = {
  bundle: SisadPdfmeInstanceBundle | null;
  issues: SisadPdfmeInstanceDefinitionIssue[];
  valid: boolean;
};

export type SisadPdfmeInstanceBundleInput = {
  definition: SisadPdfmeInstanceDefinition;
  resources?: SisadPdfmeInstanceResources;
};

const clonePortableValue = <T>(value: T): T => {
  if (value === undefined) return value;
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
};

/**
 * Deja el bundle sólo con lo portable.
 *
 * Dos pasos, no uno:
 *
 * 1. se retiran las ramas no serializables (`adapters`, `integrations`);
 * 2. se limpian credenciales y funciones del resto.
 *
 * El segundo paso hace falta porque la configuración declarativa de conexión
 * (`SchemaHttpAuthConfig`) admite `token`, `username`, `password` y
 * `headerValue`, y esa configuración SÍ es portable. Sin la limpieza, exportar
 * un bundle podía llevarse credenciales del host dentro de la plantilla.
 */
const stripNonPortable = (
  resources?: SisadPdfmeInstanceResources,
): SisadPdfmeInstanceBundleResources | undefined => {
  if (!resources) return undefined;
  const portableResources = { ...resources } as Record<string, unknown>;
  NON_PORTABLE_RESOURCE_KEYS.forEach((key) => {
    delete portableResources[key];
  });
  const { value } = stripSecrets(portableResources);
  return clonePortableValue(value) as SisadPdfmeInstanceBundleResources;
};

export const createSisadPdfmeInstanceBundle = (
  input: SisadPdfmeInstanceBundleInput,
): SisadPdfmeInstanceBundle => {
  const issues = validateSisadPdfmeInstanceDefinition(input.definition);
  const valid = !issues.some((issue) => issue.severity === 'error');
  return {
    version: 1,
    // La definición lleva la configuración declarativa de conexión, que admite
    // `token`/`password`/`headerValue`. Nunca debe exportarse con ellos.
    definition: clonePortableValue(stripSecrets(input.definition).value),
    resources: stripNonPortable(input.resources),
    issues,
    valid,
  };
};

export const restoreSisadPdfmeInstanceBundle = (
  bundle: SisadPdfmeInstanceBundle,
): SisadPdfmeInstanceBundle => ({
  version: bundle.version,
  definition: clonePortableValue(bundle.definition),
  resources: bundle.resources ? clonePortableValue(bundle.resources) : undefined,
  issues: bundle.issues.slice(),
  valid: bundle.valid,
});

export const serializeSisadPdfmeInstanceBundle = (
  bundle: SisadPdfmeInstanceBundle,
): string => JSON.stringify(bundle, null, 2);

export const validateSisadPdfmeInstanceBundle = (
  bundle: unknown,
): SisadPdfmeInstanceDefinitionIssue[] => {
  if (!bundle || typeof bundle !== 'object') {
    return validateSisadPdfmeInstanceDefinition(bundle as never);
  }

  const record = bundle as Record<string, unknown>;
  const issues = validateSisadPdfmeInstanceDefinition(record.definition as SisadPdfmeInstanceDefinition);
  if (record.version !== 1) {
    issues.push({
      code: 'instance-bundle-version-invalid',
      severity: 'error',
      path: 'version',
      message: 'version debe ser 1',
      sourcePaths: ['version'],
    });
  }
  return issues;
};

export const parseSisadPdfmeInstanceBundle = (
  payload: string,
): SisadPdfmeInstanceBundleReadResult => {
  try {
    const parsed = JSON.parse(payload) as unknown;
    const issues = validateSisadPdfmeInstanceBundle(parsed);
    const valid = !issues.some((issue) => issue.severity === 'error');
    const bundle = issues.some((issue) => issue.severity === 'error')
      ? null
      : (parsed as SisadPdfmeInstanceBundle);
    return {
      bundle,
      issues,
      valid,
    };
  } catch {
    return {
      bundle: null,
      issues: [
        {
          code: 'instance-bundle-parse-invalid',
          severity: 'error',
          path: '',
          message: 'el bundle debe ser un JSON válido',
          sourcePaths: [],
        },
      ],
      valid: false,
    };
  }
};
