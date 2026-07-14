import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu';
import { buildCanvasContextMenuGroups } from '@/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions';

describe('sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('hides delete and duplicate when visibility.actions disables them', () => {
    const groups = buildCanvasContextMenuGroups({
      mode: 'single',
      selectionSchemas: [{ id: 'schema-1', type: 'text', position: { x: 0, y: 0 }, width: 10, height: 10 }] as any,
      visibility: {
        actions: {
          delete: false,
          duplicate: false,
        },
      } as any,
      commands: {
        deleteSelection: () => undefined,
        duplicateSelection: () => undefined,
        toggleHidden: () => undefined,
        toggleReadOnly: () => undefined,
        openProperties: () => undefined,
        clearSelection: () => undefined,
        bringForward: () => undefined,
        sendBackward: () => undefined,
      } as any,
    });

    const labels = groups.flatMap((group) => group.items.map((item) => item.id));
    expect(labels).not.toContain('delete');
    expect(labels).not.toContain('duplicate');
  });
});
