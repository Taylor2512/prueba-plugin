/**
 * Paridad de superficies (RTP-460 / RTP-465).
 *
 * El contrato de campaña es explícito: botón de UI, atajo, menú contextual y
 * controller público deben resolver el MISMO estado de capability. Antes había
 * tres tablas independientes que mapeaban acciones a ramas de `visibility.*`
 * —`config/actionConfigRegistry`, `designerUiConfig` y el `switch` del menú
 * contextual— y ninguna obligaba a las otras a estar sincronizadas.
 */
import { describe, expect, it } from 'vitest';
import { resolveSisadPdfmeConfig } from '../../../../src/sisad-pdfme/config/resolveSisadPdfmeConfig';
import { resolveCapabilityState } from '../../../../src/sisad-pdfme/config/capabilityGraph';
import { capabilitiesOfKind } from '../../../../src/sisad-pdfme/config/capabilityInventory';
import { selectActionState } from '../../../../src/sisad-pdfme/config/configSelectors';
import { buildDesignerUiMapFromResolvedConfig } from '../../../../src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig';
import { CONTEXT_ACTION_CAPABILITY } from '../../../../src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions';
import { findCapability } from '../../../../src/sisad-pdfme/config/capabilityInventory';

const ACTION_IDS = capabilitiesOfKind('action').map((descriptor) => descriptor.id);

describe('paridad de superficies por acción', () => {
  it('el mapa del Designer cubre todas las acciones configurables', () => {
    const map = buildDesignerUiMapFromResolvedConfig(resolveSisadPdfmeConfig({}));
    ACTION_IDS.forEach((actionId) => {
      expect(map.actions[actionId], actionId).toBeDefined();
    });
  });

  it('mapa del Designer y grafo coinciden en visibilidad para cada acción', () => {
    // Se apaga cada bandera de acción por separado y se comprueba que ambas
    // superficies reaccionan igual.
    const flags = [
      'reassign',
      'duplicate',
      'delete',
      'copy',
      'paste',
      'lock',
      'unlock',
      'hide',
      'show',
      'align',
      'distribute',
      'matchSize',
    ] as const;

    flags.forEach((flag) => {
      const resolved = resolveSisadPdfmeConfig({ visibility: { actions: { [flag]: false } } });
      const map = buildDesignerUiMapFromResolvedConfig(resolved);
      ACTION_IDS.forEach((actionId) => {
        const graph = resolveCapabilityState(resolved, `action:${actionId}`, {
          selectionCount: 1,
          recipientCount: 1,
          hasClipboard: true,
        });
        const designer = map.actions[actionId];
        // `reassignrecipient` añade la condición del modal de asignación, que
        // es superficie propia del Designer y no política de la acción.
        if (actionId === 'reassignrecipient') return;
        expect(designer.visibleByConfig, `${flag} → ${actionId}`).toBe(graph.visible);
      });
    });
  });

  it('el controller público y el grafo resuelven lo mismo', () => {
    const resolved = resolveSisadPdfmeConfig({ runtime: { readonly: true } });
    ACTION_IDS.forEach((actionId) => {
      const context = { selectionCount: 1, recipientCount: 1, hasClipboard: true };
      const viaController = selectActionState(resolved, actionId as never, context);
      const viaGraph = resolveCapabilityState(resolved, `action:${actionId}`, context);
      expect(viaGraph.visible, actionId).toBe(viaController.visible);
      expect(viaGraph.permitted, actionId).toBe(viaController.permitted);
    });
  });

  it('readonly deshabilita en el Designer igual que en el controller', () => {
    const resolved = resolveSisadPdfmeConfig({ runtime: { readonly: true } });
    const map = buildDesignerUiMapFromResolvedConfig(resolved);
    const state = map.resolveAction('delete-schema', { selectionCount: 1, activeSchemas: [] });
    expect(state.visible).toBe(true);
    expect(state.enabled).toBe(false);
  });

  it('el menú contextual sólo referencia capabilities existentes', () => {
    Object.entries(CONTEXT_ACTION_CAPABILITY).forEach(([contextId, capabilityIds]) => {
      expect(capabilityIds.length, contextId).toBeGreaterThan(0);
      capabilityIds.forEach((capabilityId) => {
        expect(findCapability(capabilityId), `${contextId} → ${capabilityId}`).not.toBeNull();
      });
    });
  });

  it('los alias camelCase del chrome resuelven como su id canónico', () => {
    const resolved = resolveSisadPdfmeConfig({ visibility: { actions: { duplicate: false, delete: false } } });
    const map = buildDesignerUiMapFromResolvedConfig(resolved);
    expect(map.actions.duplicate.visibleByConfig).toBe(map.actions['duplicate-schema'].visibleByConfig);
    expect(map.actions.delete.visibleByConfig).toBe(map.actions['delete-schema'].visibleByConfig);
    expect(map.actions.duplicate.visibleByConfig).toBe(false);
  });

  it('apagar el canvas deja inejecutable toda acción de canvas en el grafo', () => {
    const resolved = resolveSisadPdfmeConfig({ canvas: { enabled: false } });
    ['delete-schema', 'duplicate-schema', 'copy', 'align', 'distribute'].forEach((actionId) => {
      const state = resolveCapabilityState(resolved, `action:${actionId}`, {
        selectionCount: 1,
        hasClipboard: true,
      });
      expect(state.executable, actionId).toBe(false);
      expect(state.blockedBy, actionId).toContain('feature:canvas');
    });
  });
});
