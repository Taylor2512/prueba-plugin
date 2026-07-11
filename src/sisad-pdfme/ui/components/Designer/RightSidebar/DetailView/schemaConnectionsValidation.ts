/**
 * schemaConnectionsValidation — validadores puros para conexiones del schema.
 *
 * Revisa campos mínimos de persistencia, salida JSON/form y API. Devuelve claves
 * faltantes normalizadas para que la UI pueda mostrar estados o advertencias sin
 * duplicar reglas de validación.
 */
import type { SchemaDesignerConfig, SchemaPersistenceConfig } from '../../../../designerEngine.js';

/**
 * Valida configuración de persistencia y devuelve claves faltantes.
 */
export const validatePersistenceConfig = (persistence?: SchemaPersistenceConfig): string[] => {
  if (!persistence?.enabled) return [];

  const missing: string[] = [];
  if (!String(persistence.key || '').trim()) {
    missing.push('storageKey');
  }

  return missing;
};

/**
 * Valida configuración de salida/form JSON del schema.
 */
export const validateFormConfig = (formJson?: SchemaDesignerConfig['form']): string[] => {
  if (!formJson?.enabled || !formJson.collect) return [];

  const missing: string[] = [];
  if (!String(formJson.rootKey || '').trim()) {
    missing.push('rootKey');
  }

  return missing;
};

/**
 * Valida configuración API y cliente HTTP resuelto.
 */
export const validateApiConfig = (
  api: SchemaDesignerConfig['api'],
  resolvedHttpClient?: {
    inheritSystem?: boolean;
    baseURL?: string;
    auth?: {
      mode?: 'inherit' | 'manual';
      type?: 'bearer' | 'basic' | 'apiKey' | 'custom';
      headerName?: string;
      headerValue?: string;
      token?: string;
      username?: string;
      password?: string;
    };
  },
): string[] => {
  if (!api?.enabled) return [];

  const missing: string[] = [];
  if (!String(api.endpoint || '').trim()) {
    missing.push('endpoint');
  }

  if (resolvedHttpClient?.inheritSystem === false && !String(resolvedHttpClient.baseURL || '').trim()) {
    missing.push('baseURL');
  }

  if (resolvedHttpClient?.auth?.mode === 'manual') {
    const authType = resolvedHttpClient.auth?.type || 'bearer';
    const hasToken = Boolean(resolvedHttpClient.auth?.token || resolvedHttpClient.auth?.headerValue);
    const hasHeader = Boolean(resolvedHttpClient.auth?.headerName);
    const hasBasicCredentials = Boolean(resolvedHttpClient.auth?.username || resolvedHttpClient.auth?.password);

    if (authType === 'basic') {
      if (!hasBasicCredentials) {
        missing.push('auth');
      }
    } else if (authType === 'apiKey' || authType === 'custom') {
      if (!hasToken || !hasHeader) {
        missing.push('auth');
      }
    } else if (!hasToken) {
      missing.push('auth');
    }
  }

  return missing;
};

/**
 * Consolida campos faltantes de persistencia, form y API sin duplicados.
 */
export const getMissingConnectionFields = (
  persistence: SchemaPersistenceConfig,
  api: NonNullable<SchemaDesignerConfig['api']>,
  formJson: NonNullable<SchemaDesignerConfig['form']>,
  resolvedHttpClient?: Parameters<typeof validateApiConfig>[1],
): string[] => Array.from(new Set([
  ...validatePersistenceConfig(persistence),
  ...validateFormConfig(formJson),
  ...validateApiConfig(api, resolvedHttpClient),
]));
