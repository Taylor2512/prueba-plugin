/**
 * RTP-510.C — semántica de touched/dirty/valid/committed/completed.
 *
 * El riesgo que estas pruebas cubren no es «falta un flag», sino usar
 * truthiness genérica para decidirlos. `0` es un número válido y `false` es una
 * respuesta, no un hueco: tratarlos como vacíos marca formularios completos
 * como pendientes y es el tipo de fallo que sólo se ve en producción.
 *
 * También se fija que volver al valor original deja `dirty=false` conservando
 * `touched=true`: el usuario SÍ interactuó, simplemente no cambió nada.
 */
import { describe, expect, it } from 'vitest';
import {
  applySchemaInteraction,
  createSchemaInteractionState,
  resolveSchemaCompletion,
  resolveSchemaValidity,
  type SchemaInteractionState,
} from '@sisad-pdfme/runtime/schemaInteractionState';

const start = (initialValue: unknown, policy = {}): SchemaInteractionState =>
  createSchemaInteractionState({
    schemaUid: 'uid-1',
    schemaName: 'campo',
    schemaType: 'text',
    initialValue,
    policy,
  });

describe('estado inicial', () => {
  it('sin interacción no hay touched ni dirty', () => {
    const state = start('Taylor');
    expect(state.touched).toBe(false);
    expect(state.dirty).toBe(false);
    expect(state.interactionCount).toBe(0);
    expect(state.lastOrigin).toBe('initial');
  });

  it('un prefill no cuenta como interacción del usuario', () => {
    const state = applySchemaInteraction(start(''), 'Taylor', 'prefill');
    expect(state.touched).toBe(false);
    expect(state.dirty).toBe(true);
    expect(state.interactionCount).toBe(0);
  });

  it('un valor puesto por el sistema no marca touched', () => {
    // dateSigned y similares: el runtime los rellena, el usuario no los toca.
    const state = applySchemaInteraction(start(''), '2026-08-14', 'system');
    expect(state.touched).toBe(false);
    expect(state.lastOrigin).toBe('system');
  });

  it('una escritura del host tampoco marca touched', () => {
    expect(applySchemaInteraction(start(''), 'del host', 'host').touched).toBe(false);
  });
});

describe('touched y dirty', () => {
  it('editar marca ambos', () => {
    const state = applySchemaInteraction(start('Taylor'), 'John', 'user');
    expect(state.touched).toBe(true);
    expect(state.dirty).toBe(true);
    expect(state.interactionCount).toBe(1);
  });

  it('volver al valor original conserva touched y limpia dirty', () => {
    const editado = applySchemaInteraction(start('Taylor'), 'John', 'user');
    const revertido = applySchemaInteraction(editado, 'Taylor', 'user');

    expect(revertido.touched).toBe(true);
    expect(revertido.dirty).toBe(false);
    expect(revertido.interactionCount).toBe(2);
  });

  it('un checkbox false→true→false cuenta dos interacciones sin quedar dirty', () => {
    const inicial = start('false');
    const marcado = applySchemaInteraction(inicial, 'true', 'user');
    const desmarcado = applySchemaInteraction(marcado, 'false', 'user');

    expect(desmarcado.touched).toBe(true);
    expect(desmarcado.dirty).toBe(false);
    expect(desmarcado.interactionCount).toBe(2);
  });

  it('touched no se pierde por una escritura posterior del host', () => {
    const editado = applySchemaInteraction(start(''), 'del usuario', 'user');
    expect(applySchemaInteraction(editado, 'del host', 'host').touched).toBe(true);
  });
});

describe('validez y completitud sin truthiness genérica', () => {
  it('`0` es un valor, no un hueco', () => {
    expect(resolveSchemaValidity(0, { required: true })).toBe(true);
    expect(resolveSchemaCompletion(0, start(0), { required: true })).toBe(true);
  });

  it('`false` es una respuesta, no un vacío', () => {
    expect(resolveSchemaValidity(false, { required: true })).toBe(true);
    expect(resolveSchemaCompletion(false, start(false), { required: true })).toBe(true);
  });

  it('cadena vacía, null y undefined sí son huecos', () => {
    expect(resolveSchemaValidity('', { required: true })).toBe(false);
    expect(resolveSchemaValidity(null, { required: true })).toBe(false);
    expect(resolveSchemaValidity(undefined, { required: true })).toBe(false);
  });

  it('un array vacío está pendiente y uno con elementos no', () => {
    expect(resolveSchemaValidity([], { required: true })).toBe(false);
    expect(resolveSchemaValidity(['a'], { required: true })).toBe(true);
  });

  it('sin `required` cualquier valor vale', () => {
    expect(resolveSchemaValidity('', {})).toBe(true);
    expect(resolveSchemaCompletion('', start(''), {})).toBe(true);
  });

  it('`interactionRequired` exige haber tocado el campo, no sólo tener valor', () => {
    const policy = { interactionRequired: true };
    const prefilled = applySchemaInteraction(start(''), 'ya venía', 'prefill', policy);
    expect(prefilled.completed).toBe(false);

    const tocado = applySchemaInteraction(prefilled, 'ya venía', 'user', policy);
    expect(tocado.completed).toBe(true);
  });

  it('un validador propio manda sobre `required`', () => {
    const policy = { required: true, validate: (value: unknown) => value === 'exacto' };
    expect(resolveSchemaValidity('cualquiera', policy)).toBe(false);
    expect(resolveSchemaValidity('exacto', policy)).toBe(true);
  });

  it('un campo obligatorio queda inválido al vaciarse', () => {
    const policy = { required: true };
    const vaciado = applySchemaInteraction(start('algo', policy), '', 'user', policy);
    expect(vaciado.valid).toBe(false);
    expect(vaciado.completed).toBe(false);
  });
});

describe('transacción', () => {
  it('la revisión avanza en cada interacción', () => {
    const primera = applySchemaInteraction(start(''), 'a', 'user');
    const segunda = applySchemaInteraction(primera, 'b', 'user');
    expect(segunda.revision).toBeGreaterThan(primera.revision);
  });

  it('una revisión explícita del runtime manda sobre el autoincremento', () => {
    const state = applySchemaInteraction(start(''), 'a', 'user', {}, { revision: 42 });
    expect(state.revision).toBe(42);
  });

  it('el id de transacción se conserva mientras no llegue otro', () => {
    const conId = applySchemaInteraction(start(''), 'a', 'user', {}, { transactionId: 'tx-1' });
    expect(applySchemaInteraction(conId, 'b', 'user').lastTransactionId).toBe('tx-1');
  });

  it('committed puede declararse explícitamente', () => {
    expect(applySchemaInteraction(start(''), 'a', 'user', {}, { committed: false }).committed).toBe(false);
  });
});
