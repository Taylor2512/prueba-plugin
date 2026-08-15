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
} from '@sisad-pdfme/canvas/canvasRenderState';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { deriveCanvasBlockReason, shouldDisplayBlockingMask } from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

/**
 * Props del overlay de estado del canvas.
 *
 * Agrupa el estado semántico del canvas y callbacks opcionales para acciones de
 * recuperación, manteniendo la UI de estados desacoplada del runtime principal.
 */
export interface CanvasStateOverlayProps {
  state: CanvasRenderState;
  /** Callback for retry actions (render_error, pdf_load_error) */
  onRetry?: () => void;
  /** Optional extra CSS class on the root element */
  className?: string;
}

/**
 * Prefijo CSS estable para clases BEM-like del overlay.
 */
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
  const blockReason = deriveCanvasBlockReason(state);
  const blockingMaskVisible = shouldDisplayBlockingMask(blockReason, 'idle');
  const rootClass = [CLS, className].filter(Boolean).join(' ');

  // ── Loading states: skeleton overlay ────────────────────────────────
  if (config.showsSkeleton) {
    return (
      <div
        className={rootClass}
        data-state={state.type}
        data-visible="true"
        data-blocks-interaction={config.blocksInteraction ? 'true' : 'false'}
        data-block-reason={blockReason || 'none'}
        data-blocking-mask={blockingMaskVisible ? 'true' : 'false'}
        role="status"
        aria-live="polite"
      >
        <div className={mergeClassNames(`${CLS}-skeleton`, 'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm')}>
          <div className={mergeClassNames(`${CLS}-skeleton-pulse`, 'h-10 w-10 rounded-xl bg-slate-100')} aria-hidden="true" />
          <span className={mergeClassNames(`${CLS}-skeleton-text`, 'text-sm font-medium text-slate-700')}>{config.message}</span>
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
        data-visible="true"
        data-blocks-interaction="false"
        data-block-reason={blockReason || 'none'}
        data-blocking-mask={blockingMaskVisible ? 'true' : 'false'}
        role="alert"
      >
        <div className={mergeClassNames(`${CLS}-error`, 'flex items-center gap-3 rounded-2xl border border-rose-200 bg-white/95 px-4 py-3 shadow-sm')}>
          <span className={mergeClassNames(`${CLS}-error-icon`, 'text-rose-600')} aria-hidden="true">
            ⚠
          </span>
          <span className={mergeClassNames(`${CLS}-error-text`, 'text-sm text-slate-700')}>{errorMessage}</span>
          {config.hasAction && onRetry && (
            <button
              type="button"
              className={mergeClassNames(`${CLS}-error-action`, 'inline-flex items-center rounded-full border border-rose-200 bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm')}
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
        data-visible="true"
        data-blocks-interaction="false"
        data-block-reason={blockReason || 'none'}
        data-blocking-mask={blockingMaskVisible ? 'true' : 'false'}
        role="status"
        aria-live="polite"
      >
        <div className={mergeClassNames(`${CLS}-offline-banner`, 'flex items-center gap-3 rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm')}>
          <span className={mergeClassNames(`${CLS}-offline-icon`, 'text-amber-500')} aria-hidden="true">
            ⚡
          </span>
          <span className={mergeClassNames(`${CLS}-offline-text`, 'text-sm text-slate-700')}>{config.message}</span>
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
        data-visible="true"
        data-blocks-interaction="false"
        data-allows-drop={config.allowsDrop ? 'true' : 'false'}
        data-block-reason={blockReason || 'none'}
        data-blocking-mask={blockingMaskVisible ? 'true' : 'false'}
      >
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'canvas-empty-state-card', 'mx-auto flex max-w-[22rem] flex-col gap-2 rounded-[1rem] border-[1.5px] border-dashed border-[var(--color-primary-25)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.95))] p-[1.25rem_1.5rem_1.375rem] text-center text-[var(--text-primary)] shadow-[0_1.25rem_2.5rem_var(--color-gray-900-08),_0_0_0_4px_var(--color-primary-08)]')}>
          <span className={mergeClassNames(DESIGNER_CLASSNAME + 'canvas-empty-state-title', 'mb-[0.25rem] block text-[0.8125rem] font-semibold leading-[1.4] text-[var(--color-text-primary)]')}>
            Esta página todavía no tiene campos
          </span>
          <span className={mergeClassNames(DESIGNER_CLASSNAME + 'canvas-empty-state-hint', 'block text-[0.6875rem] leading-[1.5] text-[var(--color-text-muted)]')}>
            Arrastra un campo del catálogo izquierdo para empezar a construir el documento.
          </span>
        </div>
      </div>
    );
  }

  // Defensive — should never reach here
  return null;
}
