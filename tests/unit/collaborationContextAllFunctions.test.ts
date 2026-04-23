import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  buildEffectiveCollaborationContext,
  buildRecipientColorMap,
  buildRecipientNameMap,
  filterSchemasForCollaborationView,
  normalizeCollaborationRecipients,
  resolveActiveRecipient,
  resolveOwnerMode,
  resolveSchemaCollaborationState,
  schemaMatchesCollaborationView,
} from '../../src/sisad-pdfme/ui/collaborationContext.js';

describe('collaborationContext all exported functions', () => {
  it('builds recipient maps with trimmed values and ignores invalid entries', () => {
    const recipients = normalizeCollaborationRecipients([
      { id: 'u1', name: 'User 1', color: ' #111111 ' },
      { id: 'u2', tag: 'Tag2' },
    ]);

    const colorMap = buildRecipientColorMap(recipients);
    const nameMap = buildRecipientNameMap(recipients);

    expect(colorMap.get('u1')).toBe('#111111');
    expect(colorMap.get('u2')).toBeUndefined();
    expect(nameMap.get('u1')).toBe('User 1');
    expect(nameMap.get('u2')).toBe('Tag2');
  });

  it('resolves active recipient fallback and supports users alias', () => {
    const resolved = resolveActiveRecipient({
      users: [
        { id: 'u1', name: 'User 1' },
        { id: 'u2', name: 'User 2' },
      ],
      activeRecipientId: 'missing',
    });

    expect(resolved.activeRecipientId).toBe('u1');
    expect(resolved.activeRecipient?.name).toBe('User 1');
  });

  it('builds effective context and derives canEditStructure from active role', () => {
    const reviewer = buildEffectiveCollaborationContext(
      {
        actorId: 'u1',
        activeRecipientId: 'u1',
        recipientOptions: [{ id: 'u1', name: 'User 1', role: 'reviewer', color: '#123456' }],
      },
      'file-1',
    );
    expect(reviewer.canEditStructure).toBe(false);

    const editor = buildEffectiveCollaborationContext(
      {
        actorId: 'u2',
        activeRecipientId: 'u2',
        recipientOptions: [{ id: 'u2', name: 'User 2', role: 'editor', color: '#654321' }],
      },
      'file-1',
    );
    expect(editor.canEditStructure).toBe(true);
  });

  it('resolves owner mode across single/multi/shared and inferred fallback', () => {
    expect(resolveOwnerMode('single', ['u1'])).toBe('single');
    expect(resolveOwnerMode('multi', ['u1', 'u2'])).toBe('multi');
    expect(resolveOwnerMode('shared', ['u1', 'u2'])).toBe('shared');
    expect(resolveOwnerMode(undefined, ['u1'])).toBe('single');
    expect(resolveOwnerMode(undefined, ['u1', 'u2'])).toBe('multi');
    expect(resolveOwnerMode(undefined, [])).toBeUndefined();
  });

  it('resolves schema state from maps and applies actorColor fallback', () => {
    const context = {
      recipientColorMap: new Map([
        ['u1', '#111111'],
        ['u2', '#222222'],
      ]),
      recipientNameMap: new Map([
        ['u1', 'User 1'],
        ['u2', 'User 2'],
      ]),
      activeRecipientId: 'u1',
      isGlobalView: false,
      actorColor: '#ff00ff',
    };

    const state = resolveSchemaCollaborationState(
      {
        id: 'schema-1',
        name: 'campo',
        type: 'text',
        ownerRecipientId: 'u2',
        createdBy: 'u2',
      } as SchemaForUI,
      context,
    );

    expect(state.ownerRecipientName).toBe('User 2');
    expect(state.ownerColor).toBe('#222222');
    expect(state.userColor).toBe('#222222');
    expect(state.isOwnerActive).toBe(false);
    expect(state.isOwnerOther).toBe(true);

    const fallbackColor = resolveSchemaCollaborationState(
      {
        id: 'schema-2',
        name: 'campo2',
        type: 'text',
      } as SchemaForUI,
      context,
    );

    expect(fallbackColor.userColor).toBe('#ff00ff');
  });

  it('matches and filters collaboration view correctly', () => {
    const context = buildEffectiveCollaborationContext(
      {
        actorId: 'u1',
        activeRecipientId: 'u1',
        recipientOptions: [
          { id: 'u1', name: 'User 1', color: '#111111' },
          { id: 'u2', name: 'User 2', color: '#222222' },
        ],
      },
      'file-1',
    );

    const own = { id: '1', name: 'a', type: 'text', ownerRecipientId: 'u1' } as SchemaForUI;
    const other = { id: '2', name: 'b', type: 'text', ownerRecipientId: 'u2' } as SchemaForUI;
    const shared = {
      id: '3',
      name: 'c',
      type: 'text',
      ownerMode: 'shared',
      ownerRecipientIds: ['u1', 'u2'],
    } as SchemaForUI;

    expect(schemaMatchesCollaborationView(own, context)).toBe(true);
    expect(schemaMatchesCollaborationView(other, context)).toBe(false);
    expect(schemaMatchesCollaborationView(shared, context)).toBe(true);

    const filtered = filterSchemasForCollaborationView([own, other, shared], context);
    expect(filtered.map((s) => s.id)).toEqual(['1', '3']);
  });
});
