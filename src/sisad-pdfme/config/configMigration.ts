import { cloneDeep } from '@sisad-pdfme/common';
import type { SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';

export type SisadPdfmeConfigMigrationSeverity = 'info' | 'warning';

export type SisadPdfmeConfigMigrationIssue = {
  code: string;
  severity: SisadPdfmeConfigMigrationSeverity;
  path: string;
  message: string;
  sourcePaths: string[];
};

export type SisadPdfmeConfigMigrationResult = {
  config: SisadPdfmeGlobalConfig;
  issues: SisadPdfmeConfigMigrationIssue[];
};

const isMigrationRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const ensureObject = (root: Record<string, unknown>, key: string): Record<string, unknown> => {
  if (!isMigrationRecord(root[key])) {
    root[key] = {};
  }
  return root[key] as Record<string, unknown>;
};

const pushMigrationIssue = (
  issues: SisadPdfmeConfigMigrationIssue[],
  issue: SisadPdfmeConfigMigrationIssue,
) => {
  if (issues.some((current) => current.code === issue.code && current.path === issue.path && current.message === issue.message)) {
    return;
  }
  issues.push(issue);
};

const moveLegacyValue = (
  target: Record<string, unknown>,
  canonicalPath: string,
  value: unknown,
  legacyPath: string,
  issues: SisadPdfmeConfigMigrationIssue[],
  severity: SisadPdfmeConfigMigrationSeverity = 'info',
) => {
  if (value === undefined) return;
  const existing = target[canonicalPath];
  if (existing === undefined) {
    target[canonicalPath] = cloneDeep(value);
    pushMigrationIssue(issues, {
      code: 'config-legacy-migrated',
      severity,
      path: canonicalPath,
      message: `${legacyPath} migrado a ${canonicalPath}`,
      sourcePaths: [legacyPath, canonicalPath],
    });
    return;
  }
  pushMigrationIssue(issues, {
    code: 'config-canonical-wins',
    severity: 'warning',
    path: canonicalPath,
    message: `${canonicalPath} tiene prioridad sobre ${legacyPath}`,
    sourcePaths: [canonicalPath, legacyPath],
  });
};

export const migrateSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): SisadPdfmeConfigMigrationResult => {
  const next = cloneDeep(input || {}) as Record<string, unknown>;
  const issues: SisadPdfmeConfigMigrationIssue[] = [];

  next.configVersion = 2;

  const ui = isMigrationRecord(next.ui) ? (next.ui as Record<string, unknown>) : undefined;
  const theme = ensureObject(next, 'theme');
  const sidebars = ensureObject(next, 'sidebars');
  const leftSidebar = ensureObject(sidebars, 'left');
  const rightSidebar = ensureObject(sidebars, 'right');
  const recipients = ensureObject(next, 'recipients');
  const collaboration = ensureObject(next, 'collaboration');

  moveLegacyValue(next, 'visibility', next.visibility, 'visibility', issues);
  if (ui) {
    moveLegacyValue(next, 'visibility', ui.visibility, 'ui.visibility', issues);
    moveLegacyValue(theme, 'density', ui.density, 'ui.density', issues);

    if (isMigrationRecord(ui.sidebars)) {
      const legacyLeft = ui.sidebars.left;
      const legacyRight = ui.sidebars.right;
      if (isMigrationRecord(legacyLeft)) {
        moveLegacyValue(leftSidebar, 'defaultOpen', legacyLeft.defaultOpen, 'ui.sidebars.left.defaultOpen', issues);
        moveLegacyValue(leftSidebar, 'catalogLayout', legacyLeft.catalogLayout, 'ui.sidebars.left.catalogLayout', issues);
      }
      if (isMigrationRecord(legacyRight)) {
        moveLegacyValue(rightSidebar, 'defaultOpen', legacyRight.defaultOpen, 'ui.sidebars.right.defaultOpen', issues);
        moveLegacyValue(rightSidebar, 'defaultPanel', legacyRight.defaultPanel, 'ui.sidebars.right.defaultPanel', issues);
      }
    }
  }

  moveLegacyValue(recipients, 'activeRecipientId', collaboration.activeRecipientId, 'collaboration.activeRecipientId', issues);

  next.theme = theme;
  next.sidebars = sidebars;
  next.recipients = recipients;
  next.collaboration = collaboration;

  return {
    config: next as SisadPdfmeGlobalConfig,
    issues,
  };
};
