import { createDefaultTemplate } from '../templates/createDefaultTemplate.js';
import { createTemplateFromRecipe, type SisadPdfmeTemplateRecipe } from '../templates/createTemplateFromRecipe.js';
import {
  normalizeHostData,
  type SisadPdfmeHostDataAdapters,
  type SisadPdfmeNormalizedHostData,
} from './normalizeHostData.js';
import type {
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
};

export type SisadPdfmeInstanceStateFieldSource =
  | 'state'
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
};

export type SisadPdfmeInstanceDefinition = {
  version?: number;
  mode?: SisadPdfmeInstanceMode;
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  state?: SisadPdfmeInstanceStateInput | null;
  defaultState?: SisadPdfmeInstanceStateInput | null;
  template?: unknown;
  templateKey?: string;
  templateRecipe?: SisadPdfmeTemplateRecipe | null;
  inputs?: unknown[] | null;
  values?: unknown[] | null;
  recipients?: unknown[] | null;
  documents?: unknown[] | null;
  signatureProviders?: unknown[] | null;
  activeRecipientId?: string | null;
};

export type SisadPdfmeInstanceResources = {
  templates?: Record<string, unknown> | null;
  state?: SisadPdfmeInstanceStateInput | null;
  defaultState?: SisadPdfmeInstanceStateInput | null;
  template?: unknown;
  templateRecipe?: SisadPdfmeTemplateRecipe | null;
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
  onAssignmentChange?: (payload: SisadPdfmeAssignmentChangePayload) => void;
  onInputChange?: (payload: { index: number; name: string; value: unknown }) => void;
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
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const mergeConfigs = (
  base?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig,
  override?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig,
) => {
  if (base && override && isPlainObject(base) && isPlainObject(override)) {
    return { ...base, ...override };
  }
  return override ?? base;
};

const resolveInstanceState = (
  definition: SisadPdfmeInstanceDefinition,
  resources: SisadPdfmeInstanceResources,
) => {
  const controlledState = definition.state ?? resources.state ?? null;
  const defaultState = definition.defaultState ?? resources.defaultState ?? null;

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
        { value: controlledState?.template, source: 'state' },
        { value: defaultState?.template, source: 'defaultState' },
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
        { value: controlledState?.inputs, source: 'state' },
        { value: defaultState?.inputs, source: 'defaultState' },
        { value: definition.values, source: 'definition' },
        { value: definition.inputs, source: 'definition' },
        { value: resources.inputs, source: 'resources' },
      ],
      [],
    ),
    recipients: resolveField(
      [
        { value: controlledState?.recipients, source: 'state' },
        { value: defaultState?.recipients, source: 'defaultState' },
        { value: definition.recipients, source: 'definition' },
        { value: resources.recipients, source: 'resources' },
      ],
      [],
    ),
    documents: resolveField(
      [
        { value: controlledState?.documents, source: 'state' },
        { value: defaultState?.documents, source: 'defaultState' },
        { value: definition.documents, source: 'definition' },
        { value: resources.documents, source: 'resources' },
      ],
      [],
    ),
    signatureProviders: resolveField(
      [
        { value: controlledState?.signatureProviders, source: 'state' },
        { value: defaultState?.signatureProviders, source: 'defaultState' },
        { value: definition.signatureProviders, source: 'definition' },
        { value: resources.signatureProviders, source: 'resources' },
      ],
      [],
    ),
    activeRecipientId: resolveField(
      [
        { value: controlledState?.activeRecipientId, source: 'state' },
        { value: defaultState?.activeRecipientId, source: 'defaultState' },
        { value: definition.activeRecipientId, source: 'definition' },
      ],
      '',
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
}: SisadPdfmeInstanceProps): SisadPdfmeInstanceResolution => {
  const mode = definition.mode ?? 'designer';
  const state = resolveInstanceState(definition, resources);
  const template = state.template.value ?? createDefaultTemplate();
  const normalized = normalizeHostData({
    template,
    inputs: state.inputs.value,
    recipients: state.recipients.value,
    documents: state.documents.value,
    signatureProviders: state.signatureProviders.value,
    activeRecipientId: state.activeRecipientId.value,
    adapters: resources.adapters,
  });

  const config = mergeConfigs(resources.config, definition.config);
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
      props: {
        ...sharedProps,
        template: normalized.template,
        documents: normalized.documents,
        recipients: normalized.recipients,
        activeRecipientId: normalized.activeRecipientId,
        onTemplateChange: handlers.onTemplateChange,
        onSave: handlers.onSave,
        onControllerReady: handlers.onControllerReady,
        onRecipientsChange: handlers.onRecipientsChange,
        onActiveRecipientChange: handlers.onActiveRecipientChange,
        onAssignmentChange: handlers.onAssignmentChange,
        onEvent: handlers.onEvent,
      },
    };
  }

  const runtimeProps = {
    ...sharedProps,
    template: normalized.template,
    inputs: normalized.inputs,
    recipients: normalized.recipients,
    activeRecipientId: normalized.activeRecipientId,
  };

  return {
    mode,
    surface: mode,
    normalized,
    state,
    props:
      mode === 'form'
        ? {
            ...runtimeProps,
            onInputChange: handlers.onInputChange,
          }
        : runtimeProps,
  };
};
