import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { createSelectionCommands } from '../../src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js';
import { buildCanvasContextMenuGroups, buildSelectionToolbarModel } from '../../src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.js';

describe('selectionCommands inline edit bridge', () => {
  const schema = {
    id: 'schema-1',
    name: 'campo-1',
    type: 'text',
    content: 'Texto inicial',
  } as SchemaForUI;
  const imageSchema = {
    id: 'schema-image-1',
    name: 'imagen-1',
    type: 'image',
  } as SchemaForUI;

  const createContext = (overrides: Partial<Parameters<typeof createSelectionCommands>[0]> = {}) => {
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
        canEditStructure: true,
      },
      ...overrides,
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

  it('keeps reviewers in view/comment mode without structural edit commands', () => {
    const { commands, changeSchemas, commitSchemas, removeSchemas, requestInlineEdit } = createContext({
      collaborationContext: {
        fileId: 'file-1',
        actorId: 'reviewer-1',
        ownerRecipientId: 'reviewer-1',
        ownerRecipientIds: ['reviewer-1'],
        ownerRecipientName: 'Revisor',
        ownerColor: '#7C3AED',
        userColor: '#7C3AED',
        canEditStructure: false,
      },
    });

    commands.duplicateSelection();
    commands.deleteSelection();
    commands.toggleReadOnly();
    commands.toggleRequired();
    commands.toggleHidden?.();
    commands.bringForward();
    commands.sendBackward();
    commands.alignSelection('left');
    commands.distributeSelection('horizontal');
    commands.renameLabel?.();
    commands.editTextInline?.();

    expect(commands.canEditStructure).toBe(false);
    expect(commitSchemas).not.toHaveBeenCalled();
    expect(changeSchemas).not.toHaveBeenCalled();
    expect(removeSchemas).not.toHaveBeenCalled();
    expect(requestInlineEdit).not.toHaveBeenCalled();
  });

  it('only shows field actions when every selected schema is a field', () => {
    const fieldToolbar = buildSelectionToolbarModel({
      activeSchemas: [schema],
      selectionCount: 1,
      interactionPhase: 'idle',
      mode: 'expanded',
    });

    expect(fieldToolbar.secondarySections.some((section) => section.id === 'data')).toBe(true);
    expect(
      fieldToolbar.secondarySections
        .find((section) => section.id === 'state')
        ?.items.some((item) => item.id === 'required'),
    ).toBe(true);

    const imageToolbar = buildSelectionToolbarModel({
      activeSchemas: [imageSchema],
      selectionCount: 1,
      interactionPhase: 'idle',
      mode: 'expanded',
    });

    expect(imageToolbar.secondarySections.some((section) => section.id === 'data')).toBe(false);
    expect(
      imageToolbar.secondarySections
        .find((section) => section.id === 'state')
        ?.items.some((item) => item.id === 'required'),
    ).toBe(false);

    const { commands } = createContext();

    const fieldGroups = buildCanvasContextMenuGroups({
      mode: 'single',
      commands,
      selectionSchemas: [schema],
      canEditStructure: commands.canEditStructure,
    });

    expect(fieldGroups.some((group) => group.items.some((item) => item.id === 'required'))).toBe(true);

    const imageGroups = buildCanvasContextMenuGroups({
      mode: 'single',
      commands,
      selectionSchemas: [imageSchema],
      canEditStructure: commands.canEditStructure,
    });

    expect(imageGroups.some((group) => group.items.some((item) => item.id === 'required'))).toBe(false);
  });

  it('disables structural canvas actions for reviewers while keeping add-comment available', () => {
    const { commands } = createContext({
      collaborationContext: {
        fileId: 'file-1',
        actorId: 'reviewer-1',
        ownerRecipientId: 'reviewer-1',
        ownerRecipientIds: ['reviewer-1'],
        ownerRecipientName: 'Revisor',
        ownerColor: '#7C3AED',
        userColor: '#7C3AED',
        canEditStructure: false,
      },
    });

    const groups = buildCanvasContextMenuGroups({
      mode: 'single',
      commands,
      selectionSchemas: [schema],
      canEditStructure: commands.canEditStructure,
      externalActions: {
        onCreateComment: vi.fn(),
      },
    });

    const mainGroup = groups.find((group) => group.id === 'single-main');
    expect(mainGroup).toBeDefined();
    expect(mainGroup?.items.find((item) => item.id === 'add-comment')?.disabled).toBe(false);
    expect(mainGroup?.items.find((item) => item.id === 'duplicate')?.disabled).toBe(true);
    expect(mainGroup?.items.find((item) => item.id === 'delete')?.disabled).toBe(true);
  });

  it('shows add-comment in the empty canvas context menu', () => {
    const onCreateComment = vi.fn();
    const groups = buildCanvasContextMenuGroups({
      mode: 'empty',
      commands: createContext().commands,
      selectionSchemas: [],
      canEditStructure: true,
      externalActions: {
        onCreateComment,
      },
    });

    const createGroup = groups.find((group) => group.id === 'canvas-create');
    const addCommentItem = createGroup?.items.find((item) => item.id === 'add-comment');

    expect(addCommentItem).toBeDefined();
    expect(addCommentItem?.disabled).toBe(false);
    addCommentItem?.onSelect?.();
    expect(onCreateComment).toHaveBeenCalledTimes(1);
  });
});
