/**
 * Contrato del plan de efectos (RTP-445).
 *
 * Un cambio de configuración debe decir QUÉ capabilities se movieron y en qué
 * dimensiones, no sólo «cambió algo bajo `canvas`».
 */
import { describe, expect, it } from 'vitest';
import { compileSisadPdfmeConfig } from '../../../../../src/sisad-pdfme/config/configCompiler';
import {
  planConfigChange,
  disabledCapabilities,
  enabledCapabilities,
} from '../../../../../src/sisad-pdfme/config/configEffectPlan';
import { createSisadPdfmeConfigService } from '../../../../../src/sisad-pdfme/config/SisadPdfmeConfigService';

describe('config effect plan', () => {
  it('un cambio idéntico es un no-op sin efectos', () => {
    const previous = compileSisadPdfmeConfig({});
    const next = compileSisadPdfmeConfig({}, { previous });
    const plan = planConfigChange({ previous, next });
    expect(plan.unchanged).toBe(true);
    expect(plan.transitions).toEqual([]);
    expect(plan.effects).toEqual([]);
    expect(plan.fromRevision).toBe(plan.toRevision);
  });

  it('apagar el canvas propaga la transición a sus dependientes', () => {
    const previous = compileSisadPdfmeConfig({});
    const next = compileSisadPdfmeConfig({ canvas: { enabled: false } }, { previous });
    const plan = planConfigChange({ previous, next, context: { selectionCount: 1 } });

    expect(plan.unchanged).toBe(false);
    expect(plan.effects).toContain('recompute-capabilities');

    const apagadas = disabledCapabilities(plan);
    expect(apagadas).toContain('feature:canvas');
    expect(apagadas).toContain('action:delete-schema');
    expect(apagadas).toContain('component:canvas-toolbar');
    expect(apagadas).toContain('view:grid');
  });

  it('cada transición declara las dimensiones concretas que cambiaron', () => {
    const previous = compileSisadPdfmeConfig({});
    const next = compileSisadPdfmeConfig({ runtime: { readonly: true } }, { previous });
    const plan = planConfigChange({ previous, next, context: { selectionCount: 1 } });

    const transition = plan.transitions.find((entry) => entry.capabilityId === 'action:delete-schema');
    expect(transition).toBeDefined();
    expect(transition?.changedFlags).toContain('executable');
    expect(transition?.changedFlags).toContain('permitted');
    // Readonly no oculta: la dimensión de visibilidad no debe moverse.
    expect(transition?.changedFlags).not.toContain('visible');
    plan.transitions.forEach((entry) => expect(entry.changedFlags.length).toBeGreaterThan(0));
  });

  it('un cambio estructural pide reconstruir recursos', () => {
    const previous = compileSisadPdfmeConfig({});
    const next = compileSisadPdfmeConfig({ persistence: { mode: 'local' } }, { previous });
    const plan = planConfigChange({ previous, next });
    expect(plan.effects).toContain('rebuild-resources');
    expect(plan.impact.rebuildResources).toBe(true);
  });

  it('encender un toggle antes prohibido aparece como capability habilitada', () => {
    const previous = compileSisadPdfmeConfig({ visibility: { canvas: { grid: false } } });
    const next = compileSisadPdfmeConfig({}, { previous });
    const plan = planConfigChange({ previous, next });
    expect(enabledCapabilities(plan)).toContain('view:grid');
  });

  it('el servicio adjunta el plan a cada cambio notificado', () => {
    const service = createSisadPdfmeConfigService({});
    const changes: string[][] = [];
    service.subscribe((change) => changes.push(change.changeSet.effects));

    const change = service.update({ canvas: { enabled: false } });
    expect(change.changeSet.unchanged).toBe(false);
    expect(change.changeSet.toRevision).toBe(2);
    expect(disabledCapabilities(change.changeSet)).toContain('feature:canvas');
    expect(changes).toHaveLength(1);
    expect(changes[0]).toContain('recompute-capabilities');
  });
});
