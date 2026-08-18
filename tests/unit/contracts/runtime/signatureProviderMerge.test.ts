/**
 * Contrato de `signatureProviders` como prop pública.
 *
 * La normalización vive fuera del Designer porque el runtime de formulario
 * recibe la misma prop y debe resolverla igual: mientras estuvo duplicada,
 * `SisadPdfmePreviewRuntime` declaraba `signatureProviders` sin consumirlo.
 */
import { describe, expect, it } from 'vitest';
import {
  mergeSignatureProviders,
  normalizeSignatureProvider,
} from '@sisad-pdfme/react/signatureProviderMerge';

describe('normalizeSignatureProvider', () => {
  it('descarta null', () => expect(normalizeSignatureProvider(null)).toBeNull());
  it('descarta undefined', () => expect(normalizeSignatureProvider(undefined)).toBeNull());
  it('descarta strings', () => expect(normalizeSignatureProvider('uanataca')).toBeNull());
  it('descarta números', () => expect(normalizeSignatureProvider(7)).toBeNull());

  it('conserva key y label', () => {
    const provider = normalizeSignatureProvider({ key: 'uanataca', label: 'Uanataca' });
    expect(provider?.key).toBe('uanataca');
    expect(provider?.label).toBe('Uanataca');
  });

  it('aplica defaults cuando faltan key/label', () => {
    const provider = normalizeSignatureProvider({});
    expect(provider?.key).toBe('provider');
    expect(provider?.label).toBe('Provider');
  });

  it('recorta espacios en key y label', () => {
    const provider = normalizeSignatureProvider({ key: '  a  ', label: '  B  ' });
    expect(provider?.key).toBe('a');
    expect(provider?.label).toBe('B');
  });

  it('marca el provider del host como no interno', () => {
    expect(normalizeSignatureProvider({ key: 'a' })?.internal).toBe(false);
  });

  it('supportsVisibleSignature es opt-out, no opt-in', () => {
    expect(normalizeSignatureProvider({ key: 'a' })?.capabilities.supportsVisibleSignature).toBe(true);
    expect(
      normalizeSignatureProvider({ key: 'a', capabilities: { supportsVisibleSignature: false } })
        ?.capabilities.supportsVisibleSignature,
    ).toBe(false);
  });

  it('el resto de capabilities son opt-in', () => {
    const provider = normalizeSignatureProvider({ key: 'a' });
    expect(provider?.capabilities.supportsWebhook).toBe(false);
    expect(provider?.capabilities.supportsOtp).toBe(false);
    expect(provider?.capabilities.supportsBiometric).toBe(false);
  });

  it('promueve metadata a defaultConfig', () => {
    expect(normalizeSignatureProvider({ key: 'a', metadata: { url: 'x' } })?.defaultConfig).toEqual({
      url: 'x',
    });
  });

  it('ignora metadata no-objeto', () => {
    expect(normalizeSignatureProvider({ key: 'a', metadata: 'x' })?.defaultConfig).toBeUndefined();
  });
});

describe('mergeSignatureProviders', () => {
  const base = [{ key: 'sisad', label: 'SISAD', internal: true }] as never;

  it('sin providers del host devuelve la base', () => {
    expect(mergeSignatureProviders(base, undefined).map((p) => p.key)).toEqual(['sisad']);
  });

  it('sin base ni host devuelve vacío', () => {
    expect(mergeSignatureProviders(undefined, undefined)).toEqual([]);
  });

  it('ignora un host providers que no es array', () => {
    expect(mergeSignatureProviders(base, 'nope' as never).map((p) => p.key)).toEqual(['sisad']);
  });

  it('añade los providers del host', () => {
    const merged = mergeSignatureProviders(base, [{ key: 'uanataca', label: 'Uanataca' }]);
    expect(merged.map((p) => p.key)).toEqual(['sisad', 'uanataca']);
  });

  it('el host gana ante una colisión de key', () => {
    const merged = mergeSignatureProviders(base, [{ key: 'sisad', label: 'SISAD del host' }]);
    expect(merged).toHaveLength(1);
    expect(merged[0].label).toBe('SISAD del host');
    expect(merged[0].internal).toBe(false);
  });

  it('descarta entradas inválidas del host', () => {
    const merged = mergeSignatureProviders(base, [null, 'x', { key: 'ok', label: 'Ok' }]);
    expect(merged.map((p) => p.key)).toEqual(['sisad', 'ok']);
  });

  it('deduplica providers repetidos del host', () => {
    const merged = mergeSignatureProviders(undefined, [
      { key: 'a', label: 'Primero' },
      { key: 'a', label: 'Último' },
    ]);
    expect(merged).toHaveLength(1);
    expect(merged[0].label).toBe('Último');
  });
});
