import React from 'react';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

type DesignerContextSummaryProps = {
  documentName?: React.ReactNode;
  pageIndex: number;
  pageCount: number;
  status?: React.ReactNode;
  activeUser?: React.ReactNode;
  selectionCount?: number;
  isGroupedSelection?: boolean;
  density?: 'compact' | 'normal' | 'minimal';
  placement?: 'toolbar' | 'sidebar' | 'popover';
  className?: string;
};

const DesignerContextSummary = ({
  documentName,
  pageIndex,
  pageCount,
  status,
  activeUser,
  selectionCount,
  isGroupedSelection = false,
  density = 'compact',
  placement = 'toolbar',
  className,
}: DesignerContextSummaryProps) => {
  const resolvedDocumentName = typeof documentName === 'string' ? documentName.trim() : documentName;
  const contextLabel = placement === 'sidebar' ? 'Resumen del contexto del diseñador' : 'Contexto activo del editor';
  const hasSelection = typeof selectionCount === 'number' && selectionCount > 0;
  const compactSelection = isGroupedSelection && hasSelection ? `Sel ${selectionCount}` : hasSelection ? `Sel ${selectionCount}` : null;
  const pageLabel = `Pág ${pageIndex + 1}/${Math.max(1, pageCount)}`;
  const compactMode = placement === 'toolbar' && (density === 'compact' || density === 'minimal');

  // Migración @apply → JSX (TASK-CSS): el JSX es la fuente ÚNICA de las clases
  // Tailwind del componente; las reglas de element-selector del CSS (redundantes
  // y en conflicto por orden de carga) se eliminaron. `chipClass`/`titleClass`
  // absorben las variantes de density/placement que antes vivían como reglas
  // descendientes `@apply` en la hoja (data-density=compact / data-placement=sidebar).
  const chipClass = mergeClassNames(
    'sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-600',
    density === 'compact' ? 'px-[0.35rem] py-0' : 'px-2 py-0.5',
  );
  const titleClass = mergeClassNames(
    'sisad-pdfme-designer-context-summary-title truncate font-semibold text-slate-900',
    placement === 'sidebar' ? 'text-[0.75rem]' : 'text-sm',
  );

  return (
    <div
      className={mergeClassNames(
        'sisad-pdfme-designer-context-summary inline-flex min-w-0 flex-col gap-1 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-slate-700 shadow-sm backdrop-blur-md',
        className,
      )}
      data-density={density}
      data-placement={placement}
      aria-label={contextLabel}
    >
      {compactMode ? (
        <div className="sisad-pdfme-designer-context-summary-meta is-inline flex flex-wrap items-center gap-[0.18rem]">
          {density !== 'minimal' ? (
            <span
              className="sisad-pdfme-designer-context-summary-title text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}
            >
              Doc
            </span>
          ) : null}
          {status ? <span className="sisad-pdfme-designer-context-summary-status-dot h-2.5 w-2.5 rounded-full bg-sky-500" aria-label={String(status)} title={String(status)} /> : null}
          <span className={chipClass}>{pageLabel}</span>
          {compactSelection ? <span className={chipClass}>{compactSelection}</span> : null}
        </div>
      ) : (
        <>
          <div className="sisad-pdfme-designer-context-summary-top flex items-center justify-between gap-2">
            <span className={titleClass} title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}>
              {resolvedDocumentName || 'Documento local'}
            </span>
            {status ? <span className={chipClass}>{status}</span> : null}
          </div>
          <div className="sisad-pdfme-designer-context-summary-meta flex flex-wrap items-center gap-1.5">
            <span className={chipClass}>Página {pageIndex + 1}/{Math.max(1, pageCount)}</span>
            {activeUser ? <span className={chipClass}>{activeUser}</span> : null}
            {isGroupedSelection && hasSelection ? (
              <span className={chipClass}>Grupo · {selectionCount} campos</span>
            ) : hasSelection ? (
              <span className={chipClass}>Selección {selectionCount}</span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(DesignerContextSummary);
