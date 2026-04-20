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
});
