import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RUNTIME_THEME_TOKEN,
  buildDesignerRuntimeOptions,
  buildRuntimeFormOptions,
  buildRuntimeOptions,
  buildRuntimeViewerOptions,
} from '@/sisad-pdfme/runtime/options';

describe('runtime options builders', () => {
  it('completa theme token sin mutar runtimeOptions', () => {
    const source = { theme: { token: { colorPrimary: '#ff0000' } }, custom: true } as any;
    const result = buildRuntimeOptions({ runtimeOptions: source, themeToken: { borderRadius: 8 } });
    expect(result).not.toBe(source);
    expect(result.theme.token).toMatchObject({ colorPrimary: DEFAULT_RUNTIME_THEME_TOKEN.colorPrimary, borderRadius: 8 });
    expect(source.theme.token).toEqual({ colorPrimary: '#ff0000' });
  });

  it('agrega opciones exclusivas de Designer', () => {
    const engine = { id: 'engine' };
    const result = buildDesignerRuntimeOptions({ designerEngine: engine, themePreset: 'sisad-test' });
    expect(result.designerEngine).toBe(engine);
    expect(result.themePreset).toBe('sisad-test');
  });

  it('agrega contexto de firma solo a Form', () => {
    const form = buildRuntimeFormOptions({ zoomLevel: 1.25, signatureSessionKey: 'session', signatureSigner: { id: 'r1' } });
    expect(form).toMatchObject({ zoomLevel: 1.25, signatureModalFlow: true, signatureSessionKey: 'session' });
    const viewer = buildRuntimeViewerOptions();
    expect(viewer.signatureModalFlow).toBeUndefined();
  });
});
