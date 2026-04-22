import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  buildSchemaAssignments,
  buildUserRecipientAssignments,
  buildUserSchemaAssignments,
  createSchemaComment,
  createSchemaCommentAnchor,
  filterSchemasByAuthorView,
  removeById,
  SHARED_ASSIGNMENTS_BUCKET,
  upsertById,
  validateCollaborativeSchemas,
} from '@sisad-pdfme/common';
import { applySchemaCollaborativeDefaults, resolveSchemaCollaborativeMetadata } from '../../src/sisad-pdfme/ui/designerEngine.js';
import {
  buildCollaboratorChipStyle,
  decorateCollaborationUsers,
  decorateTemplateWithCollaboration,
  resolveCollaboratorById,
  resolveSchemaOwnerColor,
  withAlpha,
} from '../../src/features/pdfcomponent/domain/collaborationAppearance.js';

describe('collaboration metadata', () => {
  it('initializes collaborative fields for newly created schemas without keeping stale locks', () => {
    const schema = {
      id: 'schema-1',
      name: 'campo-1',
      type: 'text',
      state: 'locked',
      lock: {
        lockedBy: 'user-old',
        lockedAt: 1700000000000,
      },
    } as SchemaForUI;

    const next = applySchemaCollaborativeDefaults(schema, {
      pageIndex: 2,
      pageNumber: 3,
      totalPages: 8,
      timestamp: 1700000000123,
      fileId: 'file-a',
      actorId: 'user-new',
      ownerRecipientIds: ['recipient-1', 'recipient-2'],
      ownerColor: '#2563EB',
    });

    expect(next.schemaUid).toBe('schema-1');
    expect(next.fileId).toBe('file-a');
    expect(next.pageNumber).toBe(3);
    expect(next.ownerRecipientId).toBe('recipient-1');
    expect(next.ownerRecipientIds).toEqual(['recipient-1', 'recipient-2']);
    expect(next.userColor).toBe('#2563EB');
    expect(next.ownerColor).toBe('#2563EB');
    expect(next.ownerMode).toBe('multi');
    expect(next.createdBy).toBe('user-new');
    expect(next.lastModifiedBy).toBe('user-new');
    expect(next.createdAt).toBe(1700000000123);
    expect(next.updatedAt).toBe(1700000000123);
    expect(next.lastModifiedAt).toBe(1700000000123);
    expect(next.commentsCount).toBe(0);
    expect(next.saveValue).toBe(true);
    expect(next.state).toBe('locked');
    expect(next.lock).toBeUndefined();
  });

  it('resolves collaboration metadata from top-level schema fields and config fallback', () => {
    const schema = {
      id: 'schema-2',
      name: 'campo-2',
      type: 'text',
      schemaUid: 'schema-uid-2',
      fileId: 'file-2',
      pageNumber: 4,
      ownerRecipientIds: ['recipient-a'],
    } as SchemaForUI;

    const metadata = resolveSchemaCollaborativeMetadata(schema);
    expect(metadata?.schemaUid).toBe('schema-uid-2');
    expect(metadata?.fileId).toBe('file-2');
    expect(metadata?.pageNumber).toBe(4);
    expect(metadata?.ownerRecipientIds).toEqual(['recipient-a']);
  });

  it('builds recipient/file/page assignments from collaborative schema fields', () => {
    const assignments = buildSchemaAssignments([
      [
        {
          id: 'schema-1',
          name: 'field-a',
          type: 'text',
          schemaUid: 'uid-a',
          fileId: 'file-a',
          ownerRecipientId: 'recipient-1',
        } as SchemaForUI,
        {
          id: 'schema-2',
          name: 'field-b',
          type: 'text',
          schemaUid: 'uid-b',
          fileId: 'file-a',
          ownerRecipientIds: ['recipient-1', 'recipient-2'],
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['recipient-1']['file-a']['1']).toEqual(['uid-a', 'uid-b']);
    expect(assignments['recipient-2']['file-a']['1']).toEqual(['uid-b']);
  });

  it('builds user/file/page assignments from author metadata with fallbacks and deduplication', () => {
    const assignments = buildUserSchemaAssignments([
      [
        {
          id: 'schema-1',
          name: 'field-a',
          type: 'text',
          schemaUid: 'uid-a',
          fileId: 'file-a',
          createdBy: 'sales-user-1',
          pageNumber: 3,
        } as SchemaForUI,
        {
          id: 'schema-2',
          name: 'field-b',
          type: 'text',
          schemaUid: 'uid-b',
          fileTemplateId: 'file-b',
          lastModifiedBy: 'legal-user-1',
        } as SchemaForUI,
        {
          id: 'schema-3',
          name: 'field-c',
          type: 'text',
          schemaUid: 'uid-b',
          fileTemplateId: 'file-b',
          lastModifiedBy: 'legal-user-1',
        } as SchemaForUI,
        {
          id: 'schema-4',
          name: 'field-d',
          type: 'text',
          schemaUid: 'uid-d',
          createdBy: 'ops-user-1, audit-user-1',
          pageNumber: Number.NaN,
        } as SchemaForUI,
        {
          id: 'schema-5',
          name: 'field-e',
          type: 'text',
          schemaUid: 'uid-e',
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['sales-user-1']['file-a']['3']).toEqual(['uid-a']);
    expect(assignments['legal-user-1']['file-b']['1']).toEqual(['uid-b']);
    expect(assignments['ops-user-1']['default']['1']).toEqual(['uid-d']);
    expect(assignments['audit-user-1']['default']['1']).toEqual(['uid-d']);
    expect(assignments.__unassigned__.default['1']).toEqual(['uid-e']);
  });

  it('writes shared schemas both under the author and the shared bucket', () => {
    const assignments = buildUserSchemaAssignments([
      [
        {
          id: 'schema-1',
          name: 'shared-field',
          type: 'text',
          schemaUid: 'uid-shared',
          fileId: 'file-shared',
          createdBy: 'sales-user-1',
          ownerMode: 'shared',
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['sales-user-1']['file-shared']['1']).toEqual(['uid-shared']);
    expect(assignments[SHARED_ASSIGNMENTS_BUCKET]['file-shared']['1']).toEqual(['uid-shared']);
  });

  it('builds user+recipient assignments with shared recipient bucket and unassigned fallbacks', () => {
    const assignments = buildUserRecipientAssignments([
      [
        {
          id: 'schema-1',
          schemaUid: 'uid-a',
          name: 'field-a',
          type: 'text',
          fileId: 'file-a',
          pageNumber: 2,
          createdBy: 'sales-user-1',
          ownerRecipientId: 'recipient-sales',
        } as SchemaForUI,
        {
          id: 'schema-2',
          schemaUid: 'uid-b',
          name: 'field-b',
          type: 'text',
          fileTemplateId: 'file-b',
          createdBy: 'legal-user-1',
          ownerRecipientIds: ['recipient-legal', 'recipient-audit'],
        } as SchemaForUI,
        {
          id: 'schema-3',
          schemaUid: 'uid-shared',
          name: 'shared-field',
          type: 'text',
          fileId: 'file-shared',
          createdBy: 'sales-user-1',
          ownerRecipientIds: ['recipient-sales'],
          ownerMode: 'shared',
        } as SchemaForUI,
        {
          id: 'schema-4',
          schemaUid: 'uid-shared',
          name: 'shared-field-duplicate',
          type: 'text',
          fileId: 'file-shared',
          createdBy: 'sales-user-1',
          ownerRecipientIds: ['recipient-sales'],
          ownerMode: 'shared',
        } as SchemaForUI,
        {
          id: 'schema-5',
          schemaUid: 'uid-unassigned',
          name: 'field-unassigned',
          type: 'text',
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['sales-user-1']['recipient-sales']['file-a']['2']).toEqual(['uid-a']);
    expect(assignments['legal-user-1']['recipient-legal']['file-b']['1']).toEqual(['uid-b']);
    expect(assignments['legal-user-1']['recipient-audit']['file-b']['1']).toEqual(['uid-b']);
    expect(assignments['sales-user-1']['recipient-sales']['file-shared']['1']).toEqual(['uid-shared']);
    expect(assignments['sales-user-1'][SHARED_ASSIGNMENTS_BUCKET]['file-shared']['1']).toEqual(['uid-shared']);
    expect(assignments.__unassigned__.__unassigned__.default['1']).toEqual(['uid-unassigned']);
  });

  it('can disable the shared recipient bucket in user+recipient assignments', () => {
    const assignments = buildUserRecipientAssignments(
      [[{
        id: 'schema-1',
        schemaUid: 'uid-shared',
        name: 'shared-field',
        type: 'text',
        fileId: 'file-shared',
        createdBy: 'sales-user-1',
        ownerRecipientId: 'recipient-sales',
        ownerMode: 'shared',
      } as SchemaForUI]],
      { includeSharedRecipientBucket: false },
    );

    expect(assignments['sales-user-1']['recipient-sales']['file-shared']['1']).toEqual(['uid-shared']);
    expect(assignments['sales-user-1'][SHARED_ASSIGNMENTS_BUCKET]).toBeUndefined();
  });

  it('deduplicates schema uids and respects single, multi and shared owner modes in user+recipient assignments', () => {
    const assignments = buildUserRecipientAssignments([
      [
        {
          id: 'schema-single',
          schemaUid: 'uid-single',
          name: 'single-field',
          type: 'text',
          fileId: 'file-single',
          createdBy: 'sales-user-1',
          ownerMode: 'single',
          ownerRecipientId: 'recipient-single',
          ownerRecipientIds: ['recipient-single', 'recipient-extra'],
        } as SchemaForUI,
        {
          id: 'schema-multi',
          schemaUid: 'uid-multi',
          name: 'multi-field',
          type: 'text',
          fileId: 'file-multi',
          pageNumber: 4,
          createdBy: 'sales-user-1',
          ownerMode: 'multi',
          ownerRecipientIds: ['recipient-a', 'recipient-b'],
        } as SchemaForUI,
        {
          id: 'schema-shared-1',
          schemaUid: 'uid-shared',
          name: 'shared-field',
          type: 'text',
          fileId: 'file-shared',
          pageNumber: 2,
          createdBy: 'sales-user-1',
          ownerMode: 'shared',
          ownerRecipientIds: ['recipient-shared-1', 'recipient-shared-2'],
        } as SchemaForUI,
        {
          id: 'schema-shared-2',
          schemaUid: 'uid-shared',
          name: 'shared-field-duplicate',
          type: 'text',
          fileId: 'file-shared',
          pageNumber: 2,
          createdBy: 'sales-user-1',
          ownerMode: 'shared',
          ownerRecipientIds: ['recipient-shared-1', 'recipient-shared-2'],
        } as SchemaForUI,
      ],
    ]);

    expect(assignments['sales-user-1']['recipient-single']['file-single']['1']).toEqual(['uid-single']);
    expect(assignments['sales-user-1']['recipient-extra']).toBeUndefined();
    expect(assignments['sales-user-1']['recipient-a']['file-multi']['4']).toEqual(['uid-multi']);
    expect(assignments['sales-user-1']['recipient-b']['file-multi']['4']).toEqual(['uid-multi']);
    expect(assignments['sales-user-1']['recipient-shared-1']['file-shared']['2']).toEqual(['uid-shared']);
    expect(assignments['sales-user-1']['recipient-shared-2']['file-shared']['2']).toEqual(['uid-shared']);
    expect(assignments['sales-user-1'][SHARED_ASSIGNMENTS_BUCKET]['file-shared']['2']).toEqual(['uid-shared']);
  });

  it('validates collaborative schemas before persistence', () => {
    expect(
      validateCollaborativeSchemas([
        [
          {
            id: 'schema-1',
            name: 'field-a',
            type: 'text',
            schemaUid: 'uid-a',
            createdBy: 'sales-user-1',
            userColor: '#2563EB',
          } as SchemaForUI,
        ],
      ]),
    ).toEqual({ valid: true, issues: [] });

    expect(
      validateCollaborativeSchemas([
        [
          {
            id: 'schema-2',
            name: 'field-b',
            type: 'text',
            schemaUid: 'uid-b',
            createdBy: '',
            userColor: '',
          } as SchemaForUI,
        ],
      ]),
    ).toEqual({
      valid: false,
      issues: [
        { schemaUid: 'uid-b', reason: 'missing-createdBy' },
        { schemaUid: 'uid-b', reason: 'missing-userColor' },
      ],
    });
  });

  it('accepts shared collaborative schemas with creator and color metadata before shared assignment generation', () => {
    const schema = {
      id: 'schema-shared',
      name: 'field-shared',
      type: 'text',
      schemaUid: 'uid-shared',
      createdBy: 'sales-user-1',
      userColor: '#2563EB',
      ownerMode: 'shared',
      ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
    } as SchemaForUI;

    expect(validateCollaborativeSchemas([[schema]])).toEqual({ valid: true, issues: [] });

    const assignments = buildUserRecipientAssignments([[schema]]);
    expect(assignments['sales-user-1'][SHARED_ASSIGNMENTS_BUCKET]['default']['1']).toEqual(['uid-shared']);
  });

  it('builds tinted collaborator chip styles from a collaborator color', () => {
    const activeStyle = buildCollaboratorChipStyle('#2563EB', true);
    const inactiveStyle = buildCollaboratorChipStyle('#2563EB', false);

    expect(activeStyle?.color).toBe('#2563EB');
    expect(activeStyle?.backgroundColor).toBe('rgba(37, 99, 235, 0.18)');
    expect(activeStyle?.boxShadow).toBe('inset 0 0 0 1px rgba(37, 99, 235, 0.45)');
    expect(inactiveStyle?.backgroundColor).toBe('rgba(37, 99, 235, 0.1)');
  });

  it('decorates collaboration users with stable fallback colors and preserves explicit colors', () => {
    const users = decorateCollaborationUsers([
      { id: 'user-1', name: 'Alpha' },
      { id: 'user-2', name: 'Beta', color: '#111111' },
      { id: 'user-3', name: 'Gamma' },
    ]);

    expect(users[0].color).toBe('#2563EB');
    expect(users[1].color).toBe('#111111');
    expect(users[2].color).toBe('#F97316');
  });

  it('resolves collaborators and owner colors from trimmed identifiers', () => {
    const users = decorateCollaborationUsers([
      { id: ' user-1 ', name: 'Alpha', color: '#0F766E' },
      { id: 'user-2', name: 'Beta' },
    ]);

    expect(resolveCollaboratorById(' user-1 ', users)).toMatchObject({ id: ' user-1 ', color: '#0F766E' });
    expect(resolveCollaboratorById('missing', users)).toBeNull();
    expect(withAlpha('#2563EB', 0.25)).toBe('rgba(37, 99, 235, 0.25)');
    expect(resolveSchemaOwnerColor({ ownerRecipientId: ' user-1 ' }, users)).toBe('#0F766E');
  });

  it('falls back through collaboration owner metadata and handles invalid colors safely', () => {
    const users = decorateCollaborationUsers([
      { id: 'creator-1', name: 'Creator', color: '#7C3AED' },
      { id: 'modifier-1', name: 'Modifier', color: '#CA8A04' },
    ]);

    expect(resolveSchemaOwnerColor({ ownerColor: ' #111111 ' }, users)).toBe('#111111');
    expect(resolveSchemaOwnerColor({ ownerRecipientId: 'missing', lastModifiedBy: ' modifier-1 ' }, users)).toBe('#CA8A04');
    expect(resolveSchemaOwnerColor({ createdBy: ' creator-1 ' }, users)).toBe('#7C3AED');
    expect(withAlpha('#xyz', 0.4)).toBe('#xyz');
    expect(buildCollaboratorChipStyle('', true)).toBeUndefined();
  });

  it('decorates nested templates with collaboration metadata without mutating the original template', () => {
    const template = {
      schemas: [
        [
          {
            id: 'schema-1',
            name: 'field-a',
            type: 'text',
            ownerRecipientId: 'user-1',
          } as SchemaForUI,
        ],
      ],
    };

    const decorated = decorateTemplateWithCollaboration(template, [{ id: 'user-1', color: '#D946EF' }]);

    expect(decorated).not.toBe(template);
    expect(decorated.schemas[0][0].ownerColor).toBe('#D946EF');
    expect(template.schemas[0][0].ownerColor).toBeUndefined();
  });

  it('filters author-first views while keeping shared schemas visible', () => {
    const schemas = [
      { id: 'schema-own', name: 'field-own', type: 'text', createdBy: 'sales-user-1' },
      {
        id: 'schema-shared',
        name: 'field-shared',
        type: 'text',
        ownerMode: 'shared',
        ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
        createdBy: 'legal-user-1',
      },
      { id: 'schema-other', name: 'field-other', type: 'text', createdBy: 'legal-user-1' },
    ] as SchemaForUI[];

    expect(filterSchemasByAuthorView(schemas, { activeUserId: 'sales-user-1' }).map((schema) => schema.id)).toEqual([
      'schema-own',
      'schema-shared',
    ]);
    expect(filterSchemasByAuthorView(schemas, { activeUserId: 'sales-user-1', isGlobalView: true })).toHaveLength(3);
  });

  it('creates and deduplicates comment entities by id', () => {
    const comment = createSchemaComment('Revisar firma', {
      authorId: 'sales-user-1',
      authorName: 'Ventas',
      authorColor: '#2563EB',
      timestamp: 1700000001000,
    });
    const anchor = createSchemaCommentAnchor(
      { schemaUid: 'uid-a', fileId: 'file-a', pageNumber: 2, x: 12, y: 20 },
      { authorId: 'sales-user-1', authorColor: '#2563EB' },
    );

    expect(comment.authorColor).toBe('#2563EB');
    expect(anchor.authorColor).toBe('#2563EB');
    expect(upsertById([comment], { ...comment, text: 'Revisar firma digital' })[0].text).toBe('Revisar firma digital');
    expect(removeById([comment], comment.id)).toEqual([]);
  });
});
