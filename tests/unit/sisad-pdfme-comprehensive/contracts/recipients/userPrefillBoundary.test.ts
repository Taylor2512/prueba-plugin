/**
 * Frontera User / Recipient en el autorrelleno (RTP-525).
 *
 * `User` es el concepto del core reusable; `Recipient` pertenece al host. La
 * regla es asimétrica a propósito: se ACEPTA `recipient.*` al leer —las
 * plantillas ya persistidas lo llevan dentro de su JSON— pero se EMITE siempre
 * `user.*` al escribir.
 *
 * Romper la lectura rompería documentos existentes; seguir emitiendo el alias
 * perpetuaría la fuga del vocabulario del host dentro del core.
 */
import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  applyRecipientPrefill,
  normalizePrefillSource,
  resolvePrefillSource,
  resolveUserPrefillValue,
} from '../../../../../src/sisad-pdfme/ui/recipientPrefill';
import {
  fullName,
  emailAddress,
  company,
  title,
} from '../../../../../src/sisad-pdfme/schemas/textLike/textLikePresets';

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

describe('compatibilidad de lectura con plantillas legacy', () => {
  it('acepta recipient.* y lo resuelve al canónico', () => {
    const alias = {
      'recipient.name': 'user.name',
      'recipient.email': 'user.email',
      'recipient.company': 'user.company',
      'recipient.title': 'user.title',
    } as const;
    Object.entries(alias).forEach(([legacy, canonico]) => {
      expect(normalizePrefillSource(legacy), legacy).toBe(canonico);
      expect(resolvePrefillSource(schema({ prefillSource: legacy })), legacy).toBe(canonico);
    });
  });

  it('una plantilla legacy se autorrellena igual que una nueva', () => {
    const legacy = applyRecipientPrefill(schema({ prefillSource: 'recipient.email' }), usuario);
    const nueva = applyRecipientPrefill(schema({ prefillSource: 'user.email' }), usuario);
    expect(legacy.content).toBe('ada@example.test');
    expect(legacy.content).toBe(nueva.content);
    expect(legacy.readOnly).toBe(true);
  });

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
