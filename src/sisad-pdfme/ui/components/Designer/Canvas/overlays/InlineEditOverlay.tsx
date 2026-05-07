import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal } from 'antd';

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
  const inputRef = useRef<any>(null);
  const sessionLabel = session?.target === 'name' ? 'Editar nombre' : 'Editar texto';
  const sessionHint =
    session?.target === 'name'
      ? 'Cambia el nombre visible del campo y guarda para reflejarlo en el lienzo.'
      : 'Cambia el texto del elemento y guarda para reflejarlo en el lienzo.';
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

  return (
    <Modal
      open
      centered
      destroyOnHidden
      maskClosable={false}
      title={sessionLabel}
      okText="Guardar"
      cancelText="Cancelar"
      width={Math.min(session.multiline ? 720 : 520, Math.max(360, canvasSize.width - 32))}
      onOk={commit}
      onCancel={cancel}
      afterOpenChange={(open) => {
        if (!open) return;
        requestAnimationFrame(() => {
          inputRef.current?.focus?.();
          if ('select' in (inputRef.current || {})) {
            try {
              inputRef.current?.select?.();
            } catch {
              // Ignore selection issues on unsupported inputs.
            }
          }
        });
      }}
    >
      <div className="sisad-pdfme-ui-inline-edit-overlay" style={{ display: 'grid', gap: 12 }}>
        <p className="sisad-pdfme-ui-inline-edit-overlay-hint" style={{ margin: 0 }}>
          {sessionHint}
        </p>
        {session.multiline ? (
          <Input.TextArea
            ref={inputRef as any}
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
            ref={inputRef as any}
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
        <span className="sisad-pdfme-ui-inline-edit-overlay-hint" style={{ fontSize: 12, opacity: 0.75 }}>
          Escape cancela. {session.multiline ? 'Ctrl o Cmd + Enter guarda.' : 'Enter guarda.'}
        </span>
      </div>
    </Modal>
  );
};

export type { InlineEditSession };
export default InlineEditOverlay;
