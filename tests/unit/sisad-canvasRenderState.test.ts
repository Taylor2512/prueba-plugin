/**
 * Tests for canvas/canvasRenderState.ts
 *
 * Covers:
 *  - Every state type has a config entry
 *  - Config properties are consistent (loading states block interaction, error states have actions)
 *  - Helper functions: getCanvasStateConfig, isCanvasInteractive, isOfflineMode
 *  - PDF load error messages cover all reasons
 *  - PROHIBICIÓN: no state allows a blank canvas without message (except 'ready')
 */

import { describe, expect, it } from 'vitest';
import {
  CANVAS_STATE_CONFIG,
  PDF_LOAD_ERROR_MESSAGES,
  getCanvasStateConfig,
  isCanvasInteractive,
  isOfflineMode,
  type CanvasRenderState,
} from '../../src/sisad-pdfme/canvas/canvasRenderState.js';

const ALL_STATE_TYPES: CanvasRenderState['type'][] = [
  'loading_document',
  'loading_page',
  'document_switching',
  'empty_page',
  'no_schemas',
  'ready',
  'render_error',
  'pdf_load_error',
  'collaboration_disconnected',
];

describe('CANVAS_STATE_CONFIG completeness', () => {
  it('has an entry for every CanvasRenderState type', () => {
    for (const stateType of ALL_STATE_TYPES) {
      expect(CANVAS_STATE_CONFIG[stateType], `missing config for '${stateType}'`).toBeDefined();
    }
  });

  it('every non-ready state has a non-empty message', () => {
    for (const stateType of ALL_STATE_TYPES) {
      if (stateType === 'ready') continue;
      expect(
        CANVAS_STATE_CONFIG[stateType].message.length,
        `state '${stateType}' should have a message (blank canvas prohibited)`,
      ).toBeGreaterThan(0);
    }
  });

  it('ready state has empty message', () => {
    expect(CANVAS_STATE_CONFIG.ready.message).toBe('');
  });
});

describe('loading states behavior', () => {
  const loadingTypes: CanvasRenderState['type'][] = ['loading_document', 'loading_page', 'document_switching'];

  it.each(loadingTypes)('%s blocks interaction', (stateType) => {
    expect(CANVAS_STATE_CONFIG[stateType].blocksInteraction).toBe(true);
  });

  it.each(loadingTypes)('%s shows skeleton', (stateType) => {
    expect(CANVAS_STATE_CONFIG[stateType].showsSkeleton).toBe(true);
  });

  it.each(loadingTypes)('%s does NOT allow drop', (stateType) => {
    expect(CANVAS_STATE_CONFIG[stateType].allowsDrop).toBe(false);
  });
});

describe('error states behavior', () => {
  it('render_error has retry action', () => {
    expect(CANVAS_STATE_CONFIG.render_error.hasAction).toBe(true);
    expect(CANVAS_STATE_CONFIG.render_error.actionLabel).toBe('Reintentar');
  });

  it('pdf_load_error has retry action', () => {
    expect(CANVAS_STATE_CONFIG.pdf_load_error.hasAction).toBe(true);
    expect(CANVAS_STATE_CONFIG.pdf_load_error.actionLabel).toBe('Reintentar');
  });
});

describe('drop-capable states', () => {
  const dropStates: CanvasRenderState['type'][] = ['empty_page', 'no_schemas', 'ready', 'collaboration_disconnected'];

  it.each(dropStates)('%s allows drop', (stateType) => {
    expect(CANVAS_STATE_CONFIG[stateType].allowsDrop).toBe(true);
  });
});

describe('collaboration_disconnected', () => {
  it('does not block interaction (offline editing allowed)', () => {
    expect(CANVAS_STATE_CONFIG.collaboration_disconnected.blocksInteraction).toBe(false);
  });

  it('allows schema drops', () => {
    expect(CANVAS_STATE_CONFIG.collaboration_disconnected.allowsDrop).toBe(true);
  });
});

describe('PDF_LOAD_ERROR_MESSAGES', () => {
  const reasons: Array<'not_found' | 'encrypted' | 'unsupported' | 'network'> = [
    'not_found',
    'encrypted',
    'unsupported',
    'network',
  ];

  it.each(reasons)('has a non-empty message for reason "%s"', (reason) => {
    expect(PDF_LOAD_ERROR_MESSAGES[reason].length).toBeGreaterThan(0);
  });
});

describe('getCanvasStateConfig', () => {
  it('returns the config for a given state', () => {
    const state: CanvasRenderState = { type: 'loading_document' };
    expect(getCanvasStateConfig(state)).toBe(CANVAS_STATE_CONFIG.loading_document);
  });

  it('returns ready config for ready state', () => {
    const state: CanvasRenderState = { type: 'ready', schemaCount: 5 };
    expect(getCanvasStateConfig(state).message).toBe('');
  });
});

describe('isCanvasInteractive', () => {
  it('returns false for loading_document', () => {
    expect(isCanvasInteractive({ type: 'loading_document' })).toBe(false);
  });

  it('returns true for ready', () => {
    expect(isCanvasInteractive({ type: 'ready', schemaCount: 3 })).toBe(true);
  });

  it('returns true for empty_page', () => {
    expect(isCanvasInteractive({ type: 'empty_page', pageNumber: 1, documentId: 'doc-1' })).toBe(true);
  });

  it('returns true for collaboration_disconnected (offline mode)', () => {
    expect(isCanvasInteractive({ type: 'collaboration_disconnected', lastSyncAt: 123 })).toBe(true);
  });
});

describe('isOfflineMode', () => {
  it('returns true only for collaboration_disconnected', () => {
    expect(isOfflineMode({ type: 'collaboration_disconnected', lastSyncAt: 0 })).toBe(true);
  });

  it('returns false for all other states', () => {
    expect(isOfflineMode({ type: 'ready', schemaCount: 0 })).toBe(false);
    expect(isOfflineMode({ type: 'loading_document' })).toBe(false);
    expect(isOfflineMode({ type: 'render_error', error: new Error('x'), recoverable: true })).toBe(false);
  });
});
