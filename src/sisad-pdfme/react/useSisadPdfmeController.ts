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
import type { SisadPdfmeController, SisadPdfmeGlobalConfig } from '../config/SisadPdfmeConfig.js';
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
  fitToPage?: () => void;
  fitToWidth?: () => void;
  setPage?: (page: number) => void;
  addSchemaByType?: (schemaType: string) => void;
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

const warnUnsupported = (method: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[sisad-pdfme] Controller method not implemented: ${method}`);
  }
};

const getInstance = (instanceRef: MutableRefObject<InstanceLike | null>) => instanceRef.current;

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
    explainConfiguration: () => configService.explain(),

    getSelectedSchemaIds: () => {
      const instance = getInstance(instanceRef);
      const ids = instance?.getSelectedSchemaIds?.();
      if (Array.isArray(ids)) {
        return ids.map((id) => String(id ?? '').trim()).filter(Boolean);
      }
      warnUnsupported('getSelectedSchemaIds');
      return [];
    },
    selectSchemas: (ids, mode) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.selectSchemas === 'function') {
        instance.selectSchemas(ids, mode);
        return;
      }
      warnUnsupported('selectSchemas');
    },
    clearSelection: () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.clearSelection === 'function') {
        instance.clearSelection();
        return;
      }
      warnUnsupported('clearSelection');
    },
    addSchema: () => {
      warnUnsupported('addSchema');
      return '';
    },
    updateSchema: () => warnUnsupported('updateSchema'),
    removeSchemas: () => warnUnsupported('removeSchemas'),
    duplicateSchemas: () => warnUnsupported('duplicateSchemas'),
    fitToPage: () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.fitToPage === 'function') {
        instance.fitToPage();
        return;
      }
      warnUnsupported('fitToPage');
    },
    fitToWidth: () => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.fitToWidth === 'function') {
        instance.fitToWidth();
        return;
      }
      warnUnsupported('fitToWidth');
    },
    setPage: (page) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.setPage === 'function') {
        instance.setPage(page);
        return;
      }
      warnUnsupported('setPage');
    },
    addSchemaByType: (schemaType) => {
      const instance = getInstance(instanceRef);
      if (typeof instance?.addSchemaByType === 'function') {
        instance.addSchemaByType(schemaType);
        return;
      }
      warnUnsupported('addSchemaByType');
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

    setActiveDocument: () => warnUnsupported('setActiveDocument'),
    setZoom: (zoom) => {
      instanceRef.current?.setZoom?.(zoom);
    },
    validate: async () => null,
    save: async () => {
      instanceRef.current?.saveTemplate?.();
    },
  }), [instanceRef, registry, onAssignmentChange, configService]);

  return controller as SisadPdfmeController;
};
