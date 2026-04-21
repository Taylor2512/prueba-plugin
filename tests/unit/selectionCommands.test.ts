import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { createSelectionCommands } from '../../src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js';

describe('selectionCommands inline edit bridge', () => {
  const schema = {
    id: 'schema-1',
    name: 'campo-1',
    type: 'text',
    content: 'Texto inicial',
  } as SchemaForUI;

  const createContext = () => {
    const activeElement = document.createElement('div');
    activeElement.id = schema.id;

    const requestInlineEdit = vi.fn();
    const changeSchemas = vi.fn();
    const commitSchemas = vi.fn();
    const removeSchemas = vi.fn();
    const onOpenProperties = vi.fn();

    const commands = createSelectionCommands({
      activeElements: [activeElement],
      schemasList: [[schema]],
      pageCursor: 0,
      pageSize: { width: 210, height: 297 },
      changeSchemas,
      commitSchemas,
      removeSchemas,
      onOpenProperties,
      requestInlineEdit,
      collaborationContext: {
        fileId: 'file-1',
        actorId: 'sales-user-1',
        ownerRecipientId: 'sales-user-1',
        ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
        ownerRecipientName: 'Ventas Ejecutivas',
        ownerColor: '#2563EB',
        userColor: '#2563EB',
      },
    });

    return { commands, requestInlineEdit, changeSchemas, commitSchemas, removeSchemas, onOpenProperties };
  };

  it('requests inline editing for the visible label instead of opening a browser prompt', () => {
    const { commands, requestInlineEdit } = createContext();

    commands.renameLabel?.();

    expect(requestInlineEdit).toHaveBeenCalledTimes(1);
    expect(requestInlineEdit).toHaveBeenCalledWith({ schemaId: 'schema-1', target: 'name' });
  });

  it('requests inline editing for schema content instead of opening a browser prompt', () => {
    const { commands, requestInlineEdit } = createContext();

    commands.editTextInline?.();

    expect(requestInlineEdit).toHaveBeenCalledTimes(1);
    expect(requestInlineEdit).toHaveBeenCalledWith({ schemaId: 'schema-1', target: 'content' });
  });

  it('duplicates the active selection with collaboration metadata from context and clears locks', () => {
    const { commands, commitSchemas } = createContext();

    commands.duplicateSelection();

    expect(commitSchemas).toHaveBeenCalledTimes(1);
    const nextSchemas = commitSchemas.mock.calls[0][0] as SchemaForUI[];
    expect(nextSchemas).toHaveLength(2);
    const clone = nextSchemas[1];

    expect(clone.id).not.toBe('schema-1');
    expect(clone.schemaUid).toBe(clone.id);
    expect(clone.name).toBe('campo-1 copy');
    expect(clone.fileId).toBe('file-1');
    expect(clone.ownerRecipientId).toBe('sales-user-1');
    expect(clone.ownerRecipientIds).toEqual(['sales-user-1', 'legal-user-1']);
    expect(clone.ownerRecipientName).toBe('Ventas Ejecutivas');
    expect(clone.ownerColor).toBe('#2563EB');
    expect(clone.userColor).toBe('#2563EB');
    expect(clone.state).toBe('draft');
    expect(clone.lock).toBeUndefined();
  });
});
