/**
 * useSisadPdfmeController — API imperativa pública del wrapper.
 *
 * Rol arquitectónico:
 * - Ejecuta acciones sobre la instancia runtime montada y el RecipientRegistry;
 *   no conoce datos del host.
 * - Recipients: TODAS las operaciones delegan en el registry (fuente única).
 * - `assignSchemasToRecipient` reutiliza `schemaAssignmentService.assignSchemaOwner`
 *   (mismo patch que ListView/DetailView) y por tanto preserva locked/readOnly/
 *   objectLocked/lock y geometría; emite `onAssignmentChange`.
 */
import { useContext, useMemo, type MutableRefObject } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  assignSchemaOwner,
  resolveSchemaUid,
  resolveSelectionOwner,
} from '../ui/components/Designer/shared/schemaAssignmentService.js';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';
import { useSisadPdfmeConfigService } from './useSisadPdfmeConfigService.js';
import { recipientsToSnapshot, recipientsFromSnapshot } from '../recipients/recipientSnapshot.js';
import type {
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipientRegistry,
} from '../recipients/recipientTypes.js';
import type {
  SisadPdfmeController,
  SisadPdfmeControllerCapabilityDomain,
  SisadPdfmeControllerCapabilityState,
  SisadPdfmeGlobalConfig,
} from '../config/SisadPdfmeConfig.js';
import type { SisadPdfmeConfigService, SisadPdfmeConfigChange } from '../config/SisadPdfmeConfigService.js';
import type { FeatureContext, FeatureId, SisadPdfmeFeatureState } from '../config/featureRegistry.js';

type InstanceLike = {
  getTemplate?: () => unknown;
  updateTemplate?: (template: unknown) => void;
  getZoom?: () => number;
  setZoom?: (zoom: number) => void;
  saveTemplate?: () => void;
  onSaveTemplate?: (cb: () => void) => void;
  getSelectedSchemaIds?: () => string[];
  selectSchemas?: (ids: string[], mode?: 'replace' | 'add' | 'toggle') => void;
  clearSelection?: () => void;
  removeSchemas?: (schemaIds: string[]) => void;
  duplicateSchemas?: (schemaIds: string[]) => void;
  setActiveDocument?: (documentId: string) => void;
  validate?: () => Promise<unknown>;
  fitToPage?: () => void;
  fitToWidth?: () => void;
  setPage?: (page: number) => void;
  addSchemaByType?: (schemaType: string) => void;
  setSchemaConfig?: (
    schemaIdOrName: string,
    patch: Record<string, unknown>,
    matcher?: 'id' | 'name' | 'identity' | 'prefill-source',
  ) => boolean;
};

export type SisadPdfmeControllerContext = {
  registry?: SisadPdfmeRecipientRegistry | null;
  onAssignmentChange?: (payload: SisadPdfmeAssignmentChangePayload) => void;
  configService?: SisadPdfmeConfigService | null;
};

type TemplateLike = { schemas?: SchemaForUI[][] } & Record<string, unknown>;

const getTemplatePages = (template: unknown): SchemaForUI[][] | null => {
  if (!template || typeof template !== 'object') return null;
  const pages = (template as TemplateLike).schemas;
  return Array.isArray(pages) ? pages : null;
};

const getInstance = (instanceRef: MutableRefObject<InstanceLike | null>) => instanceRef.current;

const makeCapabilityState = (
  domain: SisadPdfmeControllerCapabilityDomain,
  methods: string[],
  supported: boolean,
  reason?: string,
): SisadPdfmeControllerCapabilityState => ({
  domain,
  methods,
  supported,
  available: supported,
  reason,
});

const resolveControllerCapabilityState = (
  instance: InstanceLike | null,
  registry: SisadPdfmeRecipientRegistry | null,
  domain: SisadPdfmeControllerCapabilityDomain,
): SisadPdfmeControllerCapabilityState => {
  const has = (key: keyof InstanceLike) => typeof instance?.[key] === 'function';
  switch (domain) {
    case 'template':
      return makeCapabilityState(domain, ['getTemplate', 'setTemplate'], has('getTemplate') && has('updateTemplate'));
    case 'schema':
      return makeCapabilityState(
        domain,
        ['addSchema', 'updateSchema', 'removeSchemas', 'duplicateSchemas'],
        has('addSchemaByType') && has('setSchemaConfig') && has('removeSchemas') && has('duplicateSchemas'),
        has('addSchemaByType') ? undefined : 'schema-actions-unavailable',
      );
    case 'selection':
      return makeCapabilityState(
        domain,
        ['getSelectedSchemaIds', 'selectSchemas', 'clearSelection'],
        has('getSelectedSchemaIds') && has('selectSchemas') && has('clearSelection'),
        has('selectSchemas') ? undefined : 'selection-unavailable',
      );
    case 'pages':
      return makeCapabilityState(domain, ['setPage', 'fitToPage', 'fitToWidth'], has('setPage') && has('fitToPage') && has('fitToWidth'), has('setPage') ? undefined : 'pages-unavailable');
    case 'viewport':
      return makeCapabilityState(domain, ['setZoom', 'getZoom'], has('setZoom') && has('getZoom'), has('setZoom') ? undefined : 'viewport-unavailable');
    case 'sidebars':
      return makeCapabilityState(domain, [], false, 'sidebars-unavailable');
    case 'documents':
      return makeCapabilityState(domain, ['setActiveDocument'], has('setActiveDocument'), has('setActiveDocument') ? undefined : 'documents-unavailable');
    case 'recipients':
      return makeCapabilityState(domain, ['getRecipients', 'setRecipients', 'setActiveRecipient'], registry != null, registry ? undefined : 'recipients-unavailable');
    case 'validation':
      return makeCapabilityState(domain, ['validate'], has('validate'), has('validate') ? undefined : 'validation-unavailable');
    case 'snapshot':
      return makeCapabilityState(domain, ['getSnapshot', 'restoreSnapshot'], has('getTemplate') && has('updateTemplate'), has('getTemplate') ? undefined : 'snapshot-unavailable');
    case 'save':
      return makeCapabilityState(domain, ['save'], has('saveTemplate'), has('saveTemplate') ? undefined : 'save-unavailable');
    default:
      return makeCapabilityState(domain, [], false, 'unknown-capability');
  }
};

export const useSisadPdfmeController = (
  instanceRef: MutableRefObject<InstanceLike | null>,
  context: SisadPdfmeControllerContext = {},
): SisadPdfmeController => {
  const providerValue = useContext(SisadPdfmeContext);
  const hookConfigService = useSisadPdfmeConfigService();
  const { registry = null, onAssignmentChange } = context;
  const configService = context.configService ?? providerValue?.configService ?? hookConfigService;
  const controller = useMemo(() => ({
    getTemplate: () => instanceRef.current?.getTemplate?.() ?? null,
    setTemplate: (template) => {
      instanceRef.current?.updateTemplate?.(template);
    },

    // Snapshot: template + sección de recipients del registry (aditivo).
    getSnapshot: () => {
      const template = instanceRef.current?.getTemplate?.() ?? null;
      if (!registry || !template || typeof template !== 'object') return template;
      return { ...(template as Record<string, unknown>), ...recipientsToSnapshot(registry.getState()) };
    },
    restoreSnapshot: (snapshot) => {
      if (registry && recipientsFromSnapshot(snapshot)) {
        registry.restoreSnapshot(snapshot);
      }
      instanceRef.current?.updateTemplate?.(snapshot);
    },
    getConfig: (): SisadPdfmeGlobalConfig => configService.getRawConfig(),
    updateConfig: (patch: Partial<SisadPdfmeGlobalConfig>): SisadPdfmeConfigChange => configService.update(patch),
    resetConfig: (): SisadPdfmeConfigChange => configService.reset(),
    getFeatureState: (featureId: FeatureId, featureContext: FeatureContext = {}): SisadPdfmeFeatureState =>
      configService.selectFeatureState(featureId, featureContext),
    getCapabilityState: (domain: SisadPdfmeControllerCapabilityDomain) =>
      resolveControllerCapabilityState(instanceRef.current, registry, domain),
    explainConfiguration: () => configService.explain(),

    getSelectedSchemaIds: () => {
      const instance = getInstance(instanceRef);
      const ids = instance?.getSelectedSchemaIds?.();
      if (Array.isArray(ids)) {
        return ids.map((id) => String(id ?? '').trim()).filter(Boolean);
      }
      return [];
    },
    selectSchemas: (ids, mode) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.selectSchemas === 'function') {
        instance.selectSchemas(ids, mode);
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'selection');
    },
    clearSelection: () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.clearSelection === 'function') {
        instance.clearSelection();
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'selection');
    },
    addSchema: (schemaType, _options) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.addSchemaByType === 'function') {
        instance.addSchemaByType(schemaType);
        return String(schemaType || '').trim();
      }
      return resolveControllerCapabilityState(instance, registry, 'schema');
    },
    updateSchema: (schemaId, patch) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.setSchemaConfig === 'function') {
        return instance.setSchemaConfig(schemaId, patch, 'id');
      }
      return resolveControllerCapabilityState(instance, registry, 'schema');
    },
    removeSchemas: (schemaIds) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.removeSchemas === 'function') {
        instance.removeSchemas(schemaIds);
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'schema');
    },
    duplicateSchemas: (schemaIds) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.duplicateSchemas === 'function') {
        instance.duplicateSchemas(schemaIds);
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'schema');
    },
    fitToPage: () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.fitToPage === 'function') {
        instance.fitToPage();
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'pages');
    },
    fitToWidth: () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.fitToWidth === 'function') {
        instance.fitToWidth();
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'pages');
    },
    setPage: (page) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.setPage === 'function') {
        instance.setPage(page);
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'pages');
    },
    addSchemaByType: (schemaType) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.addSchemaByType === 'function') {
        instance.addSchemaByType(schemaType);
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'schema');
    },

    getRecipients: () => registry?.getRecipients() ?? [],
    setRecipients: (recipients) => {
      registry?.setRecipients(recipients);
    },
    getRecipientById: (recipientId) => registry?.getRecipient(recipientId) ?? null,
    getActiveRecipient: () => registry?.getActiveRecipient() ?? null,
    setActiveRecipient: (recipientId) => {
      registry?.setActiveRecipient(recipientId);
    },

    assignSchemasToRecipient: (schemaIds, recipientId) => {
      const instance = instanceRef.current;
      const recipient = registry?.getRecipient(recipientId);
      if (!instance || !recipient) return;

      const template = instance.getTemplate?.();
      const pages = getTemplatePages(template);
      if (!pages) return;

      const targetIds = new Set(schemaIds.map((id) => String(id ?? '').trim()).filter(Boolean));
      const targetSchemas = pages
        .flat()
        .filter((schema) =>
          targetIds.has(resolveSchemaUid(schema)) || targetIds.has(String(schema.id ?? '').trim()),
        );
      if (targetSchemas.length === 0) return;

      const previousRecipientId = resolveSelectionOwner(targetSchemas).recipientId;
      const { pages: nextPages, changedSchemaUids } = assignSchemaOwner({
        pages,
        schemaUids: targetSchemas.map((schema) => resolveSchemaUid(schema)),
        recipient: {
          id: recipient.id,
          name: recipient.label,
          color: recipient.color ?? null,
        },
        actorId: registry?.getActiveRecipientId() ?? null,
      });
      if (changedSchemaUids.length === 0) return;

      instance.updateTemplate?.({ ...(template as TemplateLike), schemas: nextPages });
      onAssignmentChange?.({
        schemaIds: changedSchemaUids,
        previousRecipientId,
        nextRecipientId: recipient.id,
      });
    },

    setActiveDocument: (documentId) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.setActiveDocument === 'function') {
        instance.setActiveDocument(documentId);
        return;
      }
      return resolveControllerCapabilityState(instance, registry, 'documents');
    },
    setZoom: (zoom) => {
      instanceRef.current?.setZoom?.(zoom);
    },
    validate: async () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.validate === 'function') {
        return instance.validate();
      }
      return resolveControllerCapabilityState(instance, registry, 'validation');
    },
    save: async () => {
      instanceRef.current?.saveTemplate?.();
    },
  }), [instanceRef, registry, onAssignmentChange, configService]);

  return controller as SisadPdfmeController;
};
