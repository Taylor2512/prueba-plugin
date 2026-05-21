/**
 * Tests: Template Validator (DocuSign-style pre-send validation)
 */
import { describe, it, expect } from 'vitest';
import {
  validateTemplate,
  isTemplateValid,
} from '../../src/sisad-pdfme/shared/templateValidator.js';
import { makeRecipient } from './factories/recipientFactory.js';
import {
  makeSchema,
} from './factories/schemaFactory.js';
import { makeTemplateInput } from './factories/templateFactory.js';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('validateTemplate', () => {
  it('retorna valid=true para un template limpio', () => {
    const result = validateTemplate(makeTemplateInput());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('FIELD_NAME_EMPTY — warning para campo sin nombre', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ name: '' })]],
    }));
    expect(result.warnings.some((i) => i.code === 'FIELD_NAME_EMPTY')).toBe(true);
    expect(result.valid).toBe(true); // warning no bloquea
  });

  it('FIELD_NAME_DUPLICATE — error para nombres duplicados entre páginas', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [
        [makeSchema({ name: 'firma_cliente' })],
        [makeSchema({ name: 'firma_cliente' })],
      ],
      pageSizes: [
        { width: 210, height: 297 },
        { width: 210, height: 297 },
      ],
    }));
    const dupe = result.errors.find((i) => i.code === 'FIELD_NAME_DUPLICATE');
    expect(dupe).toBeDefined();
    expect(result.valid).toBe(false);
  });

  it('FIELD_SIGNATURE_NO_PROVIDER — error para firma sin provider', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ type: 'signature', name: 'firma', designer: { signature: undefined } })]],
    }));
    const issue = result.errors.find((i) => i.code === 'FIELD_SIGNATURE_NO_PROVIDER');
    expect(issue).toBeDefined();
    expect(result.valid).toBe(false);
  });

  it('FIELD_SIGNATURE_NO_PROVIDER — no error cuando tiene provider via __designer', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({
        type: 'signature',
        name: 'firma',
        designer: { signature: { providerKey: 'draw' } },
      })]],
    }));
    expect(result.errors.filter((i) => i.code === 'FIELD_SIGNATURE_NO_PROVIDER')).toHaveLength(0);
    expect(result.valid).toBe(true);
  });

  it('FIELD_OUT_OF_BOUNDS — warning cuando campo sale del área de página', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ position: { x: 200, y: 10 }, width: 50, height: 10 })]],
      pageSizes: [{ width: 210, height: 297 }],
    }));
    const issue = result.warnings.find((i) => i.code === 'FIELD_OUT_OF_BOUNDS');
    expect(issue).toBeDefined();
    expect(result.valid).toBe(true); // warning no bloquea
  });

  it('FIELD_OUT_OF_BOUNDS — sin warning cuando campo está dentro de la página', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ position: { x: 10, y: 10 }, width: 50, height: 10 })]],
      pageSizes: [{ width: 210, height: 297 }],
    }));
    expect(result.warnings.filter((i) => i.code === 'FIELD_OUT_OF_BOUNDS')).toHaveLength(0);
  });

  it('FIELD_HIDDEN_REQUIRED — error cuando campo está oculto y requerido', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ hidden: true, required: true })]],
    }));
    const issue = result.errors.find((i) => i.code === 'FIELD_HIDDEN_REQUIRED');
    expect(issue).toBeDefined();
    expect(result.valid).toBe(false);
  });

  it('PAGE_NO_FIELDS — warning cuando página está vacía y hay destinatarios', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[]],
      recipients: [makeRecipient({ id: 'rec-1', name: 'Cliente' })],
    }));
    const issue = result.warnings.find((i) => i.code === 'PAGE_NO_FIELDS');
    expect(issue).toBeDefined();
  });

  it('PAGE_NO_FIELDS — sin warning cuando no hay destinatarios', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[]],
      recipients: [],
    }));
    expect(result.warnings.filter((i) => i.code === 'PAGE_NO_FIELDS')).toHaveLength(0);
  });

  it('TEMPLATE_NO_RECIPIENTS — info cuando no hay destinatarios pero hay campos', () => {
    const result = validateTemplate(makeTemplateInput());
    const issue = result.infos.find((i) => i.code === 'TEMPLATE_NO_RECIPIENTS');
    expect(issue).toBeDefined();
    expect(result.valid).toBe(true); // info no bloquea
  });

  it('RECIPIENT_NO_REQUIRED_FIELDS — info cuando destinatario no tiene campos requeridos', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ ownerRecipientId: 'rec-2', required: false })]],
      recipients: [makeRecipient({ id: 'rec-1', name: 'Cliente' }), makeRecipient({ id: 'rec-2', name: 'Legal' })],
    }));
    const issue = result.infos.find((i) => i.code === 'RECIPIENT_NO_REQUIRED_FIELDS' && i.recipientId === 'rec-1');
    expect(issue).toBeDefined();
  });

  it('RECIPIENT_NO_REQUIRED_FIELDS — no emite si tiene campo requerido', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ ownerRecipientId: 'rec-1', required: true })]],
      recipients: [makeRecipient({ id: 'rec-1', name: 'Cliente' })],
    }));
    expect(result.infos.filter((i) => i.code === 'RECIPIENT_NO_REQUIRED_FIELDS')).toHaveLength(0);
  });

  it('issueCount suma errores + warnings + infos', () => {
    const result = validateTemplate(makeTemplateInput({
      schemasByPage: [[makeSchema({ type: 'signature', name: 'firma', hidden: true, required: true })]],
    }));
    expect(result.issueCount).toBe(result.errors.length + result.warnings.length + result.infos.length);
  });

  it('template multi-página limpio es válido', () => {
    const result = validateTemplate({
      schemasByPage: [
        [makeSchema({ name: 'campo_1' }), makeSchema({ name: 'campo_2' })],
        [makeSchema({ name: 'campo_3' })],
      ],
      pageSizes: [
        { width: 210, height: 297 },
        { width: 210, height: 297 },
      ],
      recipients: [makeRecipient({ id: 'rec-1', name: 'Firmante' })],
    });
    // Solo posible RECIPIENT_NO_REQUIRED_FIELDS (info), no errores
    expect(result.errors).toHaveLength(0);
    expect(result.valid).toBe(true);
  });
});

describe('isTemplateValid', () => {
  it('retorna true para template sin errores', () => {
    expect(isTemplateValid(makeTemplateInput())).toBe(true);
  });

  it('retorna false cuando hay errores bloqueantes', () => {
    expect(isTemplateValid(makeTemplateInput({
      schemasByPage: [[makeSchema({ type: 'signature', name: 'f' })]],
    }))).toBe(false);
  });
});
