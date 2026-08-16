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

const pushNormalizationIssue = (
  issues: SisadPdfmeConfigNormalizationIssue[],
  issue: SisadPdfmeConfigNormalizationIssue,
) => {
  if (issues.some((current) => current.code === issue.code && current.path === issue.path && current.message === issue.message)) return;
  issues.push(issue);
};

const normalizeConfigPath = (
  target: Record<string, unknown>,
  targetPath: string,
  value: unknown,
  sourcePath: string,
  issues: SisadPdfmeConfigNormalizationIssue[],
  severity: SisadPdfmeConfigNormalizationSeverity = 'info',
) => {
  if (value === undefined) return;
  if (target[targetPath] === undefined) {
    target[targetPath] = cloneDeep(value);
    pushNormalizationIssue(issues, {
      code: 'config-path-normalized',
      severity,
      path: targetPath,
      message: `${sourcePath} normalizado a ${targetPath}`,
      sourcePaths: [sourcePath, targetPath],
    });
    return;
  }
  pushNormalizationIssue(issues, {
    code: 'config-target-path-preserved',
    severity: 'warning',
    path: targetPath,
    message: `${targetPath} tiene prioridad sobre ${sourcePath}`,
    sourcePaths: [targetPath, sourcePath],
  });
};

export const normalizeSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): SisadPdfmeConfigNormalizationResult => {
  const next = cloneDeep(input || {}) as Record<string, unknown>;
  const issues: SisadPdfmeConfigNormalizationIssue[] = [];

  next.configVersion = 2;
  const ui = isConfigRecord(next.ui) ? next.ui : undefined;
  const theme = ensureObject(next, 'theme');
  const sidebars = ensureObject(next, 'sidebars');
  const leftSidebar = ensureObject(sidebars, 'left');
  const rightSidebar = ensureObject(sidebars, 'right');
  const recipients = ensureObject(next, 'recipients');
  const collaboration = ensureObject(next, 'collaboration');

  normalizeConfigPath(next, 'visibility', next.visibility, 'visibility', issues);
  if (ui) {
    normalizeConfigPath(next, 'visibility', ui.visibility, 'ui.visibility', issues);
    normalizeConfigPath(theme, 'density', ui.density, 'ui.density', issues);
    if (isConfigRecord(ui.sidebars)) {
      const left = ui.sidebars.left;
      const right = ui.sidebars.right;
      if (isConfigRecord(left)) {
        normalizeConfigPath(leftSidebar, 'defaultOpen', left.defaultOpen, 'ui.sidebars.left.defaultOpen', issues);
        normalizeConfigPath(leftSidebar, 'catalogLayout', left.catalogLayout, 'ui.sidebars.left.catalogLayout', issues);
      }
      if (isConfigRecord(right)) {
        normalizeConfigPath(rightSidebar, 'defaultOpen', right.defaultOpen, 'ui.sidebars.right.defaultOpen', issues);
        normalizeConfigPath(rightSidebar, 'defaultPanel', right.defaultPanel, 'ui.sidebars.right.defaultPanel', issues);
      }
    }
  }
  normalizeConfigPath(recipients, 'activeRecipientId', collaboration.activeRecipientId, 'collaboration.activeRecipientId', issues);

  next.theme = theme;
  next.sidebars = sidebars;
  next.recipients = recipients;
  next.collaboration = collaboration;
  return { config: next as SisadPdfmeGlobalConfig, issues };
};
