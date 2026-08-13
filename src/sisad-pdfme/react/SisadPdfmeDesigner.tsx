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
import { useSisadPdfmeConfigService } from './useSisadPdfmeConfigService.js';
import { mergeHostSurfaceClassName } from './hostSurface.js';
import {
  createInstanceEventDispatcher,
  type SisadPdfmeHostCallbacks,
} from '../runtime/instanceEventDispatcher.js';
import { bridgeRuntimeEventHub } from '../runtime/runtimeEventBridge.js';
import type { SisadPdfmeAnyEvent } from '../contracts/events.js';
import { buildCollaborationSyncFromRegistry } from '../recipients/recipientResolver.js';
import { useSisadPdfmeRecipientRuntime } from './useSisadPdfmeRecipientRuntime.js';
import type {
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
} from '../recipients/recipientTypes.js';
import type { SignatureProviderDefinition } from '../schemas/signature/providerRegistry.js';
import type {
  SisadPdfmeController,
  SisadPdfmeDocument,
  SisadPdfmeGlobalConfig,
  ResolvedSisadPdfmeConfig,
} from '../config/SisadPdfmeConfig.js';

/** Identificador de instancia para correlacionar eventos del mismo montaje. */
let instanceSequence = 0;

type DesignerProps = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  documents?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
  activeDocumentId?: string | null;
  signatureProviders?: unknown[];
  plugins?: Record<string, unknown> | null;
  onTemplateChange?: (template: unknown) => void;
  onSave?: (template: unknown) => void;
  onControllerReady?: (controller: SisadPdfmeController) => void;
  onRecipientsChange?: (recipients: SisadPdfmeRecipient[]) => void;
  onActiveRecipientChange?: (recipient: SisadPdfmeRecipient | null) => void;
  onActiveDocumentChange?: (documentId: string | null, document: SisadPdfmeDocument | null) => void;
  onUploadedDocumentsChange?: (documents: unknown[], activeDocumentId: string | null) => void;
  onAssignmentChange?: (payload: SisadPdfmeAssignmentChangePayload) => void;
  /**
   * Flujo único de eventos canónicos de la instancia.
   *
   * Recibe todo lo que pasa por el dispatcher: lo emitido por el wrapper y lo
   * traducido desde el hub interno del Designer. Es la vía tipada; los `onX`
   * históricos se mantienen como adapter de compatibilidad.
   */
  onEvent?: (event: SisadPdfmeAnyEvent) => void;
  /** Clases adicionales del host. Se suman al contrato base de dimensiones. */
  className?: string;
  /** Estilos inline del host. El host es dueño del viewport. */
  style?: React.CSSProperties;
};

export const SisadPdfmeDesigner = ({
  config,
  template,
  documents = [],
  recipients,
  activeRecipientId,
  activeDocumentId,
  signatureProviders = [],
  plugins,
  onTemplateChange,
  onSave,
  onControllerReady,
  onRecipientsChange,
  onActiveRecipientChange,
  onActiveDocumentChange,
  onUploadedDocumentsChange,
  onAssignmentChange,
  onEvent,
  className,
  style,
}: DesignerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configService = useSisadPdfmeConfigService(config);
  const {
    resolvedConfig,
    recipientRegistry: { registry, state: recipientState },
  } = useSisadPdfmeRecipientRuntime({ config, recipients, activeRecipientId });

  /**
   * Los props del host se leen en el momento de emitir, no se capturan: así el
   * dispatcher nunca invoca un callback de un render anterior.
   */
  const hostCallbacksRef = useRef<SisadPdfmeHostCallbacks>({});
  // Excepción a react-hooks/refs: patrón "latest ref". El valor solo se lee
  // desde callbacks asíncronos, nunca durante el render; escribirlo en un
  // efecto lo dejaría obsoleto para los eventos emitidos en el commit.
  // eslint-disable-next-line react-hooks/refs
  hostCallbacksRef.current = {
    onRecipientsChange: (payload) =>
      onRecipientsChange?.(payload.recipients as SisadPdfmeRecipient[]),
    onActiveRecipientChange: (payload) =>
      onActiveRecipientChange?.(payload.recipient as SisadPdfmeRecipient | null),
    onAssignmentChange: (payload) =>
      onAssignmentChange?.(payload as unknown as SisadPdfmeAssignmentChangePayload),
  };

  const configEventsRef = useRef(resolvedConfig.config.events);
  // Excepción a react-hooks/refs: patrón "latest ref". El valor solo se lee
  // desde callbacks asíncronos, nunca durante el render; escribirlo en un
  // efecto lo dejaría obsoleto para los eventos emitidos en el commit.
  // eslint-disable-next-line react-hooks/refs
  configEventsRef.current = resolvedConfig.config.events;

  const runtimePlugins = useMemo(
    () => ({
      ...flatSchemaPlugins,
      ...(plugins || {}),
    }),
    [plugins],
  );

  const normalizeSignatureProvider = (provider: unknown): SignatureProviderDefinition | null => {
    if (!provider || typeof provider !== 'object') return null;
    const record = provider as Record<string, unknown>;
    const capabilities = record.capabilities && typeof record.capabilities === 'object'
      ? (record.capabilities as Record<string, boolean>)
      : {};
    return {
      key: String(record.key ?? '').trim() || 'provider',
      label: String(record.label ?? '').trim() || 'Provider',
      description: String(record.description ?? '').trim() || undefined,
      internal: false,
      capabilities: {
        supportsVisibleSignature: capabilities.supportsVisibleSignature !== false,
        supportsWebhook: capabilities.supportsWebhook === true,
        supportsPolling: capabilities.supportsPolling === true,
        supportsCertificateMetadata: capabilities.supportsCertificateMetadata === true,
        supportsReason: capabilities.supportsReason === true,
        supportsLocation: capabilities.supportsLocation === true,
        supportsOtp: capabilities.supportsOtp === true,
        supportsBiometric: capabilities.supportsBiometric === true,
      },
      defaultConfig: record.metadata && typeof record.metadata === 'object'
        ? (record.metadata as Record<string, unknown>)
        : undefined,
    };
  };

  const mergedSignatureProviders = useMemo(() => {
    const baseProviders = resolvedConfig.designerEngine.signature?.providers || [];
    const extraProviders = Array.isArray(signatureProviders)
      ? signatureProviders.map(normalizeSignatureProvider).filter(Boolean) as SignatureProviderDefinition[]
      : [];
    const byKey = new Map<string, SignatureProviderDefinition>();
    [...baseProviders, ...extraProviders].forEach((provider) => {
      if (!provider?.key) return;
      byKey.set(provider.key, provider);
    });
    return Array.from(byKey.values());
  }, [resolvedConfig.designerEngine.signature?.providers, signatureProviders]);

  /**
   * Dispatcher único de la instancia: reparte a listeners internos y al
   * adapter del host `onX`. Se crea una sola vez por montaje.
   */
  const instanceId = useMemo(() => `designer-${instanceSequence++}`, []);
  const dispatcher = useMemo(
    () =>
      // Excepción a react-hooks/refs: las refs entran envueltas en getters que
      // el dispatcher solo invoca al emitir un evento, nunca durante el render.
      // eslint-disable-next-line react-hooks/refs
      createInstanceEventDispatcher({
        instanceId,
        getConfigEvents: () => configEventsRef.current,
        getHostCallbacks: () => hostCallbacksRef.current,
      }),
    [instanceId],
  );

  /**
   * Los eventos que el Designer emite por el hub interno se traducen al
   * catálogo canónico y salen por el mismo dispatcher, así que el host recibe
   * un único flujo tipado sin importar quién los originó.
   */
  useEffect(
    () => bridgeRuntimeEventHub(resolvedConfig.eventHub, dispatcher, instanceId),
    [dispatcher, instanceId, resolvedConfig.eventHub],
  );

  // El listener se lee por ref para no resuscribir en cada render del host.
  const onEventRef = useRef(onEvent);
  // Excepción a react-hooks/refs: patrón "latest ref". El valor solo se lee
  // desde callbacks asíncronos, nunca durante el render; escribirlo en un
  // efecto lo dejaría obsoleto para los eventos emitidos en el commit.
  // eslint-disable-next-line react-hooks/refs
  onEventRef.current = onEvent;
  useEffect(
    () => dispatcher.subscribe((event) => onEventRef.current?.(event)),
    [dispatcher],
  );

  // Eventos de recipients: derivados del registry, no de props sueltos.
  useEffect(() => {
    let previous = registry.getState();
    return registry.subscribe((state) => {
      if (state.recipients !== previous.recipients) {
        dispatcher.emit(
          'recipient.registry.changed',
          {
            revision: Date.now(),
            recipients: (state.recipients as Array<{ id: string; name?: string }>).map(
              ({ id, name }) => ({ id, name }),
            ),
          },
          // El contrato histórico entrega los recipients completos.
          { hostCallbackPayload: { recipients: state.recipients } },
        );
      }
      if (state.activeRecipientId !== previous.activeRecipientId) {
        dispatcher.emit(
          'recipient.active.changed',
          {
            previousId: previous.activeRecipientId ?? null,
            currentId: state.activeRecipientId ?? null,
          },
          { hostCallbackPayload: { recipient: state.activeRecipient } },
        );
      }
      previous = state;
    });
  }, [dispatcher, registry]);

  const runtime = useMemo(() => ({
    Designer,
    Form: Designer,
    Viewer: Designer,
  }) as unknown as UsePdfmeRuntimeInstanceConfig['runtime'], []);
  const runtimeConfig = useMemo(() => ({
    containerRef,
    mode: 'designer' as const,
    template: template as UsePdfmeRuntimeInstanceConfig['template'],
    inputs: [],
    onTemplateChange: (nextTemplate: unknown) => onTemplateChange?.(nextTemplate),
    onPageChange: () => undefined,
      options: {
        ...resolvedConfig.runtimeOptions,
        onActiveDocumentChange,
        onUploadedDocumentsChange,
        designerEngine: {
        ...resolvedConfig.designerEngine,
        // collaborationContext interno nace del registry: una sola fuente para
        // recipientOptions/users/activeRecipientId/colores.
        collaboration: buildCollaborationSyncFromRegistry(recipientState, {
          base: (resolvedConfig.designerEngine.collaboration || {}) as Record<string, unknown>,
          enabled: Boolean(resolvedConfig.config.collaboration.enabled),
          isGlobalView: resolvedConfig.config.collaboration.isGlobalView === true,
        }),
        signature: {
          ...(resolvedConfig.designerEngine.signature || {}),
          providers: mergedSignatureProviders,
        },
        sidebars: {
          ...(resolvedConfig.designerEngine.sidebars || {}),
        },
      },
      uploadedDocuments: (Array.isArray(documents) ? documents : []).map((document) => resolvedConfig.adapters.documents.toDocument(document as unknown)),
      activeDocumentId:
        typeof activeDocumentId === 'string'
          ? activeDocumentId
          : (Array.isArray(documents) && documents.length > 0
              ? resolvedConfig.adapters.documents.toDocument(documents[0] as unknown).id
              : null),
    },
    plugins: runtimePlugins,
    runtime: runtime as UsePdfmeRuntimeInstanceConfig['runtime'],
    // El wrapper público arranca con zoom visible al 100%; el host puede
    // pedir un fit explícito después si lo necesita.
    autoFit: 'none' as const,
  }), [
    activeDocumentId,
    documents,
    mergedSignatureProviders,
    onActiveDocumentChange,
    onTemplateChange,
    onUploadedDocumentsChange,
    recipientState,
    resolvedConfig,
    runtime,
    template,
    runtimePlugins,
  ]);
  const { instanceRef } = usePdfmeRuntimeInstance(runtimeConfig as UsePdfmeRuntimeInstanceConfig);

  const controllerContext = useMemo(() => ({
    registry,
    // COREUX-004: sin esto el controller caía a un ConfigService VACÍO, así que
    // getConfig/updateConfig/getFeatureState/explainConfiguration no operaban
    // sobre la configuración que el Designer estaba ejecutando.
    configService,
    onAssignmentChange: (payload: SisadPdfmeAssignmentChangePayload) =>
      dispatcher.emit(
        'assignment.changed',
        {
          schemaIds: (payload.schemaIds as string[]) ?? [],
          previousOwnerIds: payload.previousRecipientId ? [payload.previousRecipientId] : [],
          ownerId: payload.nextRecipientId ?? null,
        },
        { hostCallbackPayload: payload as unknown as Record<string, unknown> },
      ),
  }), [configService, dispatcher, registry]);
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

  return (
    <div
      ref={containerRef}
      data-sisad-pdfme-root="designer"
      className={mergeHostSurfaceClassName(className)}
      style={style}
    />
  );
};
