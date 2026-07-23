/**
 * SisadPdfmeDesigner — wrapper público del Designer.
 *
 * Pipeline de recipients (fuente única):
 *   props.recipients → adapters.recipients.toRecipients() → RecipientRegistry
 *   → buildCollaborationSyncFromRegistry() → designerEngine.collaboration
 *   → collaborationContext interno (Canvas/ListView/DetailView/AssignmentDialog)
 *
 * El host entrega recipients UNA vez; nunca construye collaborationContext,
 * ownerColorMap, recipientNameMap ni listas para el AssignmentDialog.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import Designer from '../ui/Designer.js';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import { usePdfmeRuntimeInstance } from '../runtime/usePdfmeRuntimeInstance.js';
import type { UsePdfmeRuntimeInstanceConfig } from '../runtime/usePdfmeRuntimeInstance.js';
import { useSisadPdfmeController } from './useSisadPdfmeController.js';
import { buildCollaborationSyncFromRegistry } from '../recipients/recipientResolver.js';
import { useSisadPdfmeRecipientRuntime } from './useSisadPdfmeRecipientRuntime.js';
import type {
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
} from '../recipients/recipientTypes.js';
import type {
  SisadPdfmeController,
  SisadPdfmeEventName,
  SisadPdfmeGlobalConfig,
  ResolvedSisadPdfmeConfig,
} from '../config/SisadPdfmeConfig.js';

type DesignerProps = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  documents?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
  onTemplateChange?: (template: unknown) => void;
  onSave?: (template: unknown) => void;
  onControllerReady?: (controller: SisadPdfmeController) => void;
  onRecipientsChange?: (recipients: SisadPdfmeRecipient[]) => void;
  onActiveRecipientChange?: (recipient: SisadPdfmeRecipient | null) => void;
  onAssignmentChange?: (payload: SisadPdfmeAssignmentChangePayload) => void;
};

export const SisadPdfmeDesigner = ({
  config,
  template,
  documents = [],
  recipients,
  activeRecipientId,
  onTemplateChange,
  onSave,
  onControllerReady,
  onRecipientsChange,
  onActiveRecipientChange,
  onAssignmentChange,
}: DesignerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    resolvedConfig,
    recipientRegistry: { registry, state: recipientState },
  } = useSisadPdfmeRecipientRuntime({ config, recipients, activeRecipientId });

  // Despacha a config.events (si es función) y al prop equivalente. Se asigna
  // en un effect sin deps para capturar siempre los handlers más recientes.
  const emitEventRef = useRef<(name: SisadPdfmeEventName, payload: Record<string, unknown>) => void>(() => undefined);
  useEffect(() => {
    emitEventRef.current = (name, payload) => {
      const handler = resolvedConfig.config.events?.[name];
      if (typeof handler === 'function') handler(payload);
      if (name === 'onRecipientsChange') onRecipientsChange?.(payload.recipients as SisadPdfmeRecipient[]);
      if (name === 'onActiveRecipientChange') onActiveRecipientChange?.(payload.recipient as SisadPdfmeRecipient | null);
      if (name === 'onAssignmentChange') onAssignmentChange?.(payload as SisadPdfmeAssignmentChangePayload);
    };
  });

  // Eventos de recipients: derivados del registry, no de props sueltos.
  useEffect(() => {
    let previous = registry.getState();
    return registry.subscribe((state) => {
      if (state.recipients !== previous.recipients) {
        emitEventRef.current('onRecipientsChange', { recipients: state.recipients });
      }
      if (state.activeRecipientId !== previous.activeRecipientId) {
        emitEventRef.current('onActiveRecipientChange', { recipient: state.activeRecipient });
      }
      previous = state;
    });
  }, [registry]);

  const runtime = useMemo(() => ({
    Designer,
    Form: Designer,
    Viewer: Designer,
  }), []);
  const runtimeConfig = useMemo(() => ({
    containerRef,
    mode: 'designer' as const,
    template: template as UsePdfmeRuntimeInstanceConfig['template'],
    inputs: [],
    onTemplateChange: (nextTemplate: unknown) => onTemplateChange?.(nextTemplate),
    onPageChange: () => undefined,
    options: {
      ...resolvedConfig.runtimeOptions,
      designerEngine: {
        ...resolvedConfig.designerEngine,
        // collaborationContext interno nace del registry: una sola fuente para
        // recipientOptions/users/activeRecipientId/colores.
        collaboration: buildCollaborationSyncFromRegistry(recipientState, {
          base: (resolvedConfig.designerEngine.collaboration || {}) as Record<string, unknown>,
          enabled: Boolean(resolvedConfig.config.collaboration.enabled),
          isGlobalView: resolvedConfig.config.collaboration.isGlobalView === true,
        }),
        sidebars: {
          ...(resolvedConfig.designerEngine.sidebars || {}),
        },
      },
      uploadedDocuments: (Array.isArray(documents) ? documents : []).map((document) => resolvedConfig.adapters.documents.toDocument(document as unknown)),
      activeDocumentId: (Array.isArray(documents) && documents.length > 0 ? resolvedConfig.adapters.documents.toDocument(documents[0] as unknown).id : null),
    },
    plugins: flatSchemaPlugins,
    runtime: runtime as UsePdfmeRuntimeInstanceConfig['runtime'],
    autoFit: 'page' as const,
  }), [documents, recipientState, resolvedConfig, runtime, template, onTemplateChange]);
  const { instanceRef } = usePdfmeRuntimeInstance(runtimeConfig as UsePdfmeRuntimeInstanceConfig);

  const controllerContext = useMemo(() => ({
    registry,
    onAssignmentChange: (payload: SisadPdfmeAssignmentChangePayload) =>
      emitEventRef.current('onAssignmentChange', payload),
  }), [registry]);
  const controller = useSisadPdfmeController(instanceRef, controllerContext);

  useEffect(() => {
    onControllerReady?.(controller);
  }, [controller, onControllerReady]);

  useEffect(() => {
    const instance = instanceRef.current as {
      onSaveTemplate?: (callback: () => void) => void;
      getTemplate?: () => unknown;
    } | null;
    if (!instance || !onSave) return;
    instance.onSaveTemplate?.(() => onSave(instance.getTemplate?.() ?? template));
  }, [instanceRef, onSave, template]);

  return <div ref={containerRef} data-sisad-pdfme-root="designer" />;
};