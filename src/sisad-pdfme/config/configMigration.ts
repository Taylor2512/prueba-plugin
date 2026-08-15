import { cloneDeep } from '@sisad-pdfme/common';
import type { SisadPdfmeGlobalConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';

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

const migrateConfigPath = (
  target: Record<string, unknown>,
  targetPath: string,
  value: unknown,
  sourcePath: string,
  issues: SisadPdfmeConfigMigrationIssue[],
  severity: SisadPdfmeConfigMigrationSeverity = 'info',
) => {
  if (value === undefined) return;
  const existing = target[targetPath];
  if (existing === undefined) {
    target[targetPath] = cloneDeep(value);
    pushMigrationIssue(issues, {
      code: 'config-path-migrated',
      severity,
      path: targetPath,
      message: `${sourcePath} migrado a ${targetPath}`,
      sourcePaths: [sourcePath, targetPath],
    });
    return;
  }
  pushMigrationIssue(issues, {
    code: 'config-target-path-preserved',
    severity: 'warning',
    path: targetPath,
    message: `${targetPath} tiene prioridad sobre ${sourcePath}`,
    sourcePaths: [targetPath, sourcePath],
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

  migrateConfigPath(next, 'visibility', next.visibility, 'visibility', issues);
  if (ui) {
    migrateConfigPath(next, 'visibility', ui.visibility, 'ui.visibility', issues);
    migrateConfigPath(theme, 'density', ui.density, 'ui.density', issues);

    if (isMigrationRecord(ui.sidebars)) {
      const Left = ui.sidebars.left;
      const Right = ui.sidebars.right;
      if (isMigrationRecord(Left)) {
        migrateConfigPath(leftSidebar, 'defaultOpen', Left.defaultOpen, 'ui.sidebars.left.defaultOpen', issues);
        migrateConfigPath(leftSidebar, 'catalogLayout', Left.catalogLayout, 'ui.sidebars.left.catalogLayout', issues);
      }
      if (isMigrationRecord(Right)) {
        migrateConfigPath(rightSidebar, 'defaultOpen', Right.defaultOpen, 'ui.sidebars.right.defaultOpen', issues);
        migrateConfigPath(rightSidebar, 'defaultPanel', Right.defaultPanel, 'ui.sidebars.right.defaultPanel', issues);
      }
    }
  }

  migrateConfigPath(recipients, 'activeRecipientId', collaboration.activeRecipientId, 'collaboration.activeRecipientId', issues);

  next.theme = theme;
  next.sidebars = sidebars;
  next.recipients = recipients;
  next.collaboration = collaboration;

  return {
    config: next as SisadPdfmeGlobalConfig,
    issues,
  };
};
