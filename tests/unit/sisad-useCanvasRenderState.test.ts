/**
 * Tests for canvas/useCanvasRenderState.ts
 *
 * Covers:
 *  - deriveCanvasRenderState (pure function — no React required)
 *  - Priority ordering: error > loading > collaboration > empty > ready
 *  - Correct state type for every input combination
 *  - PROHIBICIÓN: never returns 'ready' when schemaCount === 0
 */

import { describe, expect, it } from 'vitest';
import { deriveCanvasRenderState, type CanvasRenderStateInput } from '../../src/sisad-pdfme/canvas/useCanvasRenderState.js';

const base: CanvasRenderStateInput = {
  schemaCount: 5,
  pageCursor: 0,
  documentId: 'doc-1',
};

describe('deriveCanvasRenderState', () => {
  // ── Default / ready ─────────────────────────────────────────────────

  it('returns ready when schemas exist and no flags set', () => {
    const state = deriveCanvasRenderState(base);
    expect(state.type).toBe('ready');
    if (state.type === 'ready') {
      expect(state.schemaCount).toBe(5);
    }
  });

  // ── Error priority ──────────────────────────────────────────────────

  it('returns render_error when renderError is set', () => {
    const err = new Error('kaboom');
    const state = deriveCanvasRenderState({ ...base, renderError: err });
    expect(state.type).toBe('render_error');
    if (state.type === 'render_error') {
      expect(state.error).toBe(err);
      expect(state.recoverable).toBe(true); // default
    }
  });

  it('returns render_error with recoverable=false when specified', () => {
    const state = deriveCanvasRenderState({
      ...base,
      renderError: new Error('fatal'),
      renderErrorRecoverable: false,
    });
    if (state.type === 'render_error') {
      expect(state.recoverable).toBe(false);
    }
  });

  it('returns pdf_load_error when pdfLoadError is set', () => {
    const state = deriveCanvasRenderState({
      ...base,
      pdfLoadError: { reason: 'encrypted' },
    });
    expect(state.type).toBe('pdf_load_error');
    if (state.type === 'pdf_load_error') {
      expect(state.reason).toBe('encrypted');
    }
  });

  it('renderError takes priority over pdf_load_error', () => {
    const state = deriveCanvasRenderState({
      ...base,
      renderError: new Error('x'),
      pdfLoadError: { reason: 'network' },
    });
    expect(state.type).toBe('render_error');
  });

  it('errors take priority over loading flags', () => {
    const state = deriveCanvasRenderState({
      ...base,
      renderError: new Error('x'),
      isLoadingDocument: true,
    });
    expect(state.type).toBe('render_error');
  });

  // ── Loading priority ────────────────────────────────────────────────

  it('returns loading_document when isLoadingDocument is true', () => {
    const state = deriveCanvasRenderState({ ...base, isLoadingDocument: true });
    expect(state.type).toBe('loading_document');
  });

  it('returns document_switching when switching documents', () => {
    const state = deriveCanvasRenderState({
      ...base,
      isSwitchingDocument: true,
      switchFromDocId: 'doc-a',
      switchToDocId: 'doc-b',
    });
    expect(state.type).toBe('document_switching');
    if (state.type === 'document_switching') {
      expect(state.fromDocId).toBe('doc-a');
      expect(state.toDocId).toBe('doc-b');
    }
  });

  it('returns loading_page when isLoadingPage is true', () => {
    const state = deriveCanvasRenderState({ ...base, isLoadingPage: true });
    expect(state.type).toBe('loading_page');
  });

  it('loading_document takes priority over loading_page', () => {
    const state = deriveCanvasRenderState({
      ...base,
      isLoadingDocument: true,
      isLoadingPage: true,
    });
    expect(state.type).toBe('loading_document');
  });

  // ── Collaboration disconnected ─────────────────────────────────────

  it('returns collaboration_disconnected when flag is set', () => {
    const state = deriveCanvasRenderState({
      ...base,
      isCollaborationDisconnected: true,
      lastSyncAt: 1234567890,
    });
    expect(state.type).toBe('collaboration_disconnected');
    if (state.type === 'collaboration_disconnected') {
      expect(state.lastSyncAt).toBe(1234567890);
    }
  });

  it('loading takes priority over collaboration_disconnected', () => {
    const state = deriveCanvasRenderState({
      ...base,
      isLoadingDocument: true,
      isCollaborationDisconnected: true,
    });
    expect(state.type).toBe('loading_document');
  });

  // ── Empty states ────────────────────────────────────────────────────

  it('returns empty_page when schemaCount=0 and documentId exists', () => {
    const state = deriveCanvasRenderState({
      ...base,
      schemaCount: 0,
      documentId: 'doc-1',
    });
    expect(state.type).toBe('empty_page');
    if (state.type === 'empty_page') {
      expect(state.pageNumber).toBe(1); // pageCursor 0 → page 1
      expect(state.documentId).toBe('doc-1');
    }
  });

  it('returns no_schemas when schemaCount=0 and no documentId', () => {
    const state = deriveCanvasRenderState({
      schemaCount: 0,
      pageCursor: 2,
      documentId: null,
    });
    expect(state.type).toBe('no_schemas');
    if (state.type === 'no_schemas') {
      expect(state.pageNumber).toBe(3); // pageCursor 2 → page 3
    }
  });

  it('PROHIBITION: never returns ready when schemaCount is 0', () => {
    const state = deriveCanvasRenderState({ schemaCount: 0, pageCursor: 0 });
    expect(state.type).not.toBe('ready');
  });

  // ── Edge cases ──────────────────────────────────────────────────────

  it('document_switching requires both fromDocId and toDocId', () => {
    const state = deriveCanvasRenderState({
      ...base,
      isSwitchingDocument: true,
      switchFromDocId: 'doc-a',
      // switchToDocId missing
    });
    // Falls through to next applicable state (loading_page, collaboration, or content-based)
    expect(state.type).not.toBe('document_switching');
  });

  it('pdfLoadError with all reasons produces correct state', () => {
    const reasons: Array<'not_found' | 'encrypted' | 'unsupported' | 'network'> = [
      'not_found', 'encrypted', 'unsupported', 'network',
    ];
    for (const reason of reasons) {
      const state = deriveCanvasRenderState({ ...base, pdfLoadError: { reason } });
      expect(state.type).toBe('pdf_load_error');
      if (state.type === 'pdf_load_error') {
        expect(state.reason).toBe(reason);
      }
    }
  });
});
