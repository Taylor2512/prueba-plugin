import { describe, expect, it } from 'vitest';
import { resolveInspectorFamily, type InspectorFamily } from '@/sisad-pdfme/schemas/schemaFamilies';
import { getDetailProfile } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy';

/**
 * Matriz canónica del inspector (docs/03-designer/12-inspector-taxonomy.md §3).
 *
 * Este test es el contrato: familia por tipo y secciones por familia. Cualquier
 * cambio en la clasificación tiene que pasar por aquí.
 */
const TYPES_BY_FAMILY: Record<InspectorFamily, string[]> = {
  'text-like': [
    'text',
    'multiVariableText',
    'number',
    'date',
    'dateTime',
    'time',
    'fullName',
    'emailAddress',
    'company',
    'title',
  ],
  choice: ['select', 'dropdown', 'radioGroup', 'checkboxGroup', 'checkbox'],
  signature: ['signature', 'initials', 'dateSigned'],
  action: ['approve', 'decline', 'attachment', 'note'],
  visual: [
    'image',
    'svg',
    'table',
    'line',
    'rectangle',
    'ellipse',
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
  ],
};

describe('inspector family matrix', () => {
  describe('cada tipo resuelve a una única familia de inspector', () => {
    for (const [family, types] of Object.entries(TYPES_BY_FAMILY)) {
      for (const type of types) {
        it(`${type} → ${family}`, () => {
          expect(resolveInspectorFamily(type)).toBe(family);
        });
      }
    }

    it('los tipos desconocidos caen en text-like', () => {
      expect(resolveInspectorFamily('custom-plugin-type')).toBe('text-like');
      expect(resolveInspectorFamily('')).toBe('text-like');
    });
  });

  describe('secciones por familia', () => {
    it('text-like abre información, reglas de llenado e interacción', () => {
      for (const type of TYPES_BY_FAMILY['text-like']) {
        const profile = getDetailProfile(type);
        expect(profile.defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
        expect(profile.visibleSections).toContain('validation');
        expect(profile.visibleSections).not.toContain('options');
      }
    });

    it('choice abre opciones salvo la casilla suelta', () => {
      for (const type of ['select', 'dropdown', 'radioGroup', 'checkboxGroup']) {
        const profile = getDetailProfile(type);
        expect(profile.visibleSections).toContain('options');
        expect(profile.defaultOpenSections).toEqual(['identity', 'options', 'validation']);
      }
      const checkbox = getDetailProfile('checkbox');
      expect(checkbox.visibleSections).not.toContain('options');
      expect(checkbox.defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
    });

    it('signature mantiene reglas de llenado y su bloque propio', () => {
      for (const type of TYPES_BY_FAMILY.signature) {
        const profile = getDetailProfile(type);
        expect(profile.defaultOpenSections).toEqual(['identity', 'behavior', 'validation']);
        expect(profile.visibleSections).toContain('validation');
        expect(profile.visibleSections).not.toContain('options');
      }
    });

    it('action no ofrece reglas de llenado ni opciones', () => {
      for (const type of TYPES_BY_FAMILY.action) {
        const profile = getDetailProfile(type);
        expect(profile.visibleSections).not.toContain('validation');
        expect(profile.visibleSections).not.toContain('options');
        expect(profile.defaultOpenSections).toEqual(['identity', 'behavior', 'box']);
      }
    });

    it('visual abre caja y formato, sin captura de datos', () => {
      for (const type of TYPES_BY_FAMILY.visual) {
        const profile = getDetailProfile(type);
        expect(profile.defaultOpenSections).toEqual(['identity', 'box', 'appearance']);
        expect(profile.visibleSections).not.toContain('validation');
        expect(profile.visibleSections).not.toContain('options');
      }
    });

    it('todas las familias comparten el orden canónico y las secciones transversales', () => {
      for (const types of Object.values(TYPES_BY_FAMILY)) {
        for (const type of types) {
          const { visibleSections } = getDetailProfile(type);
          expect(visibleSections).toContain('identity');
          expect(visibleSections).toContain('box');
          expect(visibleSections).toContain('appearance');
          expect(visibleSections).toContain('collaboration');
          expect(visibleSections).toContain('advanced');
          // el orden visual es estable: identity siempre primero
          expect(visibleSections[0]).toBe('identity');
        }
      }
    });
  });
});
