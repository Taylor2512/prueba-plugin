import { describe, expect, it } from 'vitest';
import { projectDocumentCompletion, projectExecutionCompletion, projectUserCompletion, type CompletionSchemaRecord } from '@/sisad-pdfme/runtime/completionProjection';

const schemas = [
  { schemaUid: 'a-required', documentId: 'd1', required: true, assignedUserIds: ['a'], interaction: { touched: true, valid: true, completed: true } },
  { schemaUid: 'b-required', documentId: 'd1', required: true, assignedUserIds: ['b'], interaction: { touched: false, valid: true, completed: false } },
  { schemaUid: 'shared', documentId: 'd1', required: false, assignedUserIds: ['a', 'b'], interaction: { touched: false, valid: true, completed: false } },
  { schemaUid: 'hidden-b', documentId: 'd2', required: true, assignedUserIds: ['b'], visible: false, interaction: { touched: false, valid: true, completed: false } },
];

describe('completion projections', () => {
  it('does not let another user block user completion', () => {
    expect(projectUserCompletion('a', schemas)).toMatchObject({ complete: true, requiredTotal: 1, pendingSchemaUids: [] });
    expect(projectUserCompletion('b', schemas)).toMatchObject({ complete: false, requiredTotal: 1, pendingSchemaUids: ['b-required'] });
  });

  it('isolates documents and excludes hidden schemas', () => {
    expect(projectDocumentCompletion('d1', ['a', 'b'], schemas)).toMatchObject({ schemaTotal: 3, complete: false });
    expect(projectDocumentCompletion('d2', ['a', 'b'], schemas)).toMatchObject({ schemaTotal: 0, complete: true });
  });

  it('projects execution completion across documents', () => {
    expect(projectExecutionCompletion('session-1', ['a', 'b'], ['d1', 'd2'], schemas).complete).toBe(false);
  });
});

/**
 * Tri-estado de completitud (RTP-490).
 *
 * `complete: boolean` no distinguía «faltan campos» de «hay un campo
 * inválido». Son situaciones distintas —una se resuelve rellenando, la otra
 * corrigiendo— y colapsarlas obligaba a las superficies a inventar booleanos
 * sueltos para elegir el mensaje.
 */
describe('completitud tri-estado', () => {
  const schema = (over: Partial<CompletionSchemaRecord> = {}): CompletionSchemaRecord => ({
    schemaUid: 'f',
    documentId: 'doc-1',
    required: true,
    interaction: { touched: true, valid: true, completed: true },
    ...over,
  });

  it('todo cumplido es complete', () => {
    const projection = projectUserCompletion('u', [schema()]);
    expect(projection.status).toBe('complete');
    expect(projection.complete).toBe(true);
  });

  it('falta un obligatorio es pending, no invalid', () => {
    const projection = projectUserCompletion('u', [
      schema({ interaction: { touched: false, valid: true, completed: false } }),
    ]);
    expect(projection.status).toBe('pending');
    expect(projection.complete).toBe(false);
    expect(projection.pendingSchemaUids).toEqual(['f']);
  });

  it('un valor inválido es invalid aunque esté completado', () => {
    const projection = projectUserCompletion('u', [
      schema({ interaction: { touched: true, valid: false, completed: true } }),
    ]);
    expect(projection.status).toBe('invalid');
  });

  it('invalid gana sobre pending', () => {
    const projection = projectUserCompletion('u', [
      schema({ schemaUid: 'a', interaction: { touched: false, valid: true, completed: false } }),
      schema({ schemaUid: 'b', interaction: { touched: true, valid: false, completed: true } }),
    ]);
    expect(projection.status).toBe('invalid');
  });

  it('el estado se propaga a documento y ejecución', () => {
    const schemas = [schema({ schemaUid: 'a', interaction: { touched: true, valid: false, completed: true } })];
    expect(projectDocumentCompletion('doc-1', ['u'], schemas).status).toBe('invalid');
    expect(projectExecutionCompletion('s', ['u'], ['doc-1'], schemas).status).toBe('invalid');

    const pendientes = [schema({ schemaUid: 'a', interaction: { touched: false, valid: true, completed: false } })];
    expect(projectDocumentCompletion('doc-1', ['u'], pendientes).status).toBe('pending');
    expect(projectExecutionCompletion('s', ['u'], ['doc-1'], pendientes).status).toBe('pending');
  });
});
