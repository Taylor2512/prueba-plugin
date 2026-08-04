/**
 * COREUX-010 — Modelo canónico de acceso a schemas.
 *
 * Criterios: schemas nuevos no nacen bloqueados, cada rechazo tiene motivo, y
 * las fuentes de bloqueo (locked, readOnly, objectLocked, runtime readonly,
 * owner, permisos de estructura) se resuelven en un solo sitio.
 */
import { describe, expect, it } from 'vitest';
import {
  resolveDesignerSchemaAccessState,
  schemaAccessDenyReason,
  canRunSchemaCommand,
  describeSchemaAccessDenyReason,
} from '@/sisad-pdfme/ui/components/Designer/shared/accessPolicy';

const schema = (overrides: Record<string, unknown> = {}) =>
  ({ id: 's1', name: 'campo', type: 'text', position: { x: 0, y: 0 }, width: 45, height: 7, ...overrides }) as never;

describe('schemas nuevos', () => {
  it('no nacen bloqueados', () => {
    const access = resolveDesignerSchemaAccessState(schema(), {});

    expect(access.isMovable).toBe(true);
    expect(access.isResizable).toBe(true);
    expect(access.isEditable).toBe(true);
    expect(access.isDeletable).toBe(true);
    expect(access.reasons).toEqual({
      move: null,
      resize: null,
      edit: null,
      delete: null,
      structure: null,
    });
  });

  it('siguen siendo seleccionables aunque estén bloqueados', () => {
    const access = resolveDesignerSchemaAccessState(schema({ locked: true }), {});
    expect(access.isSelectable).toBe(true);
  });
});

describe('cada rechazo tiene motivo', () => {
  const cases: Array<{
    name: string;
    schemaProps: Record<string, unknown>;
    ctx: Record<string, unknown>;
    capability: 'move' | 'resize' | 'edit' | 'delete';
    reason: string;
  }> = [
    {
      name: 'runtime readonly',
      schemaProps: {},
      ctx: { runtimeReadonly: true },
      capability: 'move',
      reason: 'runtime-readonly',
    },
    {
      name: 'candado ajeno',
      schemaProps: { lockedByActorId: 'otro' },
      ctx: { collaborationContext: { isCollaborative: true, userId: 'yo', canEditStructure: true } },
      capability: 'edit',
      reason: 'locked-by-other',
    },
    {
      name: 'schema locked',
      schemaProps: { locked: true },
      ctx: {},
      capability: 'move',
      reason: 'schema-locked',
    },
    {
      name: 'objectLocked',
      schemaProps: { objectLocked: true },
      ctx: {},
      capability: 'resize',
      reason: 'object-locked',
    },
    {
      name: 'readOnly bloquea edición',
      schemaProps: { readOnly: true },
      ctx: {},
      capability: 'edit',
      reason: 'schema-readonly',
    },
    {
      name: 'no es el owner',
      schemaProps: { ownerRecipientId: 'alice' },
      ctx: { enforceOwnership: true, activeActorId: 'bob' },
      capability: 'edit',
      reason: 'not-owner',
    },
    {
      name: 'estructura bloqueada',
      schemaProps: {},
      ctx: { canEditStructure: false },
      capability: 'delete',
      reason: 'structure-locked',
    },
  ];

  cases.forEach(({ name, schemaProps, ctx, capability, reason }) => {
    it(`${name} → ${reason}`, () => {
      const access = resolveDesignerSchemaAccessState(schema(schemaProps), ctx as never);

      expect(schemaAccessDenyReason(access, capability)).toBe(reason);
    });
  });

  it('nunca hay capacidad denegada sin motivo', () => {
    const variants = [
      { runtimeReadonly: true },
      { canEditStructure: false },
      { enforceOwnership: true, activeActorId: 'x' },
    ];

    variants.forEach((ctx) => {
      const access = resolveDesignerSchemaAccessState(schema({ ownerRecipientId: 'alice' }), ctx as never);
      (['move', 'resize', 'edit', 'delete'] as const).forEach((capability) => {
        const allowed = {
          move: access.isMovable,
          resize: access.isResizable,
          edit: access.isEditable,
          delete: access.isDeletable,
        }[capability];
        if (!allowed) expect(access.reasons[capability]).not.toBeNull();
        else expect(access.reasons[capability]).toBeNull();
      });
    });
  });
});

describe('precedencia de fuentes', () => {
  it('runtime readonly gana sobre el resto', () => {
    const access = resolveDesignerSchemaAccessState(
      schema({ locked: true, readOnly: true }),
      { runtimeReadonly: true } as never,
    );

    expect(access.reasons.edit).toBe('runtime-readonly');
  });

  it('el candado ajeno gana sobre las banderas propias del schema', () => {
    const access = resolveDesignerSchemaAccessState(
      schema({ lockedByActorId: 'otro', locked: true }),
      { collaborationContext: { isCollaborative: true, userId: 'yo', canEditStructure: true } } as never,
    );

    expect(access.reasons.move).toBe('locked-by-other');
  });

  it('readOnly bloquea edición pero no mover ni borrar', () => {
    const access = resolveDesignerSchemaAccessState(schema({ readOnly: true }), {});

    expect(access.isEditable).toBe(false);
    expect(access.isMovable).toBe(true);
    expect(access.isDeletable).toBe(true);
  });

  it('sin owner declarado, enforceOwnership no bloquea', () => {
    const access = resolveDesignerSchemaAccessState(schema(), {
      enforceOwnership: true,
      activeActorId: 'bob',
    } as never);

    expect(access.isEditable).toBe(true);
  });

  it('acepta owner en la lista múltiple', () => {
    const access = resolveDesignerSchemaAccessState(
      schema({ ownerRecipientIds: ['alice', 'bob'] }),
      { enforceOwnership: true, activeActorId: 'bob' } as never,
    );

    expect(access.isEditable).toBe(true);
  });
});

describe('INSPECTOR-002 — estructura vs valor y candado propio vs ajeno', () => {
  it('schema.readOnly no quita el permiso estructural del diseñador', () => {
    const access = resolveDesignerSchemaAccessState(schema({ readOnly: true }), {});

    expect(access.isSchemaReadOnly).toBe(true);
    expect(access.isEditable).toBe(false);
    // Sin esto el inspector se congela al activar "Solo lectura" y el switch
    // queda sin forma de revertirse.
    expect(access.canEditStructure).toBe(true);
    expect(access.reasons.structure).toBeNull();
  });

  it('el candado ajeno sí quita el permiso estructural', () => {
    const access = resolveDesignerSchemaAccessState(schema({ lockedByActorId: 'alice' }), {
      collaborationContext: { isCollaborative: true, userId: 'bob', canEditStructure: true },
    } as never);

    expect(access.isLockedByOther).toBe(true);
    expect(access.isLockedByMe).toBe(false);
    expect(access.canEditStructure).toBe(false);
    expect(access.reasons.structure).toBe('locked-by-other');
  });

  it('el candado propio no bloquea al actor que lo tomó', () => {
    const access = resolveDesignerSchemaAccessState(schema({ lockedByActorId: 'bob' }), {
      collaborationContext: { isCollaborative: true, userId: 'bob', canEditStructure: true },
    } as never);

    expect(access.isLockedByMe).toBe(true);
    expect(access.isLockedByOther).toBe(false);
    expect(access.canEditStructure).toBe(true);
  });

  it('resuelve el actor desde activeActorId cuando no hay contexto colaborativo', () => {
    const access = resolveDesignerSchemaAccessState(schema({ lockedByActorId: 'bob' }), {
      activeActorId: 'bob',
    } as never);

    // Sin este fallback un candado propio se leía como ajeno y deshabilitaba el
    // inspector del usuario que lo tomó.
    expect(access.isLockedByMe).toBe(true);
    expect(access.isLockedByOther).toBe(false);
  });

  it('runtime readonly se expone como estado propio y bloquea la estructura', () => {
    const access = resolveDesignerSchemaAccessState(schema(), { runtimeReadonly: true } as never);

    expect(access.isRuntimeReadOnly).toBe(true);
    expect(access.canEditStructure).toBe(false);
    expect(access.reasons.structure).toBe('runtime-readonly');
  });

  it('sin permiso de estructura, canEditStructure es falso con motivo', () => {
    const access = resolveDesignerSchemaAccessState(schema(), { canEditStructure: false } as never);

    expect(access.canEditStructure).toBe(false);
    expect(access.reasons.structure).toBe('structure-locked');
  });

  it('cada motivo de denegación es descriptible', () => {
    const access = resolveDesignerSchemaAccessState(schema(), { runtimeReadonly: true } as never);

    expect(describeSchemaAccessDenyReason(access.reasons.structure)).toBeTruthy();
    expect(describeSchemaAccessDenyReason(null)).toBeUndefined();
  });
});

describe('compatibilidad con comandos', () => {
  it('un schema con runtime readonly no acepta comandos de mutación', () => {
    const access = resolveDesignerSchemaAccessState(schema(), { runtimeReadonly: true } as never);

    expect(canRunSchemaCommand('schema.move', access)).toBe(false);
    expect(canRunSchemaCommand('schema.delete', access)).toBe(false);
  });

  it('un schema libre acepta comandos', () => {
    const access = resolveDesignerSchemaAccessState(schema(), {});

    expect(canRunSchemaCommand('schema.move', access)).toBe(true);
    expect(canRunSchemaCommand('schema.update', access)).toBe(true);
  });
});
