import { describe, expect, it, vi } from 'vitest';

vi.mock('@sisad-pdfme/schemas', () => {
  const builtInSchemaDefinitions = [{ type: 'text' }, { type: 'checkbox' }];

  return {
    builtInSchemaDefinitions,
    createDefaultSchema: (type: string, context: Record<string, unknown> = {}) => ({
      type,
      name: `${type}-${String(context.id || 'schema')}`,
      id: context.id || `${type}-schema`,
      schemaUid: context.schemaUid || `${type}-uid`,
      position: context.position || { x: 0, y: 0 },
      width: type === 'checkbox' ? 8 : 45,
      height: type === 'checkbox' ? 8 : 7,
      content: '',
    }),
    resolveSchemaFamily: (type: string) => (type === 'checkbox' ? 'boolean' : 'text'),
  };
});

import {
  buildMultiUserShowcaseTemplate,
  MULTI_USER_RECIPIENTS,
} from '@/sisad-pdfme/labs';

describe('buildMultiUserShowcaseTemplate', () => {
  it('propaga el ownership y el color del recipient en los schemas del diseñador', () => {
    const template = buildMultiUserShowcaseTemplate(
      [
        { title: 'Grupo A', types: ['text', 'checkbox'] },
        { title: 'Grupo B', types: ['text'] },
      ],
      [
        { id: 'alpha', name: 'Alpha', color: '#2563eb' },
        { id: 'beta', name: 'Beta', color: '#f59e0b' },
      ],
    );

    const schemas = template.schemas.flat();

    expect(schemas).toHaveLength(3);
    expect(schemas[0]).toMatchObject({
      ownerRecipientId: 'alpha',
      ownerRecipientIds: ['alpha'],
      ownerRecipientName: 'Alpha',
      ownerColor: '#2563EB',
      userColor: '#2563EB',
    });
    expect(schemas[1]).toMatchObject({
      ownerRecipientId: 'beta',
      ownerRecipientIds: ['beta'],
      ownerRecipientName: 'Beta',
      ownerColor: '#F59E0B',
      userColor: '#F59E0B',
    });
    expect(schemas[2]).toMatchObject({
      ownerRecipientId: 'alpha',
      ownerRecipientIds: ['alpha'],
      ownerRecipientName: 'Alpha',
      ownerColor: '#2563EB',
      userColor: '#2563EB',
    });
  });

  it('usa recipients por defecto cuando no se pasa una lista explícita', () => {
    const template = buildMultiUserShowcaseTemplate([{ title: 'Grupo', types: ['text'] }]);

    expect(template.schemas[0][0].ownerRecipientId).toBe(MULTI_USER_RECIPIENTS[0].id);
    expect(template.schemas[0][0].ownerColor).toBe('#2563EB');
  });
});
