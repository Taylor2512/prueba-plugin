import { describe, it, expect, vi } from 'vitest';
import { createSelectionCommands } from '@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js';
import type { SchemaForUI, Size } from '@sisad-pdfme/common';
import {
  optionGroupDesignerHeightMM,
  optionGroupDesignerWidthMM,
} from '@/sisad-pdfme/schemas/options/optionGroupLayout.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeElement = (id: string): HTMLElement => {
  const el = document.createElement('div');
  el.id = id;
  return el;
};

const makeSchema = (partial: Partial<SchemaForUI> & { type?: string }): SchemaForUI =>
  ({
    id: 'schema_1',
    type: 'text',
    content: '',
    width: 50,
    height: 10,
    x: 0,
    y: 0,
    rotate: 0,
    ...partial,
  } as SchemaForUI);

const pageSize: Size = { width: 210, height: 297 };

const makeContext = (schema: SchemaForUI, canEditStructure = true) => {
  const el = makeElement(schema.id);
  const changeSchemas = vi.fn();
  return {
    ctx: {
      activeElements: [el],
      schemasList: [[schema]],
      pageCursor: 0,
      pageSize,
      changeSchemas,
      commitSchemas: vi.fn(),
      removeSchemas: vi.fn(),
      onOpenProperties: vi.fn(),
      collaborationContext: { canEditStructure },
    },
    changeSchemas,
  };
};

// ─── addGroupOption — checkboxGroup ──────────────────────────────────────────

describe('addGroupOption — checkboxGroup', () => {
  const makeCheckboxGroup = (options: { optionId: string; label: string }[] = []) =>
    makeSchema({
      id: 'grp_1',
      type: 'checkboxGroup',
      options,
      width: 50,
      height: 20,
    } as SchemaForUI);

  it('emits options + width + height in a single changeSchemas call', () => {
    const schema = makeCheckboxGroup([
      { optionId: 'opt_1', label: 'C1' },
      { optionId: 'opt_2', label: 'C2' },
    ]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    expect(changeSchemas).toHaveBeenCalledOnce();
    const ops = changeSchemas.mock.calls[0][0] as { key: string }[];
    const keys = ops.map((o) => o.key);
    expect(keys).toContain('options');
    expect(keys).toContain('width');
    expect(keys).toContain('height');
  });

  it('resulting options length is previous + 1', () => {
    const schema = makeCheckboxGroup([{ optionId: 'opt_1', label: 'C1' }]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    const ops = changeSchemas.mock.calls[0][0] as { key: string; value: unknown[] }[];
    const optionsOp = ops.find((o) => o.key === 'options')!;
    expect(optionsOp.value).toHaveLength(2);
  });

  it('new option has unique optionId not in existing set', () => {
    const schema = makeCheckboxGroup([
      { optionId: 'option_1', label: 'C1' },
      { optionId: 'option_2', label: 'C2' },
    ]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    const ops = changeSchemas.mock.calls[0][0] as { key: string; value: { optionId: string }[] }[];
    const optionsOp = ops.find((o) => o.key === 'options')!;
    const ids = optionsOp.value.map((o) => o.optionId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('height matches optionGroupDesignerHeightMM for new count', () => {
    const schema = makeCheckboxGroup([
      { optionId: 'opt_1', label: 'C1' },
      { optionId: 'opt_2', label: 'C2' },
    ]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    const ops = changeSchemas.mock.calls[0][0] as { key: string; value: number }[];
    const heightOp = ops.find((o) => o.key === 'height')!;
    expect(heightOp.value).toBeCloseTo(optionGroupDesignerHeightMM('checkboxGroup', 3), 2);
  });

  it('width matches optionGroupDesignerWidthMM for checkboxGroup', () => {
    const schema = makeCheckboxGroup([{ optionId: 'opt_1', label: 'C1' }]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    const ops = changeSchemas.mock.calls[0][0] as { key: string; value: number }[];
    const widthOp = ops.find((o) => o.key === 'width')!;
    expect(widthOp.value).toBeCloseTo(optionGroupDesignerWidthMM('checkboxGroup'), 2);
  });

  it('does nothing when canEditStructure is false', () => {
    const schema = makeCheckboxGroup([{ optionId: 'opt_1', label: 'C1' }]);
    const { ctx, changeSchemas } = makeContext(schema, false);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    expect(changeSchemas).not.toHaveBeenCalled();
  });
});

// ─── addGroupOption — radioGroup ─────────────────────────────────────────────

describe('addGroupOption — radioGroup', () => {
  const makeRadioGroup = (options: { optionId: string; label: string }[] = []) =>
    makeSchema({
      id: 'rg_1',
      type: 'radioGroup',
      options,
    } as SchemaForUI);

  it('height matches radioGroup layout for 3 options', () => {
    const schema = makeRadioGroup([
      { optionId: 'opt_1', label: 'O1' },
      { optionId: 'opt_2', label: 'O2' },
    ]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    const ops = changeSchemas.mock.calls[0][0] as { key: string; value: number }[];
    const heightOp = ops.find((o) => o.key === 'height')!;
    expect(heightOp.value).toBeCloseTo(optionGroupDesignerHeightMM('radioGroup', 3), 2);
  });

  it('width uses radioGroup layout constant', () => {
    const schema = makeRadioGroup([{ optionId: 'opt_1', label: 'O1' }]);
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    const ops = changeSchemas.mock.calls[0][0] as { key: string; value: number }[];
    const widthOp = ops.find((o) => o.key === 'width')!;
    expect(widthOp.value).toBeCloseTo(optionGroupDesignerWidthMM('radioGroup'), 2);
  });
});

// ─── addGroupOption — wrong type ─────────────────────────────────────────────

describe('addGroupOption — wrong schema type', () => {
  it('does nothing when schema type is text', () => {
    const schema = makeSchema({ id: 'txt_1', type: 'text' });
    const { ctx, changeSchemas } = makeContext(schema);
    const commands = createSelectionCommands(ctx as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    expect(changeSchemas).not.toHaveBeenCalled();
  });
});

// ─── addGroupOption — no selection ───────────────────────────────────────────

describe('addGroupOption — no selection', () => {
  it('does nothing when activeElements is empty', () => {
    const schema = makeSchema({ id: 'grp_1', type: 'checkboxGroup' } as SchemaForUI);
    const changeSchemas = vi.fn();
    const commands = createSelectionCommands({
      activeElements: [],
      schemasList: [[schema]],
      pageCursor: 0,
      pageSize,
      changeSchemas,
      commitSchemas: vi.fn(),
      removeSchemas: vi.fn(),
      onOpenProperties: vi.fn(),
      collaborationContext: { canEditStructure: true },
    } as unknown as import('@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js').SelectionCommandsContext);

    commands.addGroupOption?.();

    expect(changeSchemas).not.toHaveBeenCalled();
  });
});

// ─── smoke import ────────────────────────────────────────────────────────────

describe('selectionCommands module', () => {
  it('exports createSelectionCommands', () => {
    expect(typeof createSelectionCommands).toBe('function');
  });
});
