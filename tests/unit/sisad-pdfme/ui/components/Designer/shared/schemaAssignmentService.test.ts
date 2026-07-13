import { describe, it, expect } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  assignSchemaOwner,
  buildAssignSchemaOwnerOps,
  buildSchemaOwnerPatch,
  resolveSchemaUid,
  resolveSelectionOwner,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService';

const makeSchema = (overrides: Partial<SchemaForUI> & { id: string }): SchemaForUI =>
  ({
    name: overrides.id,
    type: 'text',
    position: { x: 0, y: 0 },
    width: 10,
    height: 10,
    ...overrides,
  }) as unknown as SchemaForUI;

const RECIPIENT = { id: 'recipient-2', name: 'Avalista', color: '#D946EF' };

describe('schemaAssignmentService', () => {
  describe('resolveSchemaUid', () => {
    it('prefers schemaUid, then id, then name', () => {
      expect(resolveSchemaUid(makeSchema({ id: 'a', schemaUid: 'uid-1' } as any))).toBe('uid-1');
      expect(resolveSchemaUid(makeSchema({ id: 'b' }))).toBe('b');
      expect(resolveSchemaUid(makeSchema({ id: '', name: 'field-c' } as any))).toBe('field-c');
    });
  });

  describe('buildSchemaOwnerPatch', () => {
    it('sets a single owner and never includes lock/readonly keys', () => {
      const patch = buildSchemaOwnerPatch(RECIPIENT);
      expect(patch).toMatchObject({
        ownerRecipientId: 'recipient-2',
        ownerRecipientIds: ['recipient-2'],
        recipientId: 'recipient-2',
        ownerRecipientName: 'Avalista',
        ownerColor: '#D946EF',
        userColor: '#D946EF',
        ownerMode: 'single',
      });
      expect(patch).not.toHaveProperty('locked');
      expect(patch).not.toHaveProperty('readOnly');
      expect(patch).not.toHaveProperty('objectLocked');
    });

    it('falls back the visible name to the recipient id and color to null', () => {
      const patch = buildSchemaOwnerPatch({ id: 'recipient-9' });
      expect(patch.ownerRecipientName).toBe('recipient-9');
      expect(patch.ownerColor).toBeNull();
      expect(patch.userColor).toBeNull();
    });
  });

  describe('assignSchemaOwner', () => {
    it('reassigns owner + color of the targeted schema while preserving lock/readOnly/objectLocked', () => {
      const pages: SchemaForUI[][] = [
        [
          makeSchema({
            id: 'contract_name',
            ownerRecipientId: 'recipient-1',
            ownerColor: '#2563EB',
            readOnly: true,
            locked: true,
            objectLocked: true,
          } as any),
          makeSchema({ id: 'contract_date', ownerRecipientId: 'recipient-1' } as any),
        ],
      ];

      const result = assignSchemaOwner({ pages, schemaUids: ['contract_name'], recipient: RECIPIENT });

      const changed = result.pages[0][0] as any;
      expect(result.changedSchemaUids).toEqual(['contract_name']);
      expect(changed.ownerRecipientId).toBe('recipient-2');
      expect(changed.ownerRecipientIds).toEqual(['recipient-2']);
      expect(changed.ownerColor).toBe('#D946EF');
      expect(changed.userColor).toBe('#D946EF');
      expect(changed.ownerMode).toBe('single');
      // Invariante: reasignar NO altera bloqueo ni solo lectura.
      expect(changed.readOnly).toBe(true);
      expect(changed.locked).toBe(true);
      expect(changed.objectLocked).toBe(true);

      // Los schemas no seleccionados no se tocan.
      expect((result.pages[0][1] as any).ownerRecipientId).toBe('recipient-1');
    });

    it('is a no-op when the recipient id is empty', () => {
      const pages: SchemaForUI[][] = [[makeSchema({ id: 'a', ownerRecipientId: 'recipient-1' } as any)]];
      const result = assignSchemaOwner({ pages, schemaUids: ['a'], recipient: { id: '  ' } });
      expect(result.changedSchemaUids).toEqual([]);
      expect(result.pages).toBe(pages);
    });

    it('is a no-op when no schema matches the requested uids', () => {
      const pages: SchemaForUI[][] = [[makeSchema({ id: 'a' })]];
      const result = assignSchemaOwner({ pages, schemaUids: ['missing'], recipient: RECIPIENT });
      expect(result.changedSchemaUids).toEqual([]);
    });
  });

  describe('buildAssignSchemaOwnerOps', () => {
    it('emits owner ops keyed by schema.id only for the matching schemas', () => {
      const schemas = [makeSchema({ id: 'a' }), makeSchema({ id: 'b' })];
      const ops = buildAssignSchemaOwnerOps(schemas, ['a'], RECIPIENT);

      expect(ops.every((op) => op.schemaId === 'a')).toBe(true);
      expect(ops.map((op) => op.key)).toEqual(
        expect.arrayContaining([
          'ownerRecipientId',
          'ownerRecipientIds',
          'recipientId',
          'ownerRecipientName',
          'ownerColor',
          'userColor',
          'ownerMode',
        ]),
      );
      expect(ops.some((op) => op.key === 'readOnly' || op.key === 'locked')).toBe(false);
    });

    it('returns no ops for an empty recipient', () => {
      const schemas = [makeSchema({ id: 'a' })];
      expect(buildAssignSchemaOwnerOps(schemas, ['a'], { id: '' })).toEqual([]);
    });
  });

  describe('resolveSelectionOwner', () => {
    it('returns the shared owner when every schema has the same recipient', () => {
      const schemas = [
        makeSchema({ id: 'a', ownerRecipientId: 'recipient-1' } as any),
        makeSchema({ id: 'b', ownerRecipientId: 'recipient-1' } as any),
      ];
      expect(resolveSelectionOwner(schemas)).toEqual({ recipientId: 'recipient-1', mixed: false });
    });

    it('flags mixed ownership when recipients differ', () => {
      const schemas = [
        makeSchema({ id: 'a', ownerRecipientId: 'recipient-1' } as any),
        makeSchema({ id: 'b', ownerRecipientId: 'recipient-2' } as any),
      ];
      expect(resolveSelectionOwner(schemas)).toEqual({ recipientId: null, mixed: true });
    });

    it('flags mixed ownership when some schemas are unassigned', () => {
      const schemas = [
        makeSchema({ id: 'a', ownerRecipientId: 'recipient-1' } as any),
        makeSchema({ id: 'b' }),
      ];
      expect(resolveSelectionOwner(schemas)).toEqual({ recipientId: null, mixed: true });
    });

    it('returns no owner when the selection is unassigned', () => {
      expect(resolveSelectionOwner([makeSchema({ id: 'a' })])).toEqual({ recipientId: null, mixed: false });
    });
  });
});
