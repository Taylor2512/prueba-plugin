/**
 * Manifest de runtime derivado del registry (RTP-475).
 *
 * El manifest mantenía sus propios conjuntos de tipos, paralelos a la
 * taxonomía del registry. Estaban desincronizados: `computedTypes` contenía
 * `'barcodes'` —la clave del mapa de plugins— y ninguno de los trece tipos
 * reales de código de barras coincidía, así que todos se clasificaban como
 * entrada obligatoria del usuario.
 *
 * Estos tests son registry-driven: recorren `getBuiltInFields()` completo y
 * fallan ante cualquier tipo sin clasificación explicable.
 */
import { describe, expect, it } from 'vitest';
import { getBuiltInFields } from '@/sisad-pdfme/schemas';
import {
  buildSchemaRuntimeManifest,
  indexSchemaRuntimeManifest,
} from '@/sisad-pdfme/runtime/schemaManifest';
import { resolveSchemaRuntimeMetadata } from '@/sisad-pdfme/schemas/schemaRuntimeMetadata';

const manifest = buildSchemaRuntimeManifest(getBuiltInFields(), { select: ['dropdown'] });
const byType = indexSchemaRuntimeManifest(manifest);

const BARCODE_TYPES = [
  'qrcode',
  'japanpost',
  'ean13',
  'ean8',
  'code39',
  'code128',
  'nw7',
  'itf14',
  'upca',
  'upce',
  'gs1datamatrix',
  'pdf417',
];

describe('schema runtime manifest', () => {
  it('cubre todo el registry sin tipos sin clasificar', () => {
    const definitions = getBuiltInFields();
    expect(manifest).toHaveLength(definitions.length);
    manifest.forEach((entry) => {
      expect(entry.family, entry.type).toBeTruthy();
      expect(entry.interactionKind, entry.type).toBeTruthy();
      expect(entry.completion, entry.type).toBeTruthy();
      expect(entry.codec, entry.type).toBeTruthy();
    });
  });

  it('un código de barras es computado, no una entrada obligatoria', () => {
    BARCODE_TYPES.forEach((type) => {
      const entry = byType.get(type);
      expect(entry, type).toBeDefined();
      expect(entry?.interactionKind, type).toBe('computed');
      expect(entry?.completion, type).toBe('none');
      expect(entry?.family, type).toBe('barcode');
    });
  });

  it('los visuales no exigen completitud', () => {
    ['image', 'svg', 'line', 'rectangle', 'ellipse'].forEach((type) => {
      expect(byType.get(type)?.interactionKind, type).toBe('visual');
      expect(byType.get(type)?.completion, type).toBe('none');
    });
  });

  it('clasifica firma, elección, acción y estructura', () => {
    expect(byType.get('signature')).toMatchObject({ interactionKind: 'signing', completion: 'signing', codec: 'opaque' });
    expect(byType.get('initials')).toMatchObject({ interactionKind: 'signing', completion: 'signing' });
    expect(byType.get('datesigned')).toMatchObject({ completion: 'signing', codec: 'date' });
    expect(byType.get('select')).toMatchObject({ interactionKind: 'choice', completion: 'selection', codec: 'array' });
    expect(byType.get('checkbox')).toMatchObject({ interactionKind: 'choice', completion: 'selection', codec: 'boolean' });
    expect(byType.get('radiogroup')).toMatchObject({ interactionKind: 'choice', codec: 'string' });
    expect(byType.get('attachment')).toMatchObject({ interactionKind: 'artifact', completion: 'artifact', codec: 'opaque' });
    expect(byType.get('approve')).toMatchObject({ interactionKind: 'action', completion: 'action' });
    expect(byType.get('table')).toMatchObject({ interactionKind: 'complex', codec: 'array' });
    expect(byType.get('number')).toMatchObject({ interactionKind: 'input', codec: 'number' });
    expect(byType.get('date')).toMatchObject({ interactionKind: 'input', codec: 'date' });
  });

  it('los alias resuelven al mismo tipo', () => {
    expect(byType.get('dropdown')).toBe(byType.get('select'));
  });

  it('no hay desajuste de mayúsculas: todo tipo resuelve en minúsculas', () => {
    getBuiltInFields().forEach((definition) => {
      expect(byType.get(definition.type.toLowerCase()), definition.type).toBeDefined();
    });
  });

  it('un tipo desconocido no aparece en el índice en vez de recibir un default', () => {
    expect(byType.get('no-existe')).toBeUndefined();
  });

  it('el manifest coincide con los metadatos del registry para cada tipo', () => {
    manifest.forEach((entry) => {
      const metadata = resolveSchemaRuntimeMetadata(entry.type);
      expect({
        family: entry.family,
        interactionKind: entry.interactionKind,
        completion: entry.completion,
        codec: entry.codec,
      }).toEqual(metadata);
    });
  });
});
