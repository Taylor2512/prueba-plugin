import React from 'react';

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
      className={['sisad-pdfme-designer-context-summary', className].filter(Boolean).join(' ')}
      data-density={density}
      data-placement={placement}
      aria-label={contextLabel}
    >
      {compactMode ? (
        <div className="sisad-pdfme-designer-context-summary-meta is-inline">
          {density !== 'minimal' ? (
            <span
              className="sisad-pdfme-designer-context-summary-title"
              title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}
            >
              Doc
            </span>
          ) : null}
          {status ? <span className="sisad-pdfme-designer-context-summary-status-dot" aria-label={String(status)} title={String(status)} /> : null}
          <span className="sisad-pdfme-designer-context-summary-chip">{pageLabel}</span>
          {compactSelection ? <span className="sisad-pdfme-designer-context-summary-chip">{compactSelection}</span> : null}
        </div>
      ) : (
        <>
          <div className="sisad-pdfme-designer-context-summary-top">
            <span className="sisad-pdfme-designer-context-summary-title" title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}>
              {resolvedDocumentName || 'Documento local'}
            </span>
            {status ? <span className="sisad-pdfme-designer-context-summary-chip">{status}</span> : null}
          </div>
          <div className="sisad-pdfme-designer-context-summary-meta">
            <span className="sisad-pdfme-designer-context-summary-chip">Página {pageIndex + 1}/{Math.max(1, pageCount)}</span>
            {activeUser ? <span className="sisad-pdfme-designer-context-summary-chip">{activeUser}</span> : null}
            {isGroupedSelection && hasSelection ? (
              <span className="sisad-pdfme-designer-context-summary-chip">Grupo · {selectionCount} campos</span>
            ) : hasSelection ? (
              <span className="sisad-pdfme-designer-context-summary-chip">Selección {selectionCount}</span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(DesignerContextSummary);
