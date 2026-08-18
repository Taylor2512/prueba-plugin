/**
 * Frontera User en el autorrelleno (RTP-525).
 */
import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  applyRecipientPrefill,
  normalizePrefillSource,
  resolvePrefillSource,
  resolveUserPrefillValue,
} from '../../../../src/sisad-pdfme/ui/recipientPrefill';
import {
  fullName,
  emailAddress,
  company,
  title,
} from '../../../../src/sisad-pdfme/schemas/textLike/textLikePresets';

const usuario = {
  id: 'user-1',
  name: 'Ada Lovelace',
  email: 'ada@example.test',
  company: 'Analytical Engines',
  title: 'Matematica',
};

/**
 * Schema mínimo pero COMPLETO: `applyRecipientPrefill` recibe un
 * `SchemaForUI`, así que un objeto parcial con `as never` haría que el
 * genérico se resolviera a `never` y el test dejaría de comprobar nada.
 */
type PrefillSchema = SchemaForUI & {
  prefillSource?: string;
  readOnly?: boolean;
  required?: boolean;
};

const schema = (over: Partial<PrefillSchema> = {}): PrefillSchema =>
  ({
    id: 'schema-1',
    name: 'campo',
    type: 'fullName',
    content: '',
    position: { x: 0, y: 0 },
    width: 40,
    height: 10,
    ...over,
  }) as PrefillSchema;

describe('espacio canónico', () => {
  it('los presets emiten user.*, nunca recipient.*', () => {
    const presets = { fullName, emailAddress, company, title };
    Object.entries(presets).forEach(([nombre, preset]) => {
      const source = (preset as { propPanel: { defaultSchema: Record<string, unknown> } }).propPanel
        .defaultSchema.prefillSource;
      expect(String(source), nombre).toMatch(/^user\./);
      expect(String(source), nombre).not.toMatch(/recipient/);
    });
  });

  it('normaliza las cuatro fuentes canónicas', () => {
    (['user.name', 'user.email', 'user.company', 'user.title'] as const).forEach((source) => {
      expect(normalizePrefillSource(source), source).toBe(source);
    });
  });

  it('una fuente inexistente no resuelve', () => {
    expect(normalizePrefillSource('user.inventado')).toBeNull();
    expect(normalizePrefillSource('')).toBeNull();
    expect(normalizePrefillSource(null)).toBeNull();
  });
});

describe('resolución por tipo', () => {
  it('el fallback por tipo también es canónico', () => {
    expect(resolvePrefillSource(schema({ type: 'fullName' }))).toBe('user.name');
    expect(resolvePrefillSource(schema({ type: 'emailAddress' }))).toBe('user.email');
    expect(resolvePrefillSource(schema({ type: 'company' }))).toBe('user.company');
    expect(resolvePrefillSource(schema({ type: 'title' }))).toBe('user.title');
  });
});

describe('resolución de valor', () => {
  it('lee el dato del usuario', () => {
    expect(resolveUserPrefillValue('user.name', usuario)).toBe('Ada Lovelace');
    expect(resolveUserPrefillValue('user.company', usuario)).toBe('Analytical Engines');
  });

  it('sin usuario o sin dato devuelve null en vez de cadena vacía', () => {
    expect(resolveUserPrefillValue('user.name', null)).toBeNull();
    expect(resolveUserPrefillValue('user.title', { id: 'u', name: 'Sin cargo' })).toBeNull();
    expect(resolveUserPrefillValue(null, usuario)).toBeNull();
  });

  it('un campo sin valor resuelto queda editable, no bloqueado vacío', () => {
    const sinDato = applyRecipientPrefill(schema({ type: 'title' }), { id: 'u', name: 'Ada' });
    expect(sinDato.readOnly).not.toBe(true);
  });

  it('el autorrelleno es idempotente', () => {
    const una = applyRecipientPrefill(schema({ type: 'fullName' }), usuario);
    const dos = applyRecipientPrefill(una, usuario);
    expect(dos).toBe(una);
  });

  it('un campo autorrellenado nunca queda obligatorio', () => {
    const resultado = applyRecipientPrefill(schema({ type: 'fullName', required: true }), usuario);
    expect(resultado.readOnly).toBe(true);
    expect(resultado.required).toBe(false);
  });
});
