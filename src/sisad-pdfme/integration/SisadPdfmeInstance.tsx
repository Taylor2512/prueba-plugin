import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SisadPdfmeDesigner, SisadPdfmeForm, SisadPdfmeViewer } from '../react/index.js';
import {
  resolveSisadPdfmeInstance,
  type SisadPdfmeInstanceMode,
  type SisadPdfmeInstanceStateChangeSource,
  type SisadPdfmeInstanceProps as SisadPdfmeResolvedInstanceProps,
  type SisadPdfmeInstanceResolution,
  type SisadPdfmeInstanceRuntimeState,
  type SisadPdfmeInstanceStateInput,
} from './resolveSisadPdfmeInstance.js';
import {
  defineSisadPdfmeInstance,
  type SisadPdfmeInstanceInput,
  type SisadPdfmeRegisteredInstance,
} from './defineSisadPdfmeInstance.js';
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

const buildNextState = (
  state: SisadPdfmeInstanceResolution['state'],
  field: keyof SisadPdfmeInstanceStateInput,
  value: unknown,
): SisadPdfmeInstanceStateInput => ({
  template: state.template.value,
  inputs: state.inputs.value,
  recipients: state.recipients.value,
  documents: state.documents.value,
  signatureProviders: state.signatureProviders.value,
  activeRecipientId: state.activeRecipientId.value,
  activeDocumentId: state.activeDocumentId.value,
  [field]: value,
});

const resolveRegisteredInstance = (
  props: SisadPdfmeInstanceInput,
): {
  instanceSignature: string;
  registeredInstance?: SisadPdfmeRegisteredInstance;
  resolvedProps: SisadPdfmeResolvedInstanceProps;
} => {
  if ('instance' in props) {
    const registeredInstance = defineSisadPdfmeInstance(props.instance);
    return {
      instanceSignature: `${registeredInstance.id}::${registeredInstance.revision ?? ''}`,
      registeredInstance,
      resolvedProps: {
        definition: registeredInstance.definition,
        resources: registeredInstance.resources,
        handlers: registeredInstance.handlers,
        className: props.className ?? registeredInstance.className,
        style: props.style ?? registeredInstance.style,
      },
    };
  }

  return {
    instanceSignature: 'legacy',
    resolvedProps: {
      definition: props.definition,
      resources: props.resources,
      handlers: props.handlers,
      className: props.className,
      style: props.style,
    },
  };
};

const isRegisteredInstanceInput = (
  props: SisadPdfmeInstanceInput,
): props is {
  instance: SisadPdfmeRegisteredInstance;
  className?: string;
  style?: React.CSSProperties;
} => 'instance' in props;

export type SisadPdfmeInstanceProps = SisadPdfmeInstanceInput;

const isFieldControlled = (
  definition: SisadPdfmeResolvedInstanceProps['definition'],
  resources: SisadPdfmeResolvedInstanceProps['resources'],
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
  SisadPdfmeInstanceResolution,
} from './resolveSisadPdfmeInstance.js';
export type {
  SisadPdfmeInstanceInput,
  SisadPdfmeRegisteredInstance,
} from './defineSisadPdfmeInstance.js';

export const useSisadPdfmeInstance = (
  props: SisadPdfmeInstanceInput,
): SisadPdfmeInstanceResolution & { Component: React.ComponentType<any> } =>
{
  const registeredInstance = isRegisteredInstanceInput(props) ? props.instance : undefined;
  const legacyProps = isRegisteredInstanceInput(props) ? undefined : props;
  const className = props.className;
  const style = props.style;

  const registration = useMemo(
    () => resolveRegisteredInstance(props),
    [registeredInstance, legacyProps, className, style],
  );
  const [runtimeState, setRuntimeState] = useState<SisadPdfmeInstanceRuntimeState>({});
  const [runtimeSignature, setRuntimeSignature] = useState(registration.instanceSignature);
  const effectiveRuntimeState =
    runtimeSignature === registration.instanceSignature ? runtimeState : {};
  const resolved = useMemo(
    () => resolveSisadPdfmeInstance(registration.resolvedProps, effectiveRuntimeState),
    [effectiveRuntimeState, registration.resolvedProps],
  );

  useEffect(() => {
    if (runtimeSignature === registration.instanceSignature) return;
    setRuntimeSignature(registration.instanceSignature);
    setRuntimeState({});
  }, [registration.instanceSignature, runtimeSignature]);

  const emitStateChange = useCallback(
    (
      field: keyof SisadPdfmeInstanceStateInput,
      value: unknown,
      source: SisadPdfmeInstanceStateChangeSource,
    ) => {
      registration.resolvedProps.handlers?.onStateChange?.(
        buildNextState(resolved.state, field, value),
        { field, source },
      );
    },
    [registration.resolvedProps.handlers, resolved.state],
  );

  const handleTemplateChange = useCallback(
    (template: unknown) => {
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'template')) {
        setRuntimeState((previous) => ({ ...previous, template }));
      }
      emitStateChange('template', template, 'user');
      registration.resolvedProps.handlers?.onTemplateChange?.(template);
    },
    [emitStateChange, registration.resolvedProps],
  );

  const handleSave = useCallback(
    (template: unknown) => {
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'template')) {
        setRuntimeState((previous) => ({ ...previous, template }));
      }
      registration.resolvedProps.handlers?.onSave?.(template);
    },
    [registration.resolvedProps],
  );

  const handleInputChange = useCallback(
    (payload: { index: number; name: string; value: unknown }) => {
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'inputs')) {
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
      emitStateChange('inputs', updateInputList(resolved.state.inputs.value, payload), 'user');
      registration.resolvedProps.handlers?.onInputChange?.(payload);
    },
    [emitStateChange, registration.resolvedProps, resolved.state.inputs.value],
  );

  const handleRecipientsChange = useCallback(
    (recipients: SisadPdfmeRecipient[]) => {
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'recipients')) {
        setRuntimeState((previous) => ({ ...previous, recipients }));
      }
      emitStateChange('recipients', recipients, 'user');
      registration.resolvedProps.handlers?.onRecipientsChange?.(recipients);
    },
    [emitStateChange, registration.resolvedProps],
  );

  const handleUploadedDocumentsChange = useCallback(
    (documents: SisadPdfmeDocument[], activeDocumentId: string | null) => {
      setRuntimeState((previous) => {
        const nextState = { ...previous };
        let changed = false;
        if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'documents')) {
          nextState.documents = documents;
          changed = true;
        }
        if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'activeDocumentId')) {
          nextState.activeDocumentId = activeDocumentId;
          changed = true;
        }
        return changed ? nextState : previous;
      });
      emitStateChange('documents', documents, 'user');
      emitStateChange('activeDocumentId', activeDocumentId, 'user');
      registration.resolvedProps.handlers?.onUploadedDocumentsChange?.(documents, activeDocumentId);
    },
    [emitStateChange, registration.resolvedProps],
  );

  const handleActiveRecipientChange = useCallback(
    (recipient: SisadPdfmeRecipient | null) => {
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'activeRecipientId')) {
        setRuntimeState((previous) => ({
          ...previous,
          activeRecipientId: recipient?.id ?? null,
        }));
      }
      emitStateChange('activeRecipientId', recipient?.id ?? null, 'user');
      registration.resolvedProps.handlers?.onActiveRecipientChange?.(recipient);
    },
    [emitStateChange, registration.resolvedProps],
  );

  const handleAssignmentChange = useCallback(
    (payload: SisadPdfmeAssignmentChangePayload) => {
      registration.resolvedProps.handlers?.onAssignmentChange?.(payload);
    },
    [registration.resolvedProps],
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
