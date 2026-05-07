import { describe, expect, it } from 'vitest';
import { CommandBus } from '../../src/sisad-pdfme/ui/commands/commandBus.js';
import {
  commentCommands,
  createCommandBus,
  documentCommands,
  registerDesignerCommands,
  schemaCommands,
} from '../../src/sisad-pdfme/commands/index.js';

describe('commands index barrel', () => {
  it('creates a command bus through the shared factory', () => {
    expect(createCommandBus()).toBeInstanceOf(CommandBus);
  });

  it('exposes the legacy grouped command registry shape', () => {
    const registry = registerDesignerCommands();

    expect(registry.schemaCommands).toBe(schemaCommands);
    expect(registry.commentCommands).toBe(commentCommands);
    expect(registry.documentCommands).toBe(documentCommands);
    expect(registry.schemaCommands.createPageSnapshotCommand).toBeDefined();
    expect(registry.commentCommands.createCommentCommandEvent).toBeDefined();
    expect(registry.documentCommands.createTemplateSnapshotCommand).toBeDefined();
  });
});