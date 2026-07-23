/**
 * Hook: derives the current CanvasRenderState from Canvas props.
 *
 * This is the bridge between the state-machine definition in canvasRenderState.ts
 * and the Canvas component. It picks the highest-priority applicable state
 * so the UI always shows the correct overlay (never a blank canvas).
 *
 * Priority order (first match wins):
 *   1. render_error / pdf_load_error  — explicit error passed in
 *   2. loading_document / document_switching / loading_page — loading flags
 *   3. collaboration_disconnected — offline flag
 *   4. empty_page / no_schemas — derived from schema count
 *   5. ready — default
 */

import { useMemo } from 'react';
import type { CanvasRenderState } from './canvasRenderState.js';

export interface CanvasRenderStateInput {
  /** Number of schemas on the current page */
  schemaCount: number;
  /** Current page index (0-based) */
  pageCursor: number;
  /** Active document ID */
  documentId?: string | null;

  // ── Loading flags ───────────────────────────────────────────────────
  /** True while the initial document (basePdf + template) is loading */
  isLoadingDocument?: boolean;
  /** True while switching from one document to another */
  isSwitchingDocument?: boolean;
  /** Source and target document IDs during a switch */
  switchFromDocId?: string;
  switchToDocId?: string;
  /** True while a page render is in progress */
  isLoadingPage?: boolean;

  // ── Error flags ─────────────────────────────────────────────────────
  /** A render-time error (canvas can't paint) */
  renderError?: Error | null;
  renderErrorRecoverable?: boolean;
  /** PDF failed to load */
  pdfLoadError?: { reason: 'not_found' | 'encrypted' | 'unsupported' | 'network' } | null;

  // ── Collaboration ───────────────────────────────────────────────────
  /** True when the collaboration channel is disconnected */
  isCollaborationDisconnected?: boolean;
  /** Epoch ms of the last successful sync */
  lastSyncAt?: number;
}

/**
 * Derives the single active CanvasRenderState from the given inputs.
 * The result is memoised — it only recomputes when relevant inputs change.
 */
export function useCanvasRenderState(input: CanvasRenderStateInput): CanvasRenderState {
  const {
    schemaCount,
    pageCursor,
    documentId,
    isLoadingDocument,
    isSwitchingDocument,
    switchFromDocId,
    switchToDocId,
    isLoadingPage,
    renderError,
    renderErrorRecoverable,
    pdfLoadError,
    isCollaborationDisconnected,
    lastSyncAt,
  } = input;

  return useMemo(
    () => deriveCanvasRenderState({
      schemaCount,
      pageCursor,
      documentId,
      isLoadingDocument,
      isSwitchingDocument,
      switchFromDocId,
      switchToDocId,
      isLoadingPage,
      renderError,
      renderErrorRecoverable,
      pdfLoadError,
      isCollaborationDisconnected,
      lastSyncAt,
    }),
    [
      schemaCount,
      pageCursor,
      documentId,
      isLoadingDocument,
      isSwitchingDocument,
      switchFromDocId,
      switchToDocId,
      isLoadingPage,
      renderError,
      renderErrorRecoverable,
      pdfLoadError,
      isCollaborationDisconnected,
      lastSyncAt,
    ],
  );
}

/**
 * Pure (non-hook) version for use outside React components.
 */
export function deriveCanvasRenderState(input: CanvasRenderStateInput): CanvasRenderState {
  const {
    schemaCount,
    pageCursor,
    documentId,
    isLoadingDocument = false,
    isSwitchingDocument = false,
    switchFromDocId,
    switchToDocId,
    isLoadingPage = false,
    renderError,
    renderErrorRecoverable = true,
    pdfLoadError,
    isCollaborationDisconnected = false,
    lastSyncAt = 0,
  } = input;

  if (renderError) {
    return { type: 'render_error', error: renderError, recoverable: renderErrorRecoverable };
  }
  if (pdfLoadError) {
    return { type: 'pdf_load_error', reason: pdfLoadError.reason };
  }
  if (isLoadingDocument) {
    return { type: 'loading_document' };
  }
  if (isSwitchingDocument && switchFromDocId && switchToDocId) {
    return { type: 'document_switching', fromDocId: switchFromDocId, toDocId: switchToDocId };
  }
  if (isLoadingPage) {
    return { type: 'loading_page' };
  }
  if (isCollaborationDisconnected) {
    return { type: 'collaboration_disconnected', lastSyncAt };
  }
  if (schemaCount === 0) {
    if (documentId) {
      return { type: 'empty_page', pageNumber: pageCursor + 1, documentId };
    }
    return { type: 'no_schemas', pageNumber: pageCursor + 1 };
  }
  return { type: 'ready', schemaCount };
}