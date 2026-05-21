import { describe, expect, test, vi } from 'vitest';
import {
  OverlayManager,
  PORTAL_REQUIRED_OVERLAYS,
  createOverlayManager,
} from '../../src/sisad-pdfme/canvas/overlayManager';

describe('overlayManager', () => {
  test('openTyped applies defaults and portal requirement governance', () => {
    const manager = createOverlayManager();

    manager.openTyped('ctx-menu', 'context_menu', 'viewport', { position: { x: 10, y: 20 } });
    manager.openTyped('comment', 'comment_popover', 'schema', { anchorId: 'schema-1' });

    const contextMenu = manager.getActive().find((overlay) => overlay.id === 'ctx-menu');
    const comment = manager.getActive().find((overlay) => overlay.id === 'comment');

    expect(contextMenu).toBeDefined();
    expect(contextMenu?.requiresPortal).toBe(true);
    expect(PORTAL_REQUIRED_OVERLAYS.has('context_menu')).toBe(true);
    expect(contextMenu?.capturesCanvasEvents).toBe(true);
    expect(contextMenu?.zIndex).toBe('modal');

    expect(comment).toBeDefined();
    expect(comment?.requiresPortal).toBe(false);
    expect(comment?.zIndex).toBe('schema_overlay');
    expect(comment?.closeOn).toContain('click_outside');
  });

  test('handleCloseEvent closes only overlays subscribed to the event', () => {
    const manager = new OverlayManager();
    manager.openTyped('toolbar', 'selection_toolbar', 'schema', { anchorId: 'schema-1' });
    manager.openTyped('tooltip', 'canvas_tooltip', 'canvas');
    manager.openTyped('lock', 'lock_indicator', 'schema', { anchorId: 'schema-2' });

    manager.handleCloseEvent('scroll');

    expect(manager.isOpen('tooltip')).toBe(false);
    expect(manager.isOpen('toolbar')).toBe(true);
    expect(manager.isOpen('lock')).toBe(true);
  });

  test('repositionAnchoredOverlays updates only schema-anchored overlays with valid rects', () => {
    const manager = new OverlayManager();
    const listener = vi.fn();
    manager.subscribe(listener);

    manager.openTyped('toolbar-schema-1', 'selection_toolbar', 'schema', { anchorId: 'schema-1' });
    manager.openTyped('toolbar-schema-missing', 'selection_toolbar', 'schema', { anchorId: 'schema-missing' });
    manager.openTyped('ctx', 'context_menu', 'viewport', { position: { x: 90, y: 70 } });

    manager.repositionAnchoredOverlays((schemaUid) =>
      schemaUid === 'schema-1'
        ? ({
            left: 123,
            top: 456,
          } as DOMRect)
        : null,
    );

    const anchored = manager.getActive().find((overlay) => overlay.id === 'toolbar-schema-1');
    const missing = manager.getActive().find((overlay) => overlay.id === 'toolbar-schema-missing');
    const viewport = manager.getActive().find((overlay) => overlay.id === 'ctx');

    expect(anchored?.position).toEqual({ x: 123, y: 456 });
    expect(missing?.position).toBeUndefined();
    expect(viewport?.position).toEqual({ x: 90, y: 70 });
    expect(listener).toHaveBeenCalled();
  });
});
