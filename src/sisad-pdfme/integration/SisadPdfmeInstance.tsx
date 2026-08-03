import React, { useCallback, useMemo, useState } from 'react';
import { SisadPdfmeDesigner, SisadPdfmeForm, SisadPdfmeViewer } from '../react/index.js';
import {
  resolveSisadPdfmeInstance,
  type SisadPdfmeInstanceMode,
  type SisadPdfmeInstanceProps,
  type SisadPdfmeInstanceResolution,
  type SisadPdfmeInstanceRuntimeState,
} from './resolveSisadPdfmeInstance.js';
import type {
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
} from '../recipients/index.js';
import type { SisadPdfmeDocument } from '../config/index.js';

const SURFACES: Record<SisadPdfmeInstanceMode, React.ComponentType<any>> = {
  designer: SisadPdfmeDesigner,
  form: SisadPdfmeForm,
  viewer: SisadPdfmeViewer,
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const updateInputList = (
  inputs: unknown[],
  payload: { index: number; name: string; value: unknown },
) => {
  const nextInputs = inputs.slice();
  const currentInput = nextInputs[payload.index];
  const nextInput = isPlainObject(currentInput) ? { ...currentInput } : {};
  nextInput[payload.name] = payload.value;
  nextInputs[payload.index] = nextInput;
  return nextInputs;
};

const isFieldControlled = (
  definition: SisadPdfmeInstanceProps['definition'],
  resources: SisadPdfmeInstanceProps['resources'],
  field: keyof SisadPdfmeInstanceRuntimeState,
) => {
  const definitionState = definition.state ?? null;
  const resourceState = resources?.state ?? null;
  const isAllowedNull = field === 'activeRecipientId' || field === 'activeDocumentId';
  const isProvided = (value: unknown) =>
    value !== undefined && (isAllowedNull || value !== null);

  return isProvided(definitionState?.[field]) || isProvided(resourceState?.[field]);
};

export { resolveSisadPdfmeInstance };
export type {
  SisadPdfmeInstanceMode,
  SisadPdfmeInstanceProps,
  SisadPdfmeInstanceResolution,
} from './resolveSisadPdfmeInstance.js';

export const useSisadPdfmeInstance = (
  props: SisadPdfmeInstanceProps,
): SisadPdfmeInstanceResolution & { Component: React.ComponentType<any> } =>
{
  const [runtimeState, setRuntimeState] = useState<SisadPdfmeInstanceRuntimeState>({});
  const resolved = useMemo(
    () => resolveSisadPdfmeInstance(props, runtimeState),
    [props, runtimeState],
  );

  const handleTemplateChange = useCallback(
    (template: unknown) => {
      if (!isFieldControlled(props.definition, props.resources, 'template')) {
        setRuntimeState((previous) => ({ ...previous, template }));
      }
      props.handlers?.onTemplateChange?.(template);
    },
    [props],
  );

  const handleSave = useCallback(
    (template: unknown) => {
      if (!isFieldControlled(props.definition, props.resources, 'template')) {
        setRuntimeState((previous) => ({ ...previous, template }));
      }
      props.handlers?.onSave?.(template);
    },
    [props],
  );

  const handleInputChange = useCallback(
    (payload: { index: number; name: string; value: unknown }) => {
      if (!isFieldControlled(props.definition, props.resources, 'inputs')) {
        setRuntimeState((previous) => {
          const baseInputs = Array.isArray(previous.inputs)
            ? previous.inputs
            : resolved.state.inputs.value;
          return {
            ...previous,
            inputs: updateInputList(Array.isArray(baseInputs) ? baseInputs : [], payload),
          };
        });
      }
      props.handlers?.onInputChange?.(payload);
    },
    [props, resolved.state.inputs.value],
  );

  const handleRecipientsChange = useCallback(
    (recipients: SisadPdfmeRecipient[]) => {
      if (!isFieldControlled(props.definition, props.resources, 'recipients')) {
        setRuntimeState((previous) => ({ ...previous, recipients }));
      }
      props.handlers?.onRecipientsChange?.(recipients);
    },
    [props],
  );

  const handleUploadedDocumentsChange = useCallback(
    (documents: SisadPdfmeDocument[], activeDocumentId: string | null) => {
      setRuntimeState((previous) => {
        const nextState = { ...previous };
        let changed = false;
        if (!isFieldControlled(props.definition, props.resources, 'documents')) {
          nextState.documents = documents;
          changed = true;
        }
        if (!isFieldControlled(props.definition, props.resources, 'activeDocumentId')) {
          nextState.activeDocumentId = activeDocumentId;
          changed = true;
        }
        return changed ? nextState : previous;
      });
      props.handlers?.onUploadedDocumentsChange?.(documents, activeDocumentId);
    },
    [props],
  );

  const handleActiveRecipientChange = useCallback(
    (recipient: SisadPdfmeRecipient | null) => {
      if (!isFieldControlled(props.definition, props.resources, 'activeRecipientId')) {
        setRuntimeState((previous) => ({
          ...previous,
          activeRecipientId: recipient?.id ?? null,
        }));
      }
      props.handlers?.onActiveRecipientChange?.(recipient);
    },
    [props],
  );

  const handleAssignmentChange = useCallback(
    (payload: SisadPdfmeAssignmentChangePayload) => {
      props.handlers?.onAssignmentChange?.(payload);
    },
    [props],
  );

  return {
    ...resolved,
    Component: SURFACES[resolved.surface],
    props: {
      ...resolved.props,
      ...(resolved.surface === 'designer'
          ? {
            onTemplateChange: handleTemplateChange,
            onSave: handleSave,
            onRecipientsChange: handleRecipientsChange,
            onActiveRecipientChange: handleActiveRecipientChange,
            onUploadedDocumentsChange: handleUploadedDocumentsChange,
            onAssignmentChange: handleAssignmentChange,
          }
        : {}),
      ...(resolved.surface === 'form' ? { onInputChange: handleInputChange } : {}),
    },
  };
};

export const SisadPdfmeInstance = (props: SisadPdfmeInstanceProps) => {
  const { Component, props: resolvedProps } = useSisadPdfmeInstance(props);
  return <Component {...resolvedProps} />;
};
