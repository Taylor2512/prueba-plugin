import type { SisadPdfmeInstanceDefinition, SisadPdfmeInstanceMode } from '@sisad-pdfme/integration/resolveSisadPdfmeInstance';

export type SisadPdfmeInstanceDefinitionIssueSeverity = 'error' | 'warning';

export type SisadPdfmeInstanceDefinitionIssue = {
  code: string;
  severity: SisadPdfmeInstanceDefinitionIssueSeverity;
  path: string;
  message: string;
  sourcePaths: string[];
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const pushIssue = (
  issues: SisadPdfmeInstanceDefinitionIssue[],
  issue: SisadPdfmeInstanceDefinitionIssue,
) => {
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

const isMode = (value: unknown): value is SisadPdfmeInstanceMode =>
  value === 'designer' || value === 'form' || value === 'viewer';

const isOptionalString = (value: unknown) =>
  value === undefined || value === null || typeof value === 'string';

export const validateSisadPdfmeInstanceDefinition = (
  definition: SisadPdfmeInstanceDefinition | null | undefined,
): SisadPdfmeInstanceDefinitionIssue[] => {
  const issues: SisadPdfmeInstanceDefinitionIssue[] = [];
  if (!isPlainObject(definition)) {
    pushIssue(issues, {
      code: 'instance-definition-invalid',
      severity: 'error',
      path: '',
      message: 'la definición de instancia debe ser un objeto',
      sourcePaths: [],
    });
    return issues;
  }

  if (definition.mode !== undefined && !isMode(definition.mode)) {
    pushIssue(issues, {
      code: 'instance-mode-invalid',
      severity: 'error',
      path: 'mode',
      message: 'mode debe ser designer, form o viewer',
      sourcePaths: ['mode'],
    });
  }

  if (definition.version !== undefined && (!Number.isFinite(definition.version) || definition.version < 0)) {
    pushIssue(issues, {
      code: 'instance-version-invalid',
      severity: 'warning',
      path: 'version',
      message: 'version debe ser un número finito no negativo',
      sourcePaths: ['version'],
    });
  }

  if (definition.state !== undefined && definition.state !== null && !isPlainObject(definition.state)) {
    pushIssue(issues, {
      code: 'instance-state-invalid',
      severity: 'error',
      path: 'state',
      message: 'state debe ser un objeto o null',
      sourcePaths: ['state'],
    });
  }

  if (definition.defaultState !== undefined && definition.defaultState !== null && !isPlainObject(definition.defaultState)) {
    pushIssue(issues, {
      code: 'instance-default-state-invalid',
      severity: 'error',
      path: 'defaultState',
      message: 'defaultState debe ser un objeto o null',
      sourcePaths: ['defaultState'],
    });
  }

  if (definition.templateRecipe !== undefined && definition.templateRecipe !== null && !isPlainObject(definition.templateRecipe)) {
    pushIssue(issues, {
      code: 'instance-template-recipe-invalid',
      severity: 'error',
      path: 'templateRecipe',
      message: 'templateRecipe debe ser un objeto o null',
      sourcePaths: ['templateRecipe'],
    });
  }

  if (definition.templateKey !== undefined && !isOptionalString(definition.templateKey)) {
    pushIssue(issues, {
      code: 'instance-template-key-invalid',
      severity: 'error',
      path: 'templateKey',
      message: 'templateKey debe ser texto, null o undefined',
      sourcePaths: ['templateKey'],
    });
  }

  if (definition.activeDocumentId !== undefined && !isOptionalString(definition.activeDocumentId)) {
    pushIssue(issues, {
      code: 'instance-active-document-id-invalid',
      severity: 'error',
      path: 'activeDocumentId',
      message: 'activeDocumentId debe ser texto, null o undefined',
      sourcePaths: ['activeDocumentId'],
    });
  }

  return issues;
};
