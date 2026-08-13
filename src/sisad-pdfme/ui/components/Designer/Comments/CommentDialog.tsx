import { useEffect, useState } from 'react';

import { mergeClassNames } from '../shared/className.js';

/**
 * Props del diálogo de comentarios.
 *
 * Este componente representa un modal controlado para capturar texto
 * de comentario dentro del diseñador.
 *
 * Responsabilidades:
 *
 * - mostrar/ocultar el diálogo según `open`;
 * - inicializar el textarea con `initialText`;
 * - permitir cancelar/cerrar;
 * - validar que el comentario no esté vacío antes de guardar;
 * - devolver el texto final mediante `onSave`.
 *
 * Restricciones:
 *
 * - no persiste comentarios directamente;
 * - no conoce schemas, anchors, páginas ni usuarios;
 * - no dispara eventos globales;
 * - no modifica el estado del diseñador.
 */
type CommentDialogProps = {
  /**
   * Controla si el modal está visible.
   */
  open: boolean;

  /**
   * Texto inicial del comentario.
   *
   * Útil para editar comentarios existentes o precargar contenido.
   */
  initialText?: string;

  /**
   * Callback de cierre/cancelación.
   *
   * Se ejecuta al hacer click en el backdrop o en el botón Cancelar.
   */
  onClose: () => void;

  /**
   * Callback de guardado.
   *
   * Recibe el texto normalizado y no vacío.
   */
  onSave: (text: string) => void;

  /**
   * Título visible del diálogo.
   */
  title?: string;
};

/**
 * Diálogo modal para agregar o editar comentarios.
 *
 * Mantiene un estado local `text` para permitir edición controlada
 * antes de confirmar con `onSave`.
 *
 * Flujo:
 *
 * 1. Si `open` es false, no renderiza nada.
 * 2. Al abrirse, sincroniza `text` con `initialText`.
 * 3. El usuario escribe en el textarea.
 * 4. Cancelar ejecuta `onClose`.
 * 5. Guardar limpia espacios y solo ejecuta `onSave` si hay contenido.
 */
const CommentDialog = ({
  open,
  initialText = '',
  onClose,
  onSave,
  title = 'Agregar comentario',
}: CommentDialogProps) => {
  /**
   * Texto editable del comentario.
   *
   * Se mantiene localmente para evitar guardar cambios parciales
   * hasta que el usuario confirme.
   */
  const [text, setText] = useState(initialText || '');

  /**
   * Sincroniza el texto local cada vez que se abre el diálogo.
   *
   * Esto permite reutilizar el modal para:
   *
   * - crear comentario nuevo;
   * - editar comentario existente;
   * - reabrir con otro valor inicial.
   */
  useEffect(() => {
    if (open) setText(initialText || '');
  }, [open, initialText]);

  /**
   * Evita renderizar el modal cuando está cerrado.
   */
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={mergeClassNames(
        'sisad-pdfme-comment-dialog fixed inset-0 z-[9999] flex items-center justify-center',
      )}
    >
      {/**
       * Backdrop del modal.
       *
       * Cierra el diálogo al hacer click fuera del contenido principal.
       */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/**
       * Contenedor principal del diálogo.
       */}
      <div className="relative z-[1] min-w-[360px] max-w-[min(95vw,720px)] rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-2 text-sm font-semibold text-slate-900">
          {title}
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe un comentario..."
          className="min-h-[100px] w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => {
              const normalizedText = String(text || '').trim();

              if (!normalizedText) return;

              onSave(normalizedText);
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