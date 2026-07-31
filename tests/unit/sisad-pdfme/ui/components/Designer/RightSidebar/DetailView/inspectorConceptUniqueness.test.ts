import { describe, expect, it } from 'vitest';
import { COMMON_PROPERTY_MAP } from '@/sisad-pdfme/schemas/propPanel/commonInspectorFields';

/**
 * Reglas no negociables de la taxonomía del inspector
 * (docs/03-designer/12-inspector-taxonomy.md §2).
 *
 * El mapa usa claves previas: general=Información, validation=Reglas de llenado,
 * data=Interacción, connections=Datos y conexiones, style=Formato,
 * layout=Ubicación, collaboration=Asignación y bloqueo.
 */
const SECTION_BY_CONCEPT: Record<string, string> = {
  // Reglas de llenado
  required: 'validation',
  mandatory: 'validation',
  'validation.type': 'validation',
  'validation.pattern': 'validation',
  'validation.message': 'validation',
  // Interacción
  readOnly: 'data',
  editableBySender: 'data',
  editableByRecipient: 'data',
  placeholder: 'data',
  defaultValue: 'data',
  maxLength: 'data',
  masked: 'data',
  fixedWidth: 'data',
  // Asignación y bloqueo
  locked: 'collaboration',
  restrictChanges: 'collaboration',
  // Datos y conexiones
  dataLabel: 'connections',
  tabLabel: 'connections',
  fieldKey: 'connections',
};

describe('inspector concept uniqueness', () => {
  for (const [concept, section] of Object.entries(SECTION_BY_CONCEPT)) {
    it(`${concept} vive solo en la sección ${section}`, () => {
      expect(COMMON_PROPERTY_MAP[concept]).toBe(section);
    });
  }

  it('obligatorio y solo lectura nunca comparten sección', () => {
    expect(COMMON_PROPERTY_MAP.required).not.toBe(COMMON_PROPERTY_MAP.readOnly);
  });

  it('la capacidad de edición no se mezcla con ownership ni bloqueo', () => {
    expect(COMMON_PROPERTY_MAP.editableBySender).not.toBe(COMMON_PROPERTY_MAP.locked);
    expect(COMMON_PROPERTY_MAP.editableByRecipient).not.toBe(COMMON_PROPERTY_MAP.locked);
  });

  it('ningún concepto de captura cae en Asignación y bloqueo', () => {
    const collaborationKeys = Object.entries(COMMON_PROPERTY_MAP)
      .filter(([, section]) => section === 'collaboration')
      .map(([key]) => key);
    expect(collaborationKeys.sort()).toEqual(['locked', 'restrictChanges']);
  });
});
