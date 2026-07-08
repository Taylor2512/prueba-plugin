import React from 'react';
import { mergeClassNames } from './className.js';

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
        <div className="sisad-pdfme-designer-context-summary-meta is-inline flex flex-wrap items-center gap-1.5">
          {density !== 'minimal' ? (
            <span
              className="sisad-pdfme-designer-context-summary-title text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}
            >
              Doc
            </span>
          ) : null}
          {status ? <span className="sisad-pdfme-designer-context-summary-status-dot h-2.5 w-2.5 rounded-full bg-sky-500" aria-label={String(status)} title={String(status)} /> : null}
          <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">{pageLabel}</span>
          {compactSelection ? <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">{compactSelection}</span> : null}
        </div>
      ) : (
        <>
          <div className="sisad-pdfme-designer-context-summary-top flex items-center justify-between gap-2">
            <span className="sisad-pdfme-designer-context-summary-title truncate text-sm font-semibold text-slate-900" title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}>
              {resolvedDocumentName || 'Documento local'}
            </span>
            {status ? <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">{status}</span> : null}
          </div>
          <div className="sisad-pdfme-designer-context-summary-meta flex flex-wrap items-center gap-1.5">
            <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">Página {pageIndex + 1}/{Math.max(1, pageCount)}</span>
            {activeUser ? <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">{activeUser}</span> : null}
            {isGroupedSelection && hasSelection ? (
              <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">Grupo · {selectionCount} campos</span>
            ) : hasSelection ? (
              <span className="sisad-pdfme-designer-context-summary-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">Selección {selectionCount}</span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(DesignerContextSummary);
