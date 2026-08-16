import { cloneDeep } from '@sisad-pdfme/common';
import type { SisadPdfmeGlobalConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';

export type SisadPdfmeConfigNormalizationSeverity = 'info' | 'warning';

export type SisadPdfmeConfigNormalizationIssue = {
  code: string;
  severity: SisadPdfmeConfigNormalizationSeverity;
  path: string;
  message: string;
  sourcePaths: string[];
};

export type SisadPdfmeConfigNormalizationResult = {
  config: SisadPdfmeGlobalConfig;
  issues: SisadPdfmeConfigNormalizationIssue[];
};

const isConfigRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const ensureObject = (root: Record<string, unknown>, key: string): Record<string, unknown> => {
  if (!isConfigRecord(root[key])) root[key] = {};
  return root[key] as Record<string, unknown>;
};

export const normalizeSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): SisadPdfmeConfigNormalizationResult => {
  const next = cloneDeep(input || {}) as Record<string, unknown>;
  const issues: SisadPdfmeConfigNormalizationIssue[] = [];

  next.configVersion = 2;
  const theme = ensureObject(next, 'theme');
  const sidebars = ensureObject(next, 'sidebars');
  const recipients = ensureObject(next, 'recipients');
  const collaboration = ensureObject(next, 'collaboration');

  next.theme = theme;
  next.sidebars = sidebars;
  next.recipients = recipients;
  next.collaboration = collaboration;
  return { config: next as SisadPdfmeGlobalConfig, issues };
};
