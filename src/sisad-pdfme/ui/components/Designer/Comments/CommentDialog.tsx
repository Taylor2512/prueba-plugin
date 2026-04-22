import React, { useEffect, useState } from 'react';

type CommentDialogProps = {
  open: boolean;
  initialText?: string;
  onClose: () => void;
  onSave: (text: string) => void;
  title?: string;
};

const CommentDialog = ({ open, initialText = '', onClose, onSave, title = 'Agregar comentario' }: CommentDialogProps) => {
  const [text, setText] = useState(initialText || '');

  useEffect(() => {
    if (open) setText(initialText || '');
  }, [open, initialText]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="sisad-pdfme-comment-dialog"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />
      <div
        style={{
          minWidth: 360,
          maxWidth: 'min(95vw, 720px)',
          background: 'var(--color-bg-elevated, #fff)',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 99999,
        }}
      >
        <div style={{ marginBottom: 8, fontWeight: 600 }}>{title}</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un comentario..."
          style={{ width: '100%', minHeight: 100, padding: 8, boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 12px' }}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              const t = String(text || '').trim();
              if (!t) return;
              onSave(t);
            }}
            style={{ padding: '8px 12px' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
