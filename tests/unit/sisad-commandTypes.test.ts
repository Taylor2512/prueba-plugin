/**
 * Tests: commandTypes.ts
 *
 * Covers MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS, and CommandPayloadMap types.
 */
import { describe, it, expect } from 'vitest';
import {
  MUTATING_ACTIONS,
  READ_ONLY_SAFE_ACTIONS,
  type CommandType,
} from '../../src/sisad-pdfme/shared/commandTypes.js';

describe('MUTATING_ACTIONS', () => {
  it('contiene todas las acciones que modifican el estado del schema', () => {
    const mustMutate: CommandType[] = [
      'schema.move',
      'schema.resize',
      'schema.rotate',
      'schema.edit',
      'schema.delete',
      'schema.duplicate',
      'schema.paste',
      'schema.group',
      'schema.ungroup',
      'schema.bring_forward',
      'schema.send_backward',
      'schema.bring_to_front',
      'schema.send_to_back',
      'schema.assign_recipient',
      'schema.lock',
      'schema.unlock',
    ];
    for (const action of mustMutate) {
      expect(MUTATING_ACTIONS.has(action), `${action} debería ser mutante`).toBe(true);
    }
  });

  it('no contiene acciones de solo lectura', () => {
    expect(MUTATING_ACTIONS.has('schema.copy')).toBe(false);
    expect(MUTATING_ACTIONS.has('schema.comment')).toBe(false);
    expect(MUTATING_ACTIONS.has('template.export')).toBe(false);
  });

  it('no contiene acciones de documento/página', () => {
    expect(MUTATING_ACTIONS.has('page.change')).toBe(false);
    expect(MUTATING_ACTIONS.has('document.change')).toBe(false);
    expect(MUTATING_ACTIONS.has('template.import')).toBe(false);
  });
});

describe('READ_ONLY_SAFE_ACTIONS', () => {
  it('contiene las acciones permitidas en schemas readonly', () => {
    expect(READ_ONLY_SAFE_ACTIONS.has('schema.copy')).toBe(true);
    expect(READ_ONLY_SAFE_ACTIONS.has('schema.comment')).toBe(true);
    expect(READ_ONLY_SAFE_ACTIONS.has('template.export')).toBe(true);
  });

  it('no contiene acciones mutantes', () => {
    expect(READ_ONLY_SAFE_ACTIONS.has('schema.edit')).toBe(false);
    expect(READ_ONLY_SAFE_ACTIONS.has('schema.delete')).toBe(false);
    expect(READ_ONLY_SAFE_ACTIONS.has('schema.move')).toBe(false);
  });

  it('es disjunto con MUTATING_ACTIONS', () => {
    for (const action of READ_ONLY_SAFE_ACTIONS) {
      expect(MUTATING_ACTIONS.has(action), `${action} no puede ser mutante y read-only-safe al mismo tiempo`).toBe(false);
    }
  });
});

describe('Sets son instancias Set', () => {
  it('MUTATING_ACTIONS es un Set', () => {
    expect(MUTATING_ACTIONS).toBeInstanceOf(Set);
    expect(MUTATING_ACTIONS.size).toBeGreaterThan(0);
  });

  it('READ_ONLY_SAFE_ACTIONS es un Set', () => {
    expect(READ_ONLY_SAFE_ACTIONS).toBeInstanceOf(Set);
    expect(READ_ONLY_SAFE_ACTIONS.size).toBeGreaterThan(0);
  });
});
