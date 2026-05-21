/**
 * CanvasStateOverlay — renders a visual overlay for non-ready canvas states.
 *
 * PROHIBICIÓN: never render a blank canvas without context.
 * This component is the ONLY place that maps CanvasRenderState → visible UI.
 * It replaces the old hardcoded "empty state" markup in Canvas.tsx.
 *
 * Rendered states:
 *   - loading_document / loading_page / document_switching → skeleton + message
 *   - empty_page / no_schemas → empty state card with drag hint
 *   - render_error / pdf_load_error → error card + retry button
 *   - collaboration_disconnected → info banner (non-blocking)
 *   - ready → null (nothing rendered)
 */

import React from 'react';
import {
  type CanvasRenderState,
  getCanvasStateConfig,
  PDF_LOAD_ERROR_MESSAGES,
} from '../../../../../canvas/canvasRenderState.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

export interface CanvasStateOverlayProps {
  state: CanvasRenderState;
  /** Callback for retry actions (render_error, pdf_load_error) */
  onRetry?: () => void;
  /** Optional extra CSS class on the root element */
  className?: string;
}

const CLS = DESIGNER_CLASSNAME + 'canvas-state-overlay';

/**
 * Renders a visual overlay for the current canvas render state.
 * Returns null for 'ready' (normal operation — no overlay needed).
 */
export default function CanvasStateOverlay({
  state,
  onRetry,
  className,
}: CanvasStateOverlayProps): React.JSX.Element | null {
  if (state.type === 'ready') return null;

  const config = getCanvasStateConfig(state);
  const rootClass = [CLS, className].filter(Boolean).join(' ');

  // ── Loading states: skeleton overlay ────────────────────────────────
  if (config.showsSkeleton) {
    return (
      <div
        className={rootClass}
        data-state={state.type}
        data-blocks-interaction={config.blocksInteraction ? 'true' : 'false'}
        role="status"
        aria-live="polite"
      >
        <div className={`${CLS}-skeleton`}>
          <div className={`${CLS}-skeleton-pulse`} aria-hidden="true" />
          <span className={`${CLS}-skeleton-text`}>{config.message}</span>
        </div>
      </div>
    );
  }

  // ── Error states: card + retry button ───────────────────────────────
  if (state.type === 'render_error' || state.type === 'pdf_load_error') {
    const errorMessage =
      state.type === 'pdf_load_error'
        ? PDF_LOAD_ERROR_MESSAGES[state.reason]
        : config.message;

    return (
      <div
        className={rootClass}
        data-state={state.type}
        data-blocks-interaction="false"
        role="alert"
      >
        <div className={`${CLS}-error`}>
          <span className={`${CLS}-error-icon`} aria-hidden="true">
            ⚠
          </span>
          <span className={`${CLS}-error-text`}>{errorMessage}</span>
          {config.hasAction && onRetry && (
            <button
              type="button"
              className={`${CLS}-error-action`}
              onClick={onRetry}
            >
              {config.actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Collaboration disconnected: non-blocking info banner ────────────
  if (state.type === 'collaboration_disconnected') {
    return (
      <div
        className={rootClass}
        data-state={state.type}
        data-blocks-interaction="false"
        role="status"
        aria-live="polite"
      >
        <div className={`${CLS}-offline-banner`}>
          <span className={`${CLS}-offline-icon`} aria-hidden="true">
            ⚡
          </span>
          <span className={`${CLS}-offline-text`}>{config.message}</span>
        </div>
      </div>
    );
  }

  // ── Empty page / no schemas: drag hint card ─────────────────────────
  if (state.type === 'empty_page' || state.type === 'no_schemas') {
    return (
      <div
        className={rootClass}
        data-state={state.type}
        data-blocks-interaction="false"
        data-allows-drop={config.allowsDrop ? 'true' : 'false'}
      >
        <div className={DESIGNER_CLASSNAME + 'canvas-empty-state-card'}>
          <span className={DESIGNER_CLASSNAME + 'canvas-empty-state-title'}>
            Esta página todavía no tiene campos
          </span>
          <span className={DESIGNER_CLASSNAME + 'canvas-empty-state-hint'}>
            Arrastra un campo del catálogo izquierdo para empezar a construir el documento.
          </span>
        </div>
      </div>
    );
  }

  // Defensive — should never reach here
  return null;
}
