import { describe, expect, it } from 'vitest';
import { getDetailProfile } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy';

/**
 * Contrato de perfiles por tipo: qué secciones ve y cuáles nacen abiertas cada
 * familia de schema en el inspector derecho.
 */
describe('detail profiles by schema type', () => {
  it('trata fecha y hora como campos de captura, con reglas de llenado', () => {
    for (const type of ['date', 'dateTime', 'time']) {
      const profile = getDetailProfile(type);
      expect(profile.visibleSections).toContain('validation');
      expect(profile.defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
    }
  });

  it('mantiene el mismo perfil para texto y número', () => {
    expect(getDetailProfile('text').defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
    expect(getDetailProfile('number').defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
  });

  it('abre formato en tipos visuales y no les ofrece reglas de llenado', () => {
    for (const type of ['image', 'svg', 'table', 'rectangle', 'line', 'ellipse', 'qrcode', 'code128']) {
      const profile = getDetailProfile(type);
      expect(profile.defaultOpenSections).toEqual(['identity', 'box', 'appearance']);
      expect(profile.visibleSections).not.toContain('validation');
      expect(profile.visibleSections).not.toContain('options');
    }
  });

  it('abre opciones en los tipos basados en lista', () => {
    for (const type of ['select', 'dropdown', 'radioGroup', 'checkboxGroup']) {
      const profile = getDetailProfile(type);
      expect(profile.visibleSections).toContain('options');
      expect(profile.defaultOpenSections).toEqual(['identity', 'options', 'validation']);
    }
  });

  it('no enruta la casilla suelta al perfil de opciones', () => {
    const profile = getDetailProfile('checkbox');
    expect(profile.visibleSections).not.toContain('options');
    expect(profile.defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
  });

  it('prioriza el bloque de firma y sus reglas de llenado', () => {
    for (const type of ['signature', 'initials', 'dateSigned']) {
      const profile = getDetailProfile(type);
      expect(profile.defaultOpenSections).toEqual(['identity', 'behavior', 'validation']);
      // una firma puede exigirse: Reglas de llenado deja de estar oculta
      expect(profile.visibleSections).toContain('validation');
    }
  });

  it('deja los tipos de acción centrados en comportamiento y caja', () => {
    for (const type of ['attachment', 'approve', 'decline', 'note']) {
      expect(getDetailProfile(type).defaultOpenSections).toEqual(['identity', 'behavior', 'box']);
    }
  });

  it('trata los tipos desconocidos como campos de captura', () => {
    // Un plugin de terceros sin familia declarada recibe el perfil text-like:
    // es el único que expone nombre, reglas de llenado e interacción.
    const profile = getDetailProfile('custom-plugin-type');
    expect(profile.defaultOpenSections).toEqual(['identity', 'validation', 'behavior']);
    expect(profile.visibleSections).toContain('identity');
  });
});
