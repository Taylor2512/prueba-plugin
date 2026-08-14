/**
 * Contrato del CapabilityGraph (RTP-430 / RTP-440).
 *
 * Un id desconocido debe apagar la superficie, no habilitarla; las
 * dependencias deben propagarse; y `enabled/visible/permitted/available/
 * executable` deben seguir siendo dimensiones separadas.
 */
import { describe, expect, it } from 'vitest';
import { resolveSisadPdfmeConfig } from '../../../../../src/sisad-pdfme/config/resolveSisadPdfmeConfig';
import {
  capabilityInventory,
  capabilitiesOfKind,
  findCapability,
} from '../../../../../src/sisad-pdfme/config/capabilityInventory';
import {
  createCapabilityGraph,
  resolveCapabilityState,
} from '../../../../../src/sisad-pdfme/config/capabilityGraph';
import { featureRegistry } from '../../../../../src/sisad-pdfme/config/featureRegistry';
import { actionConfigRegistry } from '../../../../../src/sisad-pdfme/config/actionConfigRegistry';
import { componentRegistry } from '../../../../../src/sisad-pdfme/config/componentRegistry';
import { VIEW_FEATURES } from '../../../../../src/sisad-pdfme/ui/commands/viewCommands';

const baseConfig = resolveSisadPdfmeConfig({});

describe('capability inventory', () => {
  it('cubre cada registry sin inventar ni perder ids', () => {
    expect(capabilitiesOfKind('feature').map((d) => d.id).sort()).toEqual(Object.keys(featureRegistry).sort());
    expect(capabilitiesOfKind('action').map((d) => d.id).sort()).toEqual(Object.keys(actionConfigRegistry).sort());
    expect(capabilitiesOfKind('component').map((d) => d.id).sort()).toEqual(Object.keys(componentRegistry).sort());
    expect(capabilitiesOfKind('view').map((d) => d.id).sort()).toEqual([...VIEW_FEATURES].sort());
  });

  it('usa ids namespaced y únicos', () => {
    const ids = capabilityInventory.map((descriptor) => descriptor.capabilityId);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z-]+:.+$/));
  });

  it('no declara dependencias hacia capabilities inexistentes', () => {
    capabilityInventory.forEach((descriptor) => {
      descriptor.dependsOn.forEach((dependencyId) => {
        expect(findCapability(dependencyId), `${descriptor.capabilityId} -> ${dependencyId}`).not.toBeNull();
      });
    });
  });

  it('declara al menos una fuente de configuración por capability', () => {
    capabilityInventory.forEach((descriptor) => {
      expect(descriptor.sources.length, descriptor.capabilityId).toBeGreaterThan(0);
    });
  });
});

describe('capability graph', () => {
  const graph = createCapabilityGraph(baseConfig);

  it('resuelve todas las capabilities del inventario sin lanzar', () => {
    const states = graph.resolveAll({ controllerSupport: {} });
    expect(Object.keys(states).length).toBe(capabilityInventory.length);
    Object.entries(states).forEach(([id, state]) => {
      expect(state.capabilityId).toBe(id);
      expect(state.registered).toBe(true);
      expect(Array.isArray(state.blockedBy)).toBe(true);
    });
  });

  it('es fail-closed ante un id desconocido', () => {
    const state = graph.resolve('feature:no-existe');
    expect(state.registered).toBe(false);
    expect(state.enabled).toBe(false);
    expect(state.visible).toBe(false);
    expect(state.permitted).toBe(false);
    expect(state.available).toBe(false);
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('unknown-capability');
  });

  it('es fail-closed ante un kind desconocido', () => {
    expect(graph.resolve('inventado:cosa').reason).toBe('unknown-capability');
    expect(graph.resolve('canvas').reason).toBe('unknown-capability');
  });

  it('propaga la indisponibilidad de una dependencia', () => {
    const canvasOff = resolveSisadPdfmeConfig({ canvas: { enabled: false } });
    const state = resolveCapabilityState(canvasOff, 'action:delete-schema', { selectionCount: 1 });
    expect(state.executable).toBe(false);
    expect(state.blockedBy).toContain('feature:canvas');
  });

  it('readonly bloquea ejecución pero no visibilidad', () => {
    const readonly = resolveSisadPdfmeConfig({ runtime: { readonly: true } });
    const state = resolveCapabilityState(readonly, 'action:delete-schema', { selectionCount: 1 });
    expect(state.visible).toBe(true);
    expect(state.permitted).toBe(false);
    expect(state.executable).toBe(false);
  });

  it('distingue toggles de vista independientes', () => {
    const hidden = resolveSisadPdfmeConfig({ visibility: { canvas: { grid: false } } });
    expect(resolveCapabilityState(hidden, 'view:grid').executable).toBe(false);
    expect(resolveCapabilityState(hidden, 'view:guides').executable).toBe(true);
    expect(resolveCapabilityState(hidden, 'view:snapLines').executable).toBe(true);
    expect(resolveCapabilityState(hidden, 'view:rulers').executable).toBe(true);
  });

  it('rejilla y reglas arrancan apagadas pero siguen siendo alternables', () => {
    (['grid', 'rulers'] as const).forEach((feature) => {
      const state = resolveCapabilityState(baseConfig, `view:${feature}`);
      expect(state.active, `${feature}.active`).toBe(false);
      expect(state.visible, `${feature}.visible`).toBe(true);
      expect(state.executable, `${feature}.executable`).toBe(true);
      expect(
        resolveCapabilityState(baseConfig, `view:${feature}`, { viewSession: { [feature]: true } }).active,
      ).toBe(true);
    });
  });

  it('el estado de sesión de un toggle sólo mueve active, no la política', () => {
    const off = resolveCapabilityState(baseConfig, 'view:grid', { viewSession: { grid: false } });
    const on = resolveCapabilityState(baseConfig, 'view:grid', { viewSession: { grid: true } });
    expect(off.active).toBe(false);
    expect(on.active).toBe(true);
    expect(off.executable).toBe(on.executable);
  });

  it('un dominio de controller sin soporte declarado es fail-closed', () => {
    const unknown = resolveCapabilityState(baseConfig, 'controller-domain:save', {});
    expect(unknown.supported).toBe(false);
    expect(unknown.reason).toBe('controller-support-unknown');

    const declaredFalse = resolveCapabilityState(baseConfig, 'controller-domain:save', {
      controllerSupport: { save: false },
    });
    expect(declaredFalse.reason).toBe('save-unavailable');

    const declaredTrue = resolveCapabilityState(baseConfig, 'controller-domain:save', {
      controllerSupport: { save: true },
    });
    expect(declaredTrue.executable).toBe(true);
  });

  it('una superficie de schema respeta enabledTypes por tipo', () => {
    const limited = resolveSisadPdfmeConfig({ schemas: { enabledTypes: ['text'] } });
    expect(resolveCapabilityState(limited, 'schema-surface:catalog', { schemaType: 'text' }).executable).toBe(true);
    expect(resolveCapabilityState(limited, 'schema-surface:catalog', { schemaType: 'signature' }).executable).toBe(false);
    // Sin tipo la pregunta es por la superficie, no por un tipo concreto.
    expect(resolveCapabilityState(limited, 'schema-surface:catalog').executable).toBe(true);
  });
});
