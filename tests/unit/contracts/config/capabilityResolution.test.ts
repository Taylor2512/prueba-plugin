/**
 * Caracterización de la resolución de capabilities de configuración.
 *
 * RTP-425: los file-contract tests generados sólo comprueban sintaxis, así que
 * un identificador inexistente dentro de un `resolve` sobrevivía hasta runtime.
 * `selectActionState('paste', …)` lanzaba `ReferenceError: createState is not
 * defined`. Aquí se ejerce CADA id registrado para que ningún resolver quede
 * sin ejecutarse en la suite.
 */
import { describe, expect, it } from 'vitest';
import { resolveSisadPdfmeConfig } from '../../../../src/sisad-pdfme/config/resolveSisadPdfmeConfig';
import { actionConfigRegistry } from '../../../../src/sisad-pdfme/config/actionConfigRegistry';
import { componentRegistry } from '../../../../src/sisad-pdfme/config/componentRegistry';
import { featureRegistry } from '../../../../src/sisad-pdfme/config/featureRegistry';
import {
  selectActionState,
  selectComponentState,
  selectFeatureState,
} from '../../../../src/sisad-pdfme/config/configSelectors';

const resolved = resolveSisadPdfmeConfig({});

const BOOLEAN_FLAGS = [
  'registered',
  'supported',
  'enabled',
  'visible',
  'permitted',
  'available',
  'active',
  'executable',
] as const;

const expectWellFormedState = (state: Record<string, unknown>, id: string) => {
  expect(state.id).toBe(id);
  BOOLEAN_FLAGS.forEach((flag) => {
    expect(typeof state[flag], `${id}.${flag}`).toBe('boolean');
  });
  expect(Array.isArray(state.sources), `${id}.sources`).toBe(true);
};

describe('config capability resolution', () => {
  it('resuelve cada feature registrada sin lanzar', () => {
    Object.keys(featureRegistry).forEach((featureId) => {
      const state = selectFeatureState(resolved, featureId as never, {});
      expectWellFormedState(state as unknown as Record<string, unknown>, featureId);
      expect(state.registered).toBe(true);
    });
  });

  it('resuelve cada acción registrada sin lanzar', () => {
    Object.keys(actionConfigRegistry).forEach((actionId) => {
      const state = selectActionState(resolved, actionId as never, {});
      expectWellFormedState(state as unknown as Record<string, unknown>, actionId);
      expect(state.registered).toBe(true);
      expect(typeof state.commandId).toBe('string');
    });
  });

  it('resuelve cada componente registrado sin lanzar', () => {
    Object.keys(componentRegistry).forEach((componentId) => {
      const state = selectComponentState(resolved, componentId as never, {});
      expectWellFormedState(state as unknown as Record<string, unknown>, componentId);
      expect(state.registered).toBe(true);
    });
  });

  it('un id desconocido es fail-closed y no lanza', () => {
    const feature = selectFeatureState(resolved, 'no-existe' as never, {});
    const action = selectActionState(resolved, 'no-existe' as never, {});
    const component = selectComponentState(resolved, 'no-existe' as never, {});
    [feature, action, component].forEach((state) => {
      expect(state.registered).toBe(false);
      expect(state.executable).toBe(false);
      expect(state.reason).toBe('unknown-id');
    });
  });

  it('paste depende del portapapeles, no de la selección', () => {
    const withClipboard = selectActionState(resolved, 'paste', { hasClipboard: true });
    const withoutClipboard = selectActionState(resolved, 'paste', { hasClipboard: false });
    expect(withClipboard.executable).toBe(true);
    expect(withoutClipboard.executable).toBe(false);
    expect(withoutClipboard.reason).toBe('clipboard-empty');
  });

  it('separa disponibilidad, visibilidad y estado activo del canvas', () => {
    const disabled = resolveSisadPdfmeConfig({ canvas: { enabled: false } });
    const state = selectComponentState(disabled, 'canvas-toolbar');
    expect(state.available).toBe(false);
    expect(state.enabled).toBe(false);
    expect(state.visible).toBe(true);
    expect(state.active).toBe(false);
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('disabled-by-config');
  });
});
