import React, { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import type { InputRef } from 'antd';
import { resolveSelectionToolbarPosition } from './floatingSurfaceGeometry.js';

type InlineEditSession = {
  schemaId: string;
  target: 'content' | 'name';
  value: string;
  rect: { top: number; left: number; width: number; height: number };
  multiline?: boolean;
};

type InlineEditOverlayProps = {
  session: InlineEditSession | null;
  canvasSize: { width: number; height: number };
  onCommit: (nextValue: string) => void;
  onCancel: () => void;
};

const InlineEditOverlay = ({ session, canvasSize, onCommit, onCancel }: InlineEditOverlayProps) => {
  const [draft, setDraft] = useState(session?.value ?? '');
  const inputRef = useRef<InputRef | null>(null);
  const sessionLabel = session?.target === 'name' ? 'Editar nombre' : 'Editar texto';
  const sessionHint =
    session?.target === 'name'
      ? 'Cambia el nombre interno del campo.'
      : 'Actualiza el contenido visible en el lienzo.';
  const inputPlaceholder = session?.target === 'name' ? 'Nombre del campo' : 'Escribe el contenido';

  useEffect(() => {
    setDraft(session?.value ?? '');
  }, [session?.schemaId, session?.target, session?.value]);

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

  const commit = () => {
    onCommit(draft);
  };

  const cancel = () => {
    onCancel();
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
    ? { width: Math.max(canvasRect.width, canvasSize.width), height: Math.max(canvasRect.height, canvasSize.height) }
    : { width: canvasSize.width, height: canvasSize.height };
  const pos = resolveSelectionToolbarPosition(bounds, { width: surfaceWidth, height: surfaceHeight }, viewportSize);

  return (
    <div
      className="sisad-pdfme-ui-inline-edit-overlay"
      role="dialog"
      aria-modal="false"
      aria-label={sessionLabel}
      aria-describedby={`inline-edit-hint-${session.schemaId}`}
      style={{ top: `${pos.top}px`, left: `${pos.left}px`, width: `${surfaceWidth}px` }}
    >
      <div className="sisad-pdfme-ui-inline-edit-overlay-header">
        <div className="sisad-pdfme-ui-inline-edit-overlay-title">{sessionLabel}</div>
        <button
          type="button"
          aria-label="Cerrar editor"
          className="sisad-pdfme-ui-inline-edit-overlay-close"
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

      <p id={`inline-edit-hint-${session.schemaId}`} className="sisad-pdfme-ui-inline-edit-overlay-hint" style={{ margin: 0 }}>
        {sessionHint}
      </p>

      {session.multiline ? (
        <Input.TextArea
          ref={inputRef}
          value={draft}
          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(event.target.value)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              cancel();
              return;
            }
            if (event.key === 'Enter' && !event.shiftKey && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              event.stopPropagation();
              commit();
            }
          }}
          onMouseDown={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
          onDoubleClick={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
          placeholder={inputPlaceholder}
          autoSize={{ minRows: 4, maxRows: 10 }}
          className="sisad-pdfme-ui-inline-edit-overlay-input"
        />
      ) : (
        <Input
          ref={inputRef}
          value={draft}
          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(event.target.value)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              cancel();
              return;
            }
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.stopPropagation();
              commit();
            }
          }}
          onMouseDown={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
          onDoubleClick={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
          placeholder={inputPlaceholder}
          className="sisad-pdfme-ui-inline-edit-overlay-input"
        />
      )}

      <div className="sisad-pdfme-ui-inline-edit-overlay-footer">
        <span className="sisad-pdfme-ui-inline-edit-overlay-hint" style={{ fontSize: 12, opacity: 0.85 }}>
          Esc cancela · {session.multiline ? 'Cmd/Ctrl + Enter guarda' : 'Enter guarda'}
        </span>
        <div className="sisad-pdfme-ui-inline-edit-overlay-actions">
          <button
            type="button"
            className="sisad-pdfme-ui-inline-edit-overlay-action"
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
            className="sisad-pdfme-ui-inline-edit-overlay-action primary"
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
