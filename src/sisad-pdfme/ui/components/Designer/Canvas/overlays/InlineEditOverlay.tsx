/**
 * InlineEditOverlay — editor flotante para texto o nombre de schema.
 *
 * Se posiciona cerca del schema activo, mantiene un draft local y confirma o
 * cancela cambios mediante callbacks externos. No muta schemas directamente.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import type { InputRef } from 'antd';
import { resolveSelectionToolbarPosition } from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry';

/**
 * Sesión de edición inline activa.
 *
 * Describe qué schema se está editando, qué atributo se modificará y dónde se
 * ubica el target para posicionar el editor flotante.
 */
type InlineEditSession = {
  schemaId: string;
  target: 'content' | 'name';
  value: string;
  rect: { top: number; left: number; width: number; height: number };
  multiline?: boolean;
};

/**
 * Props del editor inline flotante.
 */
type InlineEditOverlayProps = {
  session: InlineEditSession | null;
  canvasSize: { width: number; height: number };
  onCommit: (nextValue: string) => void;
  onCancel: () => void;
};

type EditorKeyEvent = React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;

const editorCommitStrategies = {
  singleLine: (event: EditorKeyEvent) => event.key === 'Enter' && !event.shiftKey,
  multiline: (event: EditorKeyEvent) =>
    event.key === 'Enter' && !event.shiftKey && (event.metaKey || event.ctrlKey),
};

/**
 * Renderiza un editor flotante para modificar texto visible o nombre interno.
 *
 * Mantiene un draft local y delega persistencia/cancelación mediante callbacks
 * para no acoplar el overlay al store ni al modelo de schemas.
 */
const InlineEditOverlay = ({ session, canvasSize, onCommit, onCancel }: InlineEditOverlayProps) => {
  const [draft, setDraft] = useState(session?.value ?? '');
  const inputRef = useRef<InputRef | null>(null);
  const sessionLabel = session?.target === 'name' ? 'Editar nombre' : 'Editar texto';
  const sessionHint =
    session?.target === 'name'
      ? 'Cambia el nombre interno del campo.'
      : 'Actualiza el contenido visible en el lienzo.';
  const inputPlaceholder = session?.target === 'name' ? 'Nombre del campo' : 'Escribe el contenido';

/**
 * Sincroniza el draft cuando cambia la sesión activa.
 */
  useEffect(() => {
    setDraft(session?.value ?? '');
  }, [session?.schemaId, session?.target, session?.value]);

/**
 * Enfoca y selecciona el input al abrir la sesión de edición.
 */
  useEffect(() => {
    if (!session) return;
    const raf = requestAnimationFrame(() => {
      inputRef.current?.focus();
      if ('select' in (inputRef.current || {})) {
        try {
          inputRef.current?.select?.();
        } catch {
          // Ignore selection issues on unsupported inputs.
        }
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [session]);

/**
 * Confirma el valor actual del draft.
 */
  const commit = () => {
    onCommit(draft);
  };

/**
 * Cancela la edición sin confirmar el draft.
 */
  const cancel = () => {
    onCancel();
  };

  const editorInteractionProps = {
    ref: inputRef,
    value: draft,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(event.target.value),
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancel();
        return;
      }

      const commitStrategy = session?.multiline
        ? editorCommitStrategies.multiline
        : editorCommitStrategies.singleLine;
      const commitsCurrentEditor = commitStrategy(event);
      if (commitsCurrentEditor) {
        event.preventDefault();
        event.stopPropagation();
        commit();
      }
    },
    onMouseDown: (event: React.MouseEvent) => {
      event.stopPropagation();
    },
    onDoubleClick: (event: React.MouseEvent) => {
      event.stopPropagation();
    },
    placeholder: inputPlaceholder,
    className: 'sisad-pdfme-ui-inline-edit-overlay-input rounded-xl border-slate-200 shadow-sm',
  };

  if (!session) return null;

  const canvasRoot = globalThis.document?.querySelector('.sisad-pdfme-designer-canvas') as HTMLElement | null;
  const canvasRect = canvasRoot?.getBoundingClientRect();
  const surfaceWidth = Math.min(session.multiline ? 420 : 360, Math.max(340, canvasSize.width - 32));
  const surfaceHeight = session.multiline ? 220 : 168;
  const bounds = {
    top: session.rect.top,
    left: session.rect.left,
    right: session.rect.left + session.rect.width,
    bottom: session.rect.top + session.rect.height,
  };
  const viewportSize = canvasRect
    ? { left: 0, top: 0, width: Math.max(canvasRect.width, canvasSize.width), height: Math.max(canvasRect.height, canvasSize.height) }
    : { left: 0, top: 0, width: canvasSize.width, height: canvasSize.height };
  const pos = resolveSelectionToolbarPosition(bounds, { width: surfaceWidth, height: surfaceHeight }, viewportSize);

  return (
    <div
      className="sisad-pdfme-ui-inline-edit-overlay absolute z-[calc(var(--z-overlay)_+_6)] flex w-[min(360px,calc(100vw_-_24px))] max-w-[calc(100vw_-_24px)] origin-top-left flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-white/95 p-2.5 shadow-lg backdrop-blur-sm pointer-events-auto [transition:transform_120ms_var(--wix-ease-out),opacity_120ms_var(--wix-ease-out)]"
      role="dialog"
      aria-modal="false"
      aria-label={sessionLabel}
      aria-describedby={`inline-edit-hint-${session.schemaId}`}
      style={{ top: `${pos.top}px`, left: `${pos.left}px`, width: `${surfaceWidth}px` }}
    >
      <div className="sisad-pdfme-ui-inline-edit-overlay-header flex items-center justify-between gap-2.5">
        <div className="sisad-pdfme-ui-inline-edit-overlay-title text-[0.8rem] font-semibold text-slate-900">{sessionLabel}</div>
        <button
          type="button"
          aria-label="Cerrar editor"
          className="sisad-pdfme-ui-inline-edit-overlay-close inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm"
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }}
        >
          ×
        </button>
      </div>

      <p id={`inline-edit-hint-${session.schemaId}`} className="sisad-pdfme-ui-inline-edit-overlay-hint mt-1.5 mb-0 text-[0.7rem] leading-5 text-slate-500">
        {sessionHint}
      </p>

      {session.multiline ? (
        <Input.TextArea
          {...editorInteractionProps}
          autoSize={{ minRows: 4, maxRows: 10 }}
        />
      ) : (
        <Input {...editorInteractionProps} />
      )}

      <div className="sisad-pdfme-ui-inline-edit-overlay-footer mt-2.5 flex items-center justify-between gap-2.5">
        <span className="sisad-pdfme-ui-inline-edit-overlay-hint text-[0.7rem] text-slate-500 opacity-[0.85]">
          Esc cancela · {session.multiline ? 'Cmd/Ctrl + Enter guarda' : 'Enter guarda'}
        </span>
        <div className="sisad-pdfme-ui-inline-edit-overlay-actions flex items-center gap-1.5">
          <button
            type="button"
            className="sisad-pdfme-ui-inline-edit-overlay-action inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.72rem] font-medium text-slate-700 shadow-sm"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              cancel();
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="sisad-pdfme-ui-inline-edit-overlay-action primary inline-flex items-center rounded-full border border-sky-200 bg-sky-600 px-2.5 py-1 text-[0.72rem] font-medium text-white shadow-sm"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              commit();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export type { InlineEditSession };
export default InlineEditOverlay;
