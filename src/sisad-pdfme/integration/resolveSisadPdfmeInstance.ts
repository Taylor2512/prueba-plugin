import { createDefaultTemplate } from '../templates/createDefaultTemplate.js';
import { createTemplateFromRecipe, type SisadPdfmeTemplateRecipe } from '../templates/createTemplateFromRecipe.js';
import type { Template } from '@sisad-pdfme/common';
import {
  normalizeHostData,
  type SisadPdfmeHostDataAdapters,
  type SisadPdfmeNormalizedHostData,
} from './normalizeHostData.js';
import {
  validateSisadPdfmeInstanceDefinition,
  type SisadPdfmeInstanceDefinitionIssue,
} from './validateSisadPdfmeInstanceDefinition.js';
import type {
  SisadPdfmeDocument,
  ResolvedSisadPdfmeConfig,
  SisadPdfmeController,
  SisadPdfmeGlobalConfig,
} from '../config/index.js';
import type {
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
} from '../recipients/index.js';
import type { SisadPdfmeAnyEvent } from '../contracts/events.js';

export type SisadPdfmeInstanceMode = 'designer' | 'form' | 'viewer';

export type SisadPdfmeInstanceStateInput = {
  template?: unknown | null;
  inputs?: unknown[] | null;
  recipients?: unknown[] | null;
  documents?: unknown[] | null;
  signatureProviders?: unknown[] | null;
  activeRecipientId?: string | null;
  activeDocumentId?: string | null;
};

export type SisadPdfmeInstanceStateFieldName = keyof SisadPdfmeInstanceStateInput;
export type SisadPdfmeInstanceStateChangeSource = 'user' | 'runtime' | 'host';
export type SisadPdfmeInstanceStateChange = {
  field: SisadPdfmeInstanceStateFieldName;
  fields?: SisadPdfmeInstanceStateFieldName[];
  source: SisadPdfmeInstanceStateChangeSource;
};

export type SisadPdfmeInstanceRuntimeState = Partial<SisadPdfmeInstanceStateInput>;

export type SisadPdfmeInstanceStateFieldSource =
  | 'state'
  | 'runtime'
  | 'defaultState'
  | 'definition'
  | 'resources'
  | 'fallback';

export type SisadPdfmeInstanceStateField<TValue> = {
  value: TValue;
  source: SisadPdfmeInstanceStateFieldSource;
};

export type SisadPdfmeInstanceState = {
  template: SisadPdfmeInstanceStateField<unknown>;
  inputs: SisadPdfmeInstanceStateField<unknown[]>;
  recipients: SisadPdfmeInstanceStateField<unknown[]>;
  documents: SisadPdfmeInstanceStateField<unknown[]>;
  signatureProviders: SisadPdfmeInstanceStateField<unknown[]>;
  activeRecipientId: SisadPdfmeInstanceStateField<string | null>;
  activeDocumentId: SisadPdfmeInstanceStateField<string | null>;
};

export type SisadPdfmeInstanceDefinition = {
  version?: number;
  mode?: SisadPdfmeInstanceMode | string | null;
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  state?: SisadPdfmeInstanceStateInput | null;
  defaultState?: SisadPdfmeInstanceStateInput | null;
  template?: unknown;
  templateKey?: string;
  templateRecipe?: SisadPdfmeTemplateRecipe | null;
  plugins?: Record<string, unknown> | null;
  inputs?: unknown[] | null;
  values?: unknown[] | null;
  recipients?: unknown[] | null;
  documents?: unknown[] | null;
  signatureProviders?: unknown[] | null;
  activeRecipientId?: string | null;
  activeDocumentId?: string | null;
};

export type SisadPdfmeInstanceResources = {
  templates?: Record<string, unknown> | null;
  state?: SisadPdfmeInstanceStateInput | null;
  defaultState?: SisadPdfmeInstanceStateInput | null;
  template?: unknown;
  templateRecipe?: SisadPdfmeTemplateRecipe | null;
  plugins?: Record<string, unknown> | null;
  inputs?: unknown[] | null;
  recipients?: unknown[] | null;
  documents?: unknown[] | null;
  signatureProviders?: unknown[] | null;
  adapters?: SisadPdfmeHostDataAdapters;
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
};

export type SisadPdfmeInstanceHandlers = {
  onTemplateChange?: (template: unknown) => void;
  onSave?: (template: unknown) => void;
  onControllerReady?: (controller: SisadPdfmeController) => void;
  onRecipientsChange?: (recipients: SisadPdfmeRecipient[]) => void;
  onActiveRecipientChange?: (recipient: SisadPdfmeRecipient | null) => void;
  onActiveDocumentChange?: (documentId: string | null, document: SisadPdfmeDocument | null) => void;
  onUploadedDocumentsChange?: (documents: SisadPdfmeDocument[], activeDocumentId: string | null) => void;
  onAssignmentChange?: (payload: SisadPdfmeAssignmentChangePayload) => void;
  onInputChange?: (payload: { index: number; name: string; value: unknown }) => void;
  onStateChange?: (nextState: SisadPdfmeInstanceStateInput, change: SisadPdfmeInstanceStateChange) => void;
  onEvent?: (event: SisadPdfmeAnyEvent) => void;
};

export type SisadPdfmeInstanceProps = {
  definition: SisadPdfmeInstanceDefinition;
  resources?: SisadPdfmeInstanceResources;
  handlers?: SisadPdfmeInstanceHandlers;
  className?: string;
  style?: React.CSSProperties;
};

export type SisadPdfmeInstanceResolution = {
  mode: SisadPdfmeInstanceMode;
  surface: SisadPdfmeInstanceMode;
  props: Record<string, unknown>;
  normalized: SisadPdfmeNormalizedHostData;
  state: SisadPdfmeInstanceState;
  issues: SisadPdfmeInstanceDefinitionIssue[];
  valid: boolean;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const mergeConfigs = (
  base?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig,
  override?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig,
) => {
  const deepMerge = <T extends Record<string, unknown>>(left: T, right?: Record<string, unknown>): T => {
    if (!isPlainObject(right)) return { ...left };
    const next = { ...left } as Record<string, unknown>;
    Object.entries(right).forEach(([key, value]) => {
      const current = next[key];
      if (isPlainObject(current) && isPlainObject(value)) {
        next[key] = deepMerge(current, value);
        return;
      }
      if (Array.isArray(value)) {
        next[key] = value.slice();
        return;
      }
      next[key] = value;
    });
    return next as T;
  };

  if (base && override && isPlainObject(base) && isPlainObject(override)) {
    return deepMerge(base, override);
  }
  return override ?? base;
};

const mergePluginMaps = (
  base?: Record<string, unknown> | null,
  override?: Record<string, unknown> | null,
) => ({
  ...(base || {}),
  ...(override || {}),
});

const resolveActiveDocumentTemplate = (
  documents: SisadPdfmeDocument[],
  activeDocumentId: string | null,
  fallbackTemplate: Template,
) => {
  const activeDocument = documents.find((document) => document.id === activeDocumentId) as {
    template?: unknown;
  } | null;
  const documentTemplate = activeDocument?.template;
  if (!documentTemplate || typeof documentTemplate !== 'object') {
    return fallbackTemplate;
  }
  return documentTemplate as Template;
};

const resolveInstanceState = (
  definition: SisadPdfmeInstanceDefinition,
  resources: SisadPdfmeInstanceResources,
  runtimeState: SisadPdfmeInstanceRuntimeState | null = null,
) => {
  const definitionState = definition.state ?? null;
  const resourceState = resources.state ?? null;
  const definitionDefaultState = definition.defaultState ?? null;
  const resourceDefaultState = resources.defaultState ?? null;

  const templateKey =
    typeof definition.template === 'string'
      ? definition.template
      : definition.templateKey?.trim();
  const recipe = definition.templateRecipe ?? resources.templateRecipe ?? null;

  const resolveField = <TValue>(
    candidates: Array<{ value: TValue | null | undefined; source: SisadPdfmeInstanceStateFieldSource }>,
    fallbackValue: TValue,
    options: { allowNull?: boolean } = {},
  ): SisadPdfmeInstanceStateField<TValue> => {
    for (const candidate of candidates) {
      if (candidate.value !== undefined) {
        if (candidate.value === null && !options.allowNull) {
          continue;
        }
        return { value: candidate.value as TValue, source: candidate.source };
      }
    }
    return { value: fallbackValue, source: 'fallback' };
  };

  return {
    template: resolveField(
      [
        { value: definitionState?.template, source: 'state' },
        { value: resourceState?.template, source: 'state' },
        { value: runtimeState?.template, source: 'runtime' },
        { value: definitionDefaultState?.template, source: 'defaultState' },
        { value: resourceDefaultState?.template, source: 'defaultState' },
        { value: definition.template !== undefined && typeof definition.template !== 'string' ? definition.template : undefined, source: 'definition' },
        {
          value: templateKey && isPlainObject(resources.templates) && templateKey in resources.templates
            ? resources.templates[templateKey]
            : undefined,
          source: 'resources',
        },
        { value: recipe ? createTemplateFromRecipe(recipe) : undefined, source: definition.templateRecipe ? 'definition' : 'resources' },
        { value: resources.template, source: 'resources' },
      ],
      createDefaultTemplate(),
    ),
    inputs: resolveField(
      [
        { value: definitionState?.inputs, source: 'state' },
        { value: resourceState?.inputs, source: 'state' },
        { value: runtimeState?.inputs, source: 'runtime' },
        { value: definitionDefaultState?.inputs, source: 'defaultState' },
        { value: resourceDefaultState?.inputs, source: 'defaultState' },
        { value: definition.values, source: 'definition' },
        { value: definition.inputs, source: 'definition' },
        { value: resources.inputs, source: 'resources' },
      ],
      [],
    ),
    recipients: resolveField(
      [
        { value: definitionState?.recipients, source: 'state' },
        { value: resourceState?.recipients, source: 'state' },
        { value: runtimeState?.recipients, source: 'runtime' },
        { value: definitionDefaultState?.recipients, source: 'defaultState' },
        { value: resourceDefaultState?.recipients, source: 'defaultState' },
        { value: definition.recipients, source: 'definition' },
        { value: resources.recipients, source: 'resources' },
      ],
      [],
    ),
    documents: resolveField(
      [
        { value: definitionState?.documents, source: 'state' },
        { value: resourceState?.documents, source: 'state' },
        { value: runtimeState?.documents, source: 'runtime' },
        { value: definitionDefaultState?.documents, source: 'defaultState' },
        { value: resourceDefaultState?.documents, source: 'defaultState' },
        { value: definition.documents, source: 'definition' },
        { value: resources.documents, source: 'resources' },
      ],
      [],
    ),
    signatureProviders: resolveField(
      [
        { value: definitionState?.signatureProviders, source: 'state' },
        { value: resourceState?.signatureProviders, source: 'state' },
        { value: runtimeState?.signatureProviders, source: 'runtime' },
        { value: definitionDefaultState?.signatureProviders, source: 'defaultState' },
        { value: resourceDefaultState?.signatureProviders, source: 'defaultState' },
        { value: definition.signatureProviders, source: 'definition' },
        { value: resources.signatureProviders, source: 'resources' },
      ],
      [],
    ),
    activeRecipientId: resolveField(
      [
        { value: definitionState?.activeRecipientId, source: 'state' },
        { value: resourceState?.activeRecipientId, source: 'state' },
        { value: runtimeState?.activeRecipientId, source: 'runtime' },
        { value: definitionDefaultState?.activeRecipientId, source: 'defaultState' },
        { value: resourceDefaultState?.activeRecipientId, source: 'defaultState' },
        { value: definition.activeRecipientId, source: 'definition' },
      ],
      '',
      { allowNull: true },
    ),
    activeDocumentId: resolveField(
      [
        { value: definitionState?.activeDocumentId, source: 'state' },
        { value: resourceState?.activeDocumentId, source: 'state' },
        { value: runtimeState?.activeDocumentId, source: 'runtime' },
        { value: definitionDefaultState?.activeDocumentId, source: 'defaultState' },
        { value: resourceDefaultState?.activeDocumentId, source: 'defaultState' },
        { value: definition.activeDocumentId, source: 'definition' },
      ],
      null,
      { allowNull: true },
    ),
  } satisfies SisadPdfmeInstanceState;
};

export const resolveSisadPdfmeInstance = ({
  definition,
  resources = {},
  handlers = {},
  className,
  style,
}: SisadPdfmeInstanceProps, runtimeState: SisadPdfmeInstanceRuntimeState | null = null): SisadPdfmeInstanceResolution => {
  const issues = validateSisadPdfmeInstanceDefinition(definition);
  const mode =
    definition.mode === 'designer' || definition.mode === 'form' || definition.mode === 'viewer'
      ? definition.mode
      : 'designer';
  const config = mergeConfigs(resources.config, definition.config);
  const state = resolveInstanceState(definition, resources, runtimeState);
  const template = (state.template.value ?? createDefaultTemplate()) as Template;
  const collaborationConfig = config as {
    collaboration?: {
      isGlobalView?: boolean;
    };
  };
  const isGlobalView = collaborationConfig?.collaboration?.isGlobalView === true;
  const normalizedActiveRecipientId =
    state.activeRecipientId.source === 'fallback' ? null : state.activeRecipientId.value;
  const normalized = normalizeHostData({
    template,
    inputs: state.inputs.value,
    recipients: state.recipients.value,
    documents: state.documents.value,
    signatureProviders: state.signatureProviders.value,
    activeRecipientId: normalizedActiveRecipientId,
    adapters: resources.adapters,
  });
  const activeRecipientId =
    state.activeRecipientId.source === 'fallback'
      ? (isGlobalView ? null : normalized.activeRecipientId)
      : state.activeRecipientId.value;
  const activeDocumentId = state.activeDocumentId.value ?? normalized.documents[0]?.id ?? null;
  const activeDocumentTemplate = resolveActiveDocumentTemplate(
    normalized.documents,
    activeDocumentId,
    normalized.template,
  );
  const plugins = mergePluginMaps(resources.plugins, definition.plugins);
  const sharedProps = {
    config,
    className,
    style,
  };

  if (mode === 'designer') {
    return {
      mode,
      surface: 'designer',
      normalized,
      state,
      issues,
      valid: issues.length === 0,
      props: {
        ...sharedProps,
        template: activeDocumentTemplate,
        documents: normalized.documents,
        recipients: normalized.recipients,
        activeRecipientId,
        activeDocumentId,
        signatureProviders: normalized.signatureProviders,
        plugins,
        onTemplateChange: handlers.onTemplateChange,
        onSave: handlers.onSave,
        onControllerReady: handlers.onControllerReady,
        onRecipientsChange: handlers.onRecipientsChange,
        onActiveRecipientChange: handlers.onActiveRecipientChange,
        onActiveDocumentChange: handlers.onActiveDocumentChange,
        onUploadedDocumentsChange: handlers.onUploadedDocumentsChange,
        onAssignmentChange: handlers.onAssignmentChange,
        onEvent: handlers.onEvent,
      },
    };
  }

  const runtimeProps = {
    ...sharedProps,
    template: activeDocumentTemplate,
    inputs: normalized.inputs,
    documents: normalized.documents,
    recipients: normalized.recipients,
    activeRecipientId,
    activeDocumentId,
    signatureProviders: normalized.signatureProviders,
    plugins,
  };

  return {
    mode,
    surface: mode,
    normalized,
    state,
    issues,
    valid: issues.length === 0,
    props:
      mode === 'form'
        ? {
            ...runtimeProps,
            onInputChange: handlers.onInputChange,
          }
        : runtimeProps,
  };
};
