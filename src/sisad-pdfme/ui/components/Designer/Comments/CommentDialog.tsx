import React, { useEffect, useState } from 'react';
import { mergeClassNames } from '../shared/className.js';

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
      className={mergeClassNames('sisad-pdfme-comment-dialog fixed inset-0 z-[9999] flex items-center justify-center')}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className="relative z-[1] min-w-[360px] max-w-[min(95vw,720px)] rounded-2xl bg-white p-4 shadow-2xl"
      >
        <div className="mb-2 text-sm font-semibold text-slate-900">{title}</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un comentario..."
          className="min-h-[100px] w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              const t = String(text || '').trim();
              if (!t) return;
              onSave(t);
            }}
            className="rounded-full border border-sky-200 bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
