import { describe, expect, it } from 'vitest';
import {
  builtInSchemaDefinitions,
  changeSchemas,
  createDefaultSchema,
  generateUniqueSchemaName,
  getSchemaDefinition,
  validateSchemaNameUniqueness,
} from '@sisad-pdfme/schemas';

const EXPECTED_TYPES = [
  'text', 'number', 'image', 'svg', 'signature', 'initials', 'dateSigned',
  'fullName', 'emailAddress', 'company', 'title', 'table', 'line', 'rectangle',
  'ellipse', 'dateTime', 'date', 'time', 'select', 'radioGroup', 'checkbox',
  'checkboxGroup', 'attachment', 'note', 'approve', 'decline',
];

describe('schema registry', () => {
  it('registra todas las familias funcionales esperadas', () => {
    const types = new Set(builtInSchemaDefinitions.map((definition) => definition.type));
    for (const type of EXPECTED_TYPES) {
      expect(types.has(type), `Falta schema type ${type}`).toBe(true);
      expect(getSchemaDefinition(type)).not.toBeNull();
    }
  });

  it('crea schema con identidad, routing, owner y geometría', () => {
    const created = createDefaultSchema('text', {
      schemaUid: 'uid-1',
      id: 'row-1',
      fileId: 'file-a',
      pageNumber: 2,
      ownerRecipientId: 'recipient-1',
      position: { x: 12, y: 34 },
    });

    expect(created).toMatchObject({
      id: 'row-1',
      schemaUid: 'uid-1',
      type: 'text',
      fileId: 'file-a',
      fileTemplateId: 'file-a',
      pageNumber: 2,
      ownerRecipientId: 'recipient-1',
      position: { x: 12, y: 34 },
    });
    expect(created.width).toBeGreaterThan(0);
    expect(created.height).toBeGreaterThan(0);
  });

  it('genera nombres únicos case-insensitive', () => {
    const existing = [
      { schemaUid: '1', name: 'text' },
      { schemaUid: '2', name: 'text_2' },
    ] as any;
    expect(generateUniqueSchemaName('text', existing)).toBe('text_3');
    expect(validateSchemaNameUniqueness('TEXT', existing).isUnique).toBe(false);
    expect(validateSchemaNameUniqueness('text', existing, '1').isUnique).toBe(true);
  });

  it('aplica cambios por path sin mutar la entrada', () => {
    const original = [{ id: 'a', schemaUid: 'a', name: 'a', type: 'text', __designer: {} }] as any;
    const next = changeSchemas(original, [
      { schemaId: 'a', key: 'required', value: true },
      { schemaId: 'a', key: '__designer.group.groupId', value: 'group-1' },
    ] as any);

    expect(next).not.toBe(original);
    expect(next[0]).not.toBe(original[0]);
    expect(next[0].required).toBe(true);
    expect(next[0].__designer.group.groupId).toBe('group-1');
    expect(original[0].required).toBeUndefined();
  });
});
