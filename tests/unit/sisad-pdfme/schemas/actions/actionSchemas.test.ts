import { describe, it, expect } from 'vitest';
import { builtInSchemaDefinitions, createDefaultSchema } from '@/sisad-pdfme/schemas/index.js';
import attachment from '@/sisad-pdfme/schemas/actions/attachment.js';
import note from '@/sisad-pdfme/schemas/actions/note.js';
import approve from '@/sisad-pdfme/schemas/actions/approve.js';
import decline from '@/sisad-pdfme/schemas/actions/decline.js';

describe('Action schemas registration', () => {
  it('all 4 action schemas are registered as built-in', () => {
    const types = builtInSchemaDefinitions.map((d) => d.type);
    expect(types).toContain('attachment');
    expect(types).toContain('note');
    expect(types).toContain('approve');
    expect(types).toContain('decline');
  });
});

describe('attachment schema', () => {
  it('has correct default schema shape', () => {
    const schema = createDefaultSchema('attachment') as Record<string, unknown>;
    expect(schema.type).toBe('attachment');
    expect(schema.allowedMimeTypes).toBe('*');
    expect(schema.maxFiles).toBe(1);
    expect(schema.maxSizeMb).toBe(10);
    expect(schema.showFileName).toBe(true);
  });

  it('propPanel schema includes basicsFields and dataLabelFields', () => {
    const propPanelSchema = typeof attachment.propPanel.schema === 'function'
      ? attachment.propPanel.schema({ i18n: (k: string) => k })
      : attachment.propPanel.schema;
    expect(propPanelSchema.required).toBeTruthy();
    expect(propPanelSchema.readOnly).toBeTruthy();
    expect(propPanelSchema.tooltip).toBeTruthy();
    expect(propPanelSchema.helpText).toBeTruthy();
    expect(propPanelSchema.dataLabel).toBeTruthy();
    expect(propPanelSchema.allowedMimeTypes).toBeTruthy();
  });

  it('propertyMap routes fields to correct sections', () => {
    const { propertyMap } = attachment.propPanel.inspector;
    expect(propertyMap.required).toBe('data');
    expect(propertyMap.tooltip).toBe('help');
    expect(propertyMap.dataLabel).toBe('connections');
    expect(propertyMap.allowedMimeTypes).toBe('data');
  });
});

describe('note schema', () => {
  it('has correct default schema shape', () => {
    const schema = createDefaultSchema('note') as Record<string, unknown>;
    expect(schema.type).toBe('note');
    expect(schema.readOnly).toBe(true);
    expect(schema.visibleToRecipients).toBe(true);
    expect(schema.noteBackground).toBe('#fefce8');
  });

  it('propPanel schema includes content and appearance fields', () => {
    const propPanelSchema = typeof note.propPanel.schema === 'function'
      ? note.propPanel.schema({ i18n: (k: string) => k })
      : note.propPanel.schema;
    expect(propPanelSchema.content).toBeTruthy();
    expect(propPanelSchema.visibleToRecipients).toBeTruthy();
    expect(propPanelSchema.noteBackground).toBeTruthy();
    expect(propPanelSchema.tooltip).toBeTruthy();
    expect(propPanelSchema.dataLabel).toBeTruthy();
  });

  it('propertyMap routes visual fields to style section', () => {
    const { propertyMap } = note.propPanel.inspector;
    expect(propertyMap.noteBackground).toBe('style');
    expect(propertyMap.content).toBe('data');
    expect(propertyMap.helpText).toBe('help');
  });
});

describe('approve schema', () => {
  it('has correct default schema shape', () => {
    const schema = createDefaultSchema('approve') as Record<string, unknown>;
    expect(schema.type).toBe('approve');
    expect(schema.action).toBe('approve');
    expect(schema.label).toBe('Aprobar');
    expect(schema.requiresReason).toBe(false);
    expect(schema.buttonColor).toBe('#16a34a');
  });

  it('propPanel schema includes action fields', () => {
    const propPanelSchema = typeof approve.propPanel.schema === 'function'
      ? approve.propPanel.schema({ i18n: (k: string) => k })
      : approve.propPanel.schema;
    expect(propPanelSchema.label).toBeTruthy();
    expect(propPanelSchema.requiresReason).toBeTruthy();
    expect(propPanelSchema.confirmationMessage).toBeTruthy();
    expect(propPanelSchema.auditEventName).toBeTruthy();
    expect(propPanelSchema.buttonColor).toBeTruthy();
  });

  it('auditEventName routes to connections section', () => {
    expect(approve.propPanel.inspector.propertyMap.auditEventName).toBe('connections');
    expect(approve.propPanel.inspector.propertyMap.buttonColor).toBe('style');
    expect(approve.propPanel.inspector.propertyMap.label).toBe('data');
  });
});

describe('decline schema', () => {
  it('has correct default schema shape', () => {
    const schema = createDefaultSchema('decline') as Record<string, unknown>;
    expect(schema.type).toBe('decline');
    expect(schema.action).toBe('decline');
    expect(schema.label).toBe('Rechazar');
    expect(schema.buttonColor).toBe('#dc2626');
  });

  it('has label, requiresReason, confirmationMessage in propPanel', () => {
    const propPanelSchema = typeof decline.propPanel.schema === 'function'
      ? decline.propPanel.schema({ i18n: (k: string) => k })
      : decline.propPanel.schema;
    expect(propPanelSchema.label).toBeTruthy();
    expect(propPanelSchema.requiresReason).toBeTruthy();
    expect(propPanelSchema.confirmationMessage).toBeTruthy();
    expect(propPanelSchema.tooltip).toBeTruthy();
    expect(propPanelSchema.dataLabel).toBeTruthy();
  });
});
