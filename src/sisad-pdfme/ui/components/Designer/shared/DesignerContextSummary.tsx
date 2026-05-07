import React from 'react';

type DesignerContextSummaryProps = {
  documentName?: React.ReactNode;
  pageIndex: number;
  pageCount: number;
  status?: React.ReactNode;
  activeUser?: React.ReactNode;
  selectionCount?: number;
  density?: 'compact' | 'normal';
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
  density = 'compact',
  placement = 'toolbar',
  className,
}: DesignerContextSummaryProps) => {
  const resolvedDocumentName = typeof documentName === 'string' ? documentName.trim() : documentName;
  const contextLabel = placement === 'sidebar' ? 'Resumen del contexto del diseñador' : 'Contexto activo del editor';

  return (
    <div
      className={['sisad-pdfme-designer-context-summary', className].filter(Boolean).join(' ')}
      data-density={density}
      data-placement={placement}
      aria-label={contextLabel}
    >
      <div className="sisad-pdfme-designer-context-summary-top">
        <span className="sisad-pdfme-designer-context-summary-title" title={typeof resolvedDocumentName === 'string' ? resolvedDocumentName : undefined}>
          {resolvedDocumentName || 'Documento local'}
        </span>
        {status ? <span className="sisad-pdfme-designer-context-summary-chip">{status}</span> : null}
      </div>
      <div className="sisad-pdfme-designer-context-summary-meta">
        <span className="sisad-pdfme-designer-context-summary-chip">Página {pageIndex + 1}/{Math.max(1, pageCount)}</span>
        {activeUser ? <span className="sisad-pdfme-designer-context-summary-chip">{activeUser}</span> : null}
        {typeof selectionCount === 'number' && selectionCount > 0 ? (
          <span className="sisad-pdfme-designer-context-summary-chip">Selección {selectionCount}</span>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(DesignerContextSummary);
