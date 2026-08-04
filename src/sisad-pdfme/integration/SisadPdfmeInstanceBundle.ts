import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
} from '../config/index.js';
import {
  validateSisadPdfmeInstanceDefinition,
  type SisadPdfmeInstanceDefinitionIssue,
} from './validateSisadPdfmeInstanceDefinition.js';
import type {
  SisadPdfmeInstanceDefinition,
  SisadPdfmeInstanceResources,
} from './resolveSisadPdfmeInstance.js';

export type SisadPdfmeInstanceBundleVersion = 1;

export type SisadPdfmeInstanceBundleResources = Omit<SisadPdfmeInstanceResources, 'adapters'>;

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

const stripAdapters = (
  resources?: SisadPdfmeInstanceResources,
): SisadPdfmeInstanceBundleResources | undefined => {
  if (!resources) return undefined;
  const { adapters: _adapters, ...portableResources } = resources;
  void _adapters;
  return clonePortableValue(portableResources);
};

export const createSisadPdfmeInstanceBundle = (
  input: SisadPdfmeInstanceBundleInput,
): SisadPdfmeInstanceBundle => {
  const issues = validateSisadPdfmeInstanceDefinition(input.definition);
  const valid = !issues.some((issue) => issue.severity === 'error');
  return {
    version: 1,
    definition: clonePortableValue(input.definition),
    resources: stripAdapters(input.resources),
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
