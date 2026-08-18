/**
 * useSisadPdfmeInstance — resolución de una instancia de sisad-pdfme.
 *
 * Separado de `SisadPdfmeInstance.tsx` porque un hook no es un componente y
 * convivir en el mismo módulo rompía el Fast Refresh del wrapper
 * (`react-refresh/only-export-components`).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SisadPdfmeDesigner, SisadPdfmeForm, SisadPdfmeViewer } from '@sisad-pdfme/react';
import {
  resolveSisadPdfmeInstance,
  type SisadPdfmeInstanceMode,
  type SisadPdfmeInstanceStateChangeSource,
  type SisadPdfmeInstanceProps as SisadPdfmeResolvedInstanceProps,
  type SisadPdfmeInstanceResolution,
  type SisadPdfmeInstanceRuntimeState,
  type SisadPdfmeInstanceStateInput,
} from '@sisad-pdfme/integration/resolveSisadPdfmeInstance';
import {
  defineSisadPdfmeInstance,
  type SisadPdfmeInstanceInput,
} from '@sisad-pdfme/integration/defineSisadPdfmeInstance';
import type {
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
} from '@sisad-pdfme/recipients';
import type { SisadPdfmeDocument } from '@sisad-pdfme/config';
import {
  createExecutionScopeStore,
  SHARED_SCOPE_USER,
  type RuntimeScope,
} from '@sisad-pdfme/runtime/executionScopeStore';
import {
  commitScopedInput,
  deriveSchemaValueScopes,
  projectScopedInputs,
} from '@sisad-pdfme/runtime/scopedInputProjection';

type SisadPdfmeSurfaceProps = Record<string, unknown>;

const SURFACES = {
  designer: SisadPdfmeDesigner,
  form: SisadPdfmeForm,
  viewer: SisadPdfmeViewer,
} as unknown as Record<SisadPdfmeInstanceMode, React.ComponentType<SisadPdfmeSurfaceProps>>;

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

const buildStateSnapshot = (
  state: SisadPdfmeInstanceResolution['state'],
  runtimeState: SisadPdfmeInstanceRuntimeState,
): SisadPdfmeInstanceStateInput => ({
  template: runtimeState.template !== undefined ? runtimeState.template : state.template.value,
  inputs: runtimeState.inputs !== undefined ? runtimeState.inputs : state.inputs.value,
  recipients: runtimeState.recipients !== undefined ? runtimeState.recipients : state.recipients.value,
  documents: runtimeState.documents !== undefined ? runtimeState.documents : state.documents.value,
  signatureProviders:
    runtimeState.signatureProviders !== undefined
      ? runtimeState.signatureProviders
      : state.signatureProviders.value,
  activeRecipientId:
    runtimeState.activeRecipientId !== undefined
      ? runtimeState.activeRecipientId
      : state.activeRecipientId.value,
  activeDocumentId:
    runtimeState.activeDocumentId !== undefined
      ? runtimeState.activeDocumentId
      : state.activeDocumentId.value,
});

const buildRegisteredInstance = (
  props: SisadPdfmeInstanceInput,
): {
  stateKey: string;
  resolvedProps: SisadPdfmeResolvedInstanceProps;
} => {
  if ('instance' in props) {
    const registeredInstance = defineSisadPdfmeInstance(props.instance);
    return {
      stateKey: `${registeredInstance.id}::${registeredInstance.revision ?? ''}`,
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
    stateKey: `direct::${String(props.instanceKey ?? 'direct')}`,
    resolvedProps: {
      definition: props.definition,
      resources: props.resources,
      handlers: props.handlers,
      className: props.className,
      style: props.style,
    },
  };
};

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
} from '@sisad-pdfme/integration/resolveSisadPdfmeInstance';
export type {
  SisadPdfmeInstanceInput,
  SisadPdfmeRegisteredInstance,
} from '@sisad-pdfme/integration/defineSisadPdfmeInstance';

export const useSisadPdfmeInstance = (
  props: SisadPdfmeInstanceInput,
): SisadPdfmeInstanceResolution & { Component: React.ComponentType<SisadPdfmeSurfaceProps> } =>
{
  const registration = useMemo(() => buildRegisteredInstance(props), [props]);
  const resolvedProps = useMemo(
    () => ({
      ...registration.resolvedProps,
      className: props.className ?? registration.resolvedProps.className,
      style: props.style ?? registration.resolvedProps.style,
    }),
    [props.className, props.style, registration],
  );
  const [runtimeState, setRuntimeState] = useState<SisadPdfmeInstanceRuntimeState>({});
  const runtimeStateRef = useRef<SisadPdfmeInstanceRuntimeState>({});
  const [runtimeStateKey, setRuntimeStateKey] = useState(() => registration.stateKey);
  const effectiveRuntimeState = useMemo(
    () => (runtimeStateKey === registration.stateKey ? runtimeState : {}),
    [registration.stateKey, runtimeState, runtimeStateKey],
  );
  const resolved = useMemo(
    () => resolveSisadPdfmeInstance(resolvedProps, effectiveRuntimeState),
    [effectiveRuntimeState, resolvedProps],
  );

  useEffect(() => {
    if (runtimeStateKey === registration.stateKey) return;
    setRuntimeStateKey(registration.stateKey);
    setRuntimeState({});
    runtimeStateRef.current = {};
  }, [registration.stateKey, runtimeStateKey]);

  /**
   * Aislamiento de valores por User × Document (RTP-510).
   *
   * El store pertenece a la instancia: no hay singleton de módulo, así que dos
   * Forms en el mismo realm no pueden compartir celdas por accidente.
   */
  const scopeStoreRef = useRef(createExecutionScopeStore());

  /**
   * Inputs de partida, resueltos SIN el estado de runtime.
   *
   * La proyección necesita una base estable: si se partiera de
   * `resolved.state.inputs.value` —que ya incorpora lo editado— cada cambio de
   * documento heredaría lo escrito en el anterior, que es justo la
   * contaminación que este scope existe para impedir.
   */
  const baseResolution = useMemo(
    () => resolveSisadPdfmeInstance(resolvedProps, {}),
    [resolvedProps],
  );
  const baseInputs = baseResolution.state.inputs.value;

  const valueScopes = useMemo(
    () => deriveSchemaValueScopes(resolved.state.template.value as { schemas?: unknown }),
    [resolved.state.template.value],
  );

  const activeUserId = resolved.state.activeRecipientId.value;
  const activeDocumentId = resolved.state.activeDocumentId.value;

  const runtimeScope = useMemo<RuntimeScope>(
    () => ({
      runtimeSessionId: registration.stateKey,
      userId: activeUserId ?? SHARED_SCOPE_USER,
      documentId: activeDocumentId ?? '__default__',
    }),
    [activeDocumentId, activeUserId, registration.stateKey],
  );

  const inputsControlled = isFieldControlled(
    registration.resolvedProps.definition,
    registration.resolvedProps.resources,
    'inputs',
  );

  /**
   * Reproyecta al cambiar de User o de Document.
   *
   * Sin esto el array de inputs sobrevive al cambio de scope y el documento
   * nuevo abre mostrando lo que se escribió en el anterior. Sólo aplica cuando
   * el host no controla `inputs`: si los controla, él es la autoridad.
   */
  const scopeKey = `${runtimeScope.userId}::${runtimeScope.documentId}`;
  useEffect(() => {
    if (inputsControlled || resolved.surface !== 'form') return;
    const projected = projectScopedInputs({
      store: scopeStoreRef.current,
      scope: runtimeScope,
      baseInputs,
      valueScopes,
    });
    const nextRuntimeState = { ...runtimeStateRef.current, inputs: projected };
    runtimeStateRef.current = nextRuntimeState;
    setRuntimeState(nextRuntimeState);
    // Deliberadamente sólo `scopeKey`: reproyectar es la reacción a CAMBIAR de
    // scope, no a cada render. Incluir `baseInputs`/`valueScopes` reescribiría
    // los inputs en cada resolución y pisaría lo que el usuario acaba de teclear.
  }, [scopeKey]);

  const emitStateChange = useCallback(
    (
      nextState: SisadPdfmeInstanceStateInput,
      change: {
        field: keyof SisadPdfmeInstanceStateInput;
        fields?: (keyof SisadPdfmeInstanceStateInput)[];
        source: SisadPdfmeInstanceStateChangeSource;
      },
    ) => {
      registration.resolvedProps.handlers?.onStateChange?.(
        nextState,
        change,
      );
    },
    [registration.resolvedProps.handlers],
  );

  const handleTemplateChange = useCallback(
    (template: unknown) => {
      const nextRuntimeState = { ...runtimeStateRef.current, template };
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'template')) {
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      emitStateChange(buildStateSnapshot(resolved.state, nextRuntimeState), {
        field: 'template',
        fields: ['template'],
        source: 'user',
      });
      registration.resolvedProps.handlers?.onTemplateChange?.(template);
    },
    [emitStateChange, registration.resolvedProps, resolved.state],
  );

  const handleSave = useCallback(
    (template: unknown) => {
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'template')) {
        const nextRuntimeState = { ...runtimeStateRef.current, template };
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      registration.resolvedProps.handlers?.onSave?.(template);
    },
    [registration.resolvedProps],
  );

  const handleInputChange = useCallback(
    (payload: { index: number; name: string; value: unknown }) => {
      // La edición se escribe en la celda del scope activo ANTES de proyectar:
      // el store es la autoridad multi-scope y el array de inputs sólo su vista
      // para el User × Document que está en pantalla.
      commitScopedInput({
        store: scopeStoreRef.current,
        scope: runtimeScope,
        payload,
        valueScopes,
      });

      const currentInputs =
        runtimeStateRef.current.inputs !== undefined
          ? runtimeStateRef.current.inputs
          : resolved.state.inputs.value;
      const nextInputs = updateInputList(
        Array.isArray(currentInputs) ? currentInputs : [],
        payload,
      );
      const nextRuntimeState = {
        ...runtimeStateRef.current,
        inputs: nextInputs,
      };
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'inputs')) {
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      emitStateChange(buildStateSnapshot(resolved.state, nextRuntimeState), {
        field: 'inputs',
        fields: ['inputs'],
        source: 'user',
      });
      registration.resolvedProps.handlers?.onInputChange?.(payload);
    },
    [emitStateChange, registration.resolvedProps, resolved.state, runtimeScope, valueScopes],
  );

  const handleRecipientsChange = useCallback(
    (recipients: SisadPdfmeRecipient[]) => {
      const nextRuntimeState = { ...runtimeStateRef.current, recipients };
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'recipients')) {
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      emitStateChange(buildStateSnapshot(resolved.state, nextRuntimeState), {
        field: 'recipients',
        fields: ['recipients'],
        source: 'user',
      });
      registration.resolvedProps.handlers?.onRecipientsChange?.(recipients);
    },
    [emitStateChange, registration.resolvedProps, resolved.state],
  );

  const handleUploadedDocumentsChange = useCallback(
    (documents: SisadPdfmeDocument[], activeDocumentId: string | null) => {
      const nextRuntimeState = {
        ...runtimeStateRef.current,
        documents,
        activeDocumentId,
      };
      if (
        !isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'documents') ||
        !isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'activeDocumentId')
      ) {
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      emitStateChange(buildStateSnapshot(resolved.state, nextRuntimeState), {
        field: 'documents',
        fields: ['documents', 'activeDocumentId'],
        source: 'user',
      });
      registration.resolvedProps.handlers?.onUploadedDocumentsChange?.(documents, activeDocumentId);
    },
    [emitStateChange, registration.resolvedProps, resolved.state],
  );

  const handleActiveRecipientChange = useCallback(
    (recipient: SisadPdfmeRecipient | null) => {
      const nextRuntimeState = {
        ...runtimeStateRef.current,
        activeRecipientId: recipient?.id ?? null,
      };
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'activeRecipientId')) {
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      emitStateChange(buildStateSnapshot(resolved.state, nextRuntimeState), {
        field: 'activeRecipientId',
        fields: ['activeRecipientId'],
        source: 'user',
      });
      registration.resolvedProps.handlers?.onActiveRecipientChange?.(recipient);
    },
    [emitStateChange, registration.resolvedProps, resolved.state],
  );

  const handleActiveDocumentChange = useCallback(
    (documentId: string | null, document: SisadPdfmeDocument | null) => {
      const nextRuntimeState = {
        ...runtimeStateRef.current,
        activeDocumentId: documentId ?? document?.id ?? null,
      };
      if (!isFieldControlled(registration.resolvedProps.definition, registration.resolvedProps.resources, 'activeDocumentId')) {
        runtimeStateRef.current = nextRuntimeState;
        setRuntimeState(nextRuntimeState);
      }
      emitStateChange(buildStateSnapshot(resolved.state, nextRuntimeState), {
        field: 'activeDocumentId',
        fields: ['activeDocumentId'],
        source: 'user',
      });
      registration.resolvedProps.handlers?.onActiveDocumentChange?.(documentId ?? document?.id ?? null, document);
    },
    [emitStateChange, registration.resolvedProps, resolved.state],
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
            onActiveDocumentChange: handleActiveDocumentChange,
            onUploadedDocumentsChange: handleUploadedDocumentsChange,
            onAssignmentChange: handleAssignmentChange,
          }
        : {}),
      ...(resolved.surface === 'form' ? { onInputChange: handleInputChange } : {}),
    },
  };
};
