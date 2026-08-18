/**
 * Contrato del compilador de configuración (RTP-435).
 *
 * `ResolvedConfig` debe ser inmutable en sus ramas de política y llevar
 * identidad: revisión monotónica + hash semántico estable.
 */
import { describe, expect, it } from 'vitest';
import {
  compileSisadPdfmeConfig,
  hashResolvedConfig,
} from '../../../../src/sisad-pdfme/config/configCompiler';
import { createSisadPdfmeConfigService } from '../../../../src/sisad-pdfme/config/SisadPdfmeConfigService';

describe('config compiler', () => {
  it('congela config y visibility', () => {
    const compiled = compileSisadPdfmeConfig({});
    expect(Object.isFrozen(compiled.config)).toBe(true);
    expect(Object.isFrozen(compiled.visibility)).toBe(true);
    expect(Object.isFrozen(compiled.config.canvas)).toBe(true);
    expect(Object.isFrozen(compiled.visibility.canvas)).toBe(true);
    expect(() => {
      (compiled.config.runtime as { readonly: boolean }).readonly = true;
    }).toThrow();
  });

  it('deja mutable el objeto raíz para que el servicio reutilice recursos', () => {
    const compiled = compileSisadPdfmeConfig({});
    expect(Object.isFrozen(compiled)).toBe(false);
  });

  it('el hash es semántico y no depende del orden de claves', () => {
    const left = compileSisadPdfmeConfig({ runtime: { readonly: true }, app: { locale: 'es' } });
    const right = compileSisadPdfmeConfig({ app: { locale: 'es' }, runtime: { readonly: true } });
    expect(left.hash).toBe(right.hash);
  });

  it('el hash ignora la identidad de funciones del host', () => {
    const left = compileSisadPdfmeConfig({ events: { onSave: () => undefined } });
    const right = compileSisadPdfmeConfig({ events: { onSave: () => 42 } });
    expect(left.hash).toBe(right.hash);
  });

  it('el hash cambia cuando cambia la política', () => {
    const off = compileSisadPdfmeConfig({});
    const on = compileSisadPdfmeConfig({ runtime: { readonly: true } });
    expect(off.hash).not.toBe(on.hash);
  });

  it('la revisión arranca en 1 y sólo avanza con cambio semántico', () => {
    const first = compileSisadPdfmeConfig({});
    expect(first.revision).toBe(1);

    const same = compileSisadPdfmeConfig({}, { previous: first });
    expect(same.revision).toBe(1);

    const changed = compileSisadPdfmeConfig({ runtime: { readonly: true } }, { previous: same });
    expect(changed.revision).toBe(2);

    const reverted = compileSisadPdfmeConfig({}, { previous: changed });
    expect(reverted.revision).toBe(3);
    expect(reverted.hash).toBe(first.hash);
  });

  it('expone issues de validación y migración sin abortar', () => {
    const compiled = compileSisadPdfmeConfig({ signatures: { defaultMode: 'provider', providers: [] } });
    expect(compiled.issues.some((issue) => issue.code === 'signatures-provider-missing')).toBe(true);
    expect(compiled.config.signatures.defaultMode).toBe('provider');
  });

  it('hashResolvedConfig sólo mira config y visibility', () => {
    const compiled = compileSisadPdfmeConfig({});
    const clone = { config: compiled.config, visibility: compiled.visibility };
    expect(hashResolvedConfig(clone)).toBe(compiled.hash);
  });
});

describe('config service identity', () => {
  it('avanza la revisión en cada cambio semántico', () => {
    const service = createSisadPdfmeConfigService({});
    const initial = service.getConfigIdentity();
    expect(initial.revision).toBe(1);

    service.update({ runtime: { readonly: true } });
    const afterChange = service.getConfigIdentity();
    expect(afterChange.revision).toBe(2);
    expect(afterChange.hash).not.toBe(initial.hash);
  });

  it('no consume revisión al reescribir el mismo valor', () => {
    const service = createSisadPdfmeConfigService({ runtime: { readonly: true } });
    const before = service.getConfigIdentity();
    service.update({ runtime: { readonly: true } });
    expect(service.getConfigIdentity()).toEqual(before);
  });

  it('la configuración resuelta que entrega el servicio no es mutable desde fuera', () => {
    const service = createSisadPdfmeConfigService({});
    const resolved = service.getResolvedConfig();
    expect(() => {
      (resolved.config.canvas as { enabled: boolean }).enabled = false;
    }).toThrow();
    expect(service.getResolvedConfig().config.canvas.enabled).toBe(true);
  });
});
