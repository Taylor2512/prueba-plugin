import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from 'antd';

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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const InlineEditOverlay = ({ session, canvasSize, onCommit, onCancel }: InlineEditOverlayProps) => {
  const [draft, setDraft] = useState(session?.value ?? '');
  const [committed, setCommitted] = useState(false);
  const inputRef = useRef<any>(null);
  const sessionLabel = session?.target === 'name' ? 'Etiqueta visible' : 'Texto del campo';
  const sessionHint = 'Enter guarda · Escape cancela · blur confirma';
  const inputPlaceholder = session?.target === 'name' ? 'Nombre del campo' : 'Escribe el contenido';

  useEffect(() => {
    setDraft(session?.value ?? '');
    setCommitted(false);
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

  const dimensions = useMemo(() => {
    if (!session) return null;
    const minWidth = session.multiline ? 240 : 180;
    const width = clamp(Math.max(session.rect.width + 48, minWidth), minWidth, Math.max(minWidth, canvasSize.width - 24));
    const height = session.multiline ? clamp(Math.max(session.rect.height + 42, 88), 88, Math.max(88, canvasSize.height - 24)) : 38;
    const left = clamp(session.rect.left, 8, Math.max(8, canvasSize.width - width - 8));
    const top = clamp(session.rect.top - (session.multiline ? 8 : 4), 8, Math.max(8, canvasSize.height - height - 8));
    return { left, top, width, height };
  }, [canvasSize.height, canvasSize.width, session]);

  if (!session || !dimensions) return null;

  const commit = () => {
    if (committed) return;
    setCommitted(true);
    onCommit(draft);
  };

  const cancel = () => {
    if (committed) return;
    setCommitted(true);
    onCancel();
  };

  const sharedProps = {
    autoFocus: true,
    value: draft,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(event.target.value),
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    },
    onBlur: () => commit(),
    onMouseDown: (event: React.MouseEvent) => {
      event.stopPropagation();
    },
    onDoubleClick: (event: React.MouseEvent) => {
      event.stopPropagation();
    },
  } as const;

  return (
    <div
      className="pdfme-ui-inline-edit-overlay"
      style={{
        top: `${dimensions.top}px`,
        left: `${dimensions.left}px`,
        width: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
      }}
    >
      <div className="pdfme-ui-inline-edit-overlay-header">
        <span className="pdfme-ui-inline-edit-overlay-kicker">
          {sessionLabel}
        </span>
        <span className="pdfme-ui-inline-edit-overlay-hint">{sessionHint}</span>
      </div>
      {session.multiline ? (
        <Input.TextArea
          {...sharedProps}
          ref={inputRef as any}
          placeholder={inputPlaceholder}
          autoSize={{ minRows: 3, maxRows: 8 }}
          className="pdfme-ui-inline-edit-overlay-input"
        />
      ) : (
        <Input
          {...sharedProps}
          ref={inputRef as any}
          placeholder={inputPlaceholder}
          className="pdfme-ui-inline-edit-overlay-input"
        />
      )}
    </div>
  );
};

export type { InlineEditSession };
export default InlineEditOverlay;
