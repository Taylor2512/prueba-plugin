import type { SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';
import { migrateSisadPdfmeConfig } from './configMigration.js';
import { normalizeLooseText } from '../shared/text.js';

export type SisadPdfmeConfigIssueSeverity = 'error' | 'warning';

export type SisadPdfmeConfigIssue = {
  code: string;
  severity: SisadPdfmeConfigIssueSeverity;
  path: string;
  message: string;
  sourcePaths: string[];
};

const pushValidationIssue = (issues: SisadPdfmeConfigIssue[], issue: SisadPdfmeConfigIssue) => {
  if (
    issues.some(
      (current) =>
        current.code === issue.code &&
        current.path === issue.path &&
        current.message === issue.message,
    )
  ) {
    return;
  }
  issues.push(issue);
};

const getStringId = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : normalizeLooseText(value);

export const validateSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): SisadPdfmeConfigIssue[] => {
  const { config } = migrateSisadPdfmeConfig(input);
  const issues: SisadPdfmeConfigIssue[] = [];

  const signatures = config.signatures || {};
  if (signatures.defaultMode === 'provider' && !(signatures.providers || []).length) {
    pushValidationIssue(issues, {
      code: 'signatures-provider-missing',
      severity: 'error',
      path: 'signatures.providers',
      message: 'signatures.defaultMode=provider requiere al menos un provider',
      sourcePaths: ['signatures.defaultMode', 'signatures.providers'],
    });
  }

  const persistence = config.persistence || {};
  if (persistence.autosave === true && persistence.mode === 'none') {
    pushValidationIssue(issues, {
      code: 'persistence-autosave-without-backend',
      severity: 'warning',
      path: 'persistence.autosave',
      message: 'autosave=true sin persistence.mode local/host no persistirá cambios',
      sourcePaths: ['persistence.autosave', 'persistence.mode'],
    });
  }

  const panels = config.sidebars?.right?.panels || [];
  const defaultPanel = config.sidebars?.right?.defaultPanel;
  if (defaultPanel && panels.length && !panels.includes(defaultPanel)) {
    pushValidationIssue(issues, {
      code: 'sidebar-default-panel-not-listed',
      severity: 'warning',
      path: 'sidebars.right.defaultPanel',
      message: 'defaultPanel debe existir dentro de sidebars.right.panels',
      sourcePaths: ['sidebars.right.defaultPanel', 'sidebars.right.panels'],
    });
  }

  const plugins = Array.isArray(config.schemas?.plugins) ? config.schemas?.plugins : [];
  const seenPluginIds = new Map<string, number>();
  plugins.forEach((plugin, index) => {
    const record = plugin && typeof plugin === 'object' ? (plugin as Record<string, unknown>) : {};
    const pluginId = getStringId(record.type || record.key || record.id || '');
    if (!pluginId) return;
    const previousIndex = seenPluginIds.get(pluginId);
    if (previousIndex !== undefined) {
      pushValidationIssue(issues, {
        code: 'schema-plugin-duplicate',
        severity: 'warning',
        path: `schemas.plugins[${index}]`,
        message: `plugin duplicado: ${pluginId}`,
        sourcePaths: [`schemas.plugins[${previousIndex}]`, `schemas.plugins[${index}]`],
      });
      return;
    }
    seenPluginIds.set(pluginId, index);
  });

  if (config.documents?.mode === 'single' && config.documents.preserveDocumentSchemaRouting === false) {
    pushValidationIssue(issues, {
      code: 'documents-routing-disabled',
      severity: 'warning',
      path: 'documents.preserveDocumentSchemaRouting',
      message: 'single document mode normalmente requiere preservar el ruteo por documento',
      sourcePaths: ['documents.mode', 'documents.preserveDocumentSchemaRouting'],
    });
  }

  return issues;
};
