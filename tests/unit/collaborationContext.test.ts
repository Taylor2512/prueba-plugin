import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  buildEffectiveCollaborationContext,
  filterSchemasForCollaborationView,
  normalizeCollaborationRecipients,
  resolveActiveRecipient,
  resolveSchemaCollaborationState,
  schemaMatchesCollaborationView,
} from '../../src/sisad-pdfme/ui/collaborationContext.js';

describe('collaborationContext helpers', () => {
  it('normalizes recipient options, trims ids, deduplicates and derives names', () => {
    expect(
      normalizeCollaborationRecipients([
        null,
        { id: ' sales-user-1 ', name: 'Ventas' },
        { id: 'sales-user-1', name: 'Duplicado' },
        { id: 'legal-user-1', tag: 'Legal reviewer' },
        { id: 'ops-user-1' },
        { name: 'Sin id' },
      ]),
    ).toEqual([
      { id: 'sales-user-1', name: 'Ventas', color: null, role: null, team: null, tag: null },
      {
        id: 'legal-user-1',
        name: 'Legal reviewer',
        color: null,
        role: null,
        team: null,
        tag: 'Legal reviewer',
      },
      { id: 'ops-user-1', name: 'ops-user-1', color: null, role: null, team: null, tag: null },
    ]);
  });

  it('resolves active recipient with precedence activeRecipientId > activeUserId > actorId', () => {
    const options = [
      { id: 'sales-user-1', name: 'Ventas', color: '#2563EB' },
      { id: 'legal-user-1', name: 'Legal', color: '#D946EF' },
    ];

    expect(
      resolveActiveRecipient({
        recipientOptions: options,
        activeRecipientId: 'legal-user-1',
        activeUserId: 'sales-user-1',
        actorId: 'sales-user-1',
      }).activeRecipientId,
    ).toBe('legal-user-1');
    expect(
      resolveActiveRecipient({
        recipientOptions: options,
        activeUserId: 'sales-user-1',
        actorId: 'legal-user-1',
      }).activeRecipientId,
    ).toBe('sales-user-1');
    expect(
      resolveActiveRecipient({
        recipientOptions: options,
        actorId: 'legal-user-1',
      }).activeRecipientId,
    ).toBe('legal-user-1');
    expect(
      resolveActiveRecipient({
        recipientOptions: options,
        activeRecipientId: 'missing',
      }).activeRecipientId,
    ).toBe('sales-user-1');
  });

  it('builds an effective collaboration context with maps and owner defaults', () => {
    const context = buildEffectiveCollaborationContext(
      {
        actorId: 'sales-user-1',
        activeRecipientId: 'legal-user-1',
        isGlobalView: true,
        recipientOptions: [
          { id: 'sales-user-1', name: 'Ventas', color: '#2563EB' },
          { id: 'legal-user-1', name: 'Legal', color: '#D946EF' },
        ],
      },
      'file-a',
    );

    expect(context.fileId).toBe('file-a');
    expect(context.actorId).toBe('sales-user-1');
    expect(context.activeRecipientId).toBe('legal-user-1');
    expect(context.ownerRecipientId).toBe('legal-user-1');
    expect(context.ownerRecipientIds).toEqual(['legal-user-1']);
    expect(context.ownerRecipientName).toBe('Legal');
    expect(context.ownerColor).toBe('#D946EF');
    expect(context.userColor).toBe('#D946EF');
    expect(context.recipientNameMap.get('sales-user-1')).toBe('Ventas');
    expect(context.recipientColorMap.get('legal-user-1')).toBe('#D946EF');
    expect(context.isGlobalView).toBe(true);
  });

  it('resolves schema collaboration state for active, other, shared and global views', () => {
    const context = buildEffectiveCollaborationContext(
      {
        actorId: 'sales-user-1',
        activeRecipientId: 'sales-user-1',
        recipientOptions: [
          { id: 'sales-user-1', name: 'Ventas', color: '#2563EB' },
          { id: 'legal-user-1', name: 'Legal', color: '#D946EF' },
          { id: 'ops-user-1', name: 'Ops', color: '#F97316' },
        ],
      },
      'file-a',
    );

    const activeState = resolveSchemaCollaborationState(
      {
        id: 'schema-1',
        name: 'field-a',
        type: 'text',
        ownerRecipientId: 'sales-user-1',
        createdBy: 'sales-user-1',
      } as SchemaForUI,
      context,
    );
    expect(activeState.ownerMode).toBe('single');
    expect(activeState.ownerRecipientName).toBe('Ventas');
    expect(activeState.ownerColor).toBe('#2563EB');
    expect(activeState.userColor).toBe('#2563EB');
    expect(activeState.isOwnerActive).toBe(true);
    expect(activeState.isOwnerOther).toBe(false);

    const otherState = resolveSchemaCollaborationState(
      {
        id: 'schema-2',
        name: 'field-b',
        type: 'text',
        ownerRecipientIds: ['legal-user-1', 'ops-user-1'],
        createdBy: 'legal-user-1',
      } as SchemaForUI,
      context,
    );
    expect(otherState.ownerMode).toBe('multi');
    expect(otherState.ownerRecipientName).toBe('Legal');
    expect(otherState.ownerColor).toBe('#D946EF');
    expect(otherState.userColor).toBe('#D946EF');
    expect(otherState.isOwnerActive).toBe(false);
    expect(otherState.isOwnerOther).toBe(true);

    const sharedState = resolveSchemaCollaborationState(
      {
        id: 'schema-3',
        name: 'field-c',
        type: 'text',
        ownerMode: 'shared',
        ownerRecipientIds: ['sales-user-1', 'legal-user-1', 'ops-user-1'],
      } as SchemaForUI,
      context,
    );
    expect(sharedState.isShared).toBe(true);
    expect(sharedState.isOwnerActive).toBe(true);
    expect(sharedState.isOwnerOther).toBe(false);

    const globalState = resolveSchemaCollaborationState(
      {
        id: 'schema-4',
        name: 'field-d',
        type: 'text',
        ownerRecipientId: 'legal-user-1',
        createdBy: 'ops-user-1',
      } as SchemaForUI,
      { ...context, isGlobalView: true },
    );
    expect(globalState.isOwnerActive).toBe(false);
    expect(globalState.isOwnerOther).toBe(false);
    expect(globalState.userColor).toBe('#D946EF');
  });

  it('filters schemas for the active collaboration view without hiding shared items', () => {
    const context = buildEffectiveCollaborationContext(
      {
        actorId: 'sales-user-1',
        activeRecipientId: 'sales-user-1',
        recipientOptions: [
          { id: 'sales-user-1', name: 'Ventas', color: '#2563EB' },
          { id: 'legal-user-1', name: 'Legal', color: '#D946EF' },
        ],
      },
      'file-a',
    );

    const schemas = [
      {
        id: 'schema-own',
        name: 'own',
        type: 'text',
        ownerRecipientId: 'sales-user-1',
        createdBy: 'sales-user-1',
      },
      {
        id: 'schema-other',
        name: 'other',
        type: 'text',
        ownerRecipientId: 'legal-user-1',
        createdBy: 'legal-user-1',
      },
      {
        id: 'schema-shared',
        name: 'shared',
        type: 'text',
        ownerMode: 'shared',
        ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
        createdBy: 'legal-user-1',
      },
    ] as SchemaForUI[];

    expect(schemaMatchesCollaborationView(schemas[0], context)).toBe(true);
    expect(schemaMatchesCollaborationView(schemas[1], context)).toBe(false);
    expect(schemaMatchesCollaborationView(schemas[2], context)).toBe(true);
    expect(filterSchemasForCollaborationView(schemas, context).map((schema) => schema.id)).toEqual([
      'schema-own',
      'schema-shared',
    ]);
    expect(
      filterSchemasForCollaborationView(schemas, { ...context, isGlobalView: true }).map((schema) => schema.id),
    ).toEqual(['schema-own', 'schema-other', 'schema-shared']);
  });
});
