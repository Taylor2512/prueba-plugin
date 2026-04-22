import React from 'react';
import type { DesignerCommentItem } from '../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../constants.js';

export type CommentsRailProps = {
  items: DesignerCommentItem[];
  onAdd?: () => void;
  title?: string;
  emptyTitle?: string;
  className?: string;
  style?: React.CSSProperties;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp || !Number.isFinite(timestamp)) return 'Sin fecha';

  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return 'Sin fecha';
  }
};

const CommentsRail = ({
  items,
  onAdd,
  title = 'Comentarios',
  emptyTitle = 'No hay comentarios en esta vista.',
  className,
  style,
}: CommentsRailProps) => {
  return (
    <div
      className={[
        DESIGNER_CLASSNAME + 'comments-rail',
        DESIGNER_CLASSNAME + 'sidebar-section-surface',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 0,
        padding: 12,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--sisad-pdfme-text-muted)' }}>
            {items.length > 0 ? `${items.length} hilo(s) en la página actual` : emptyTitle}
          </div>
        </div>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            style={{
              border: '1px solid var(--sisad-pdfme-border)',
              borderRadius: 8,
              background: 'var(--sisad-pdfme-surface)',
              color: 'var(--sisad-pdfme-text)',
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--sisad-pdfme-shadow-sm)',
            }}
          >
            Agregar
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--sisad-pdfme-border)',
            borderRadius: 10,
            padding: 14,
            background: 'var(--sisad-pdfme-surface-alt)',
            color: 'var(--sisad-pdfme-text-muted)',
            fontSize: 12,
          }}
        >
          {emptyTitle}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflowY: 'auto' }}>
          {items.map((item) => (
            <article
              key={item.id}
              style={{
                border: '1px solid var(--sisad-pdfme-border)',
                borderRadius: 12,
                background: 'var(--sisad-pdfme-surface)',
                boxShadow: 'var(--sisad-pdfme-shadow-sm)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '999px',
                      background: item.authorColor || 'var(--sisad-pdfme-border-strong)',
                      flex: '0 0 auto',
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>
                    {item.authorName || 'Autor no identificado'}
                  </span>
                </div>
                <span
                  style={{
                    borderRadius: 999,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    background: item.resolved ? 'rgba(34, 197, 94, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                    color: item.resolved ? '#15803d' : '#1d4ed8',
                  }}
                >
                  {item.resolved ? 'Resuelto' : 'Abierto'}
                </span>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--sisad-pdfme-text)' }}>{item.text}</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.schemaUid ? (
                  <span
                    style={{
                      borderRadius: 999,
                      padding: '2px 8px',
                      fontSize: 11,
                      background: 'var(--sisad-pdfme-surface-soft)',
                      color: 'var(--sisad-pdfme-text-muted)',
                    }}
                  >
                    Campo {item.schemaUid}
                  </span>
                ) : null}
                {item.pageNumber ? (
                  <span
                    style={{
                      borderRadius: 999,
                      padding: '2px 8px',
                      fontSize: 11,
                      background: 'var(--sisad-pdfme-surface-soft)',
                      color: 'var(--sisad-pdfme-text-muted)',
                    }}
                  >
                    Página {item.pageNumber}
                  </span>
                ) : null}
                <span
                  style={{
                    borderRadius: 999,
                    padding: '2px 8px',
                    fontSize: 11,
                    background: 'var(--sisad-pdfme-surface-soft)',
                    color: 'var(--sisad-pdfme-text-muted)',
                  }}
                >
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsRail;