import React from 'react';
import { Button, Popconfirm, Typography } from 'antd';
import { FileText, FileUp, Plus, Trash2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { SidebarBody, SidebarFrame, SidebarHeader } from './layout.js';
import { mergeClassNames } from '../shared/className.js';
import { SidebarSurfaceEmptyState, SidebarSurfaceHeader } from './shared/SidebarSurfacePrimitives.js';

const { Text } = Typography;

export type DesignerDocumentItem = {
  id: string;
  name: string;
  pageLabel?: string;
  previewSrc?: string | null;
  selected?: boolean;
  disabled?: boolean;
  meta?: string;
};

export type DocumentsRailProps = {
  items: DesignerDocumentItem[];
  selectedId?: string | null;
  onSelect?: (_id: string) => void;
  onAdd?: () => void;
  onUploadPdf?: () => void;
  onDelete?: (_id: string) => void;
  title?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
  density?: 'default' | 'compact';
  showInlineAddCard?: boolean;
  uploadLabel?: React.ReactNode;
  addPageLabel?: React.ReactNode;
  pageLabelPrefix?: string;
  emptyDescription?: React.ReactNode;
};

const DocumentsRail = ({
  items,
  selectedId,
  onSelect,
  onAdd,
  onUploadPdf,
  onDelete,
  title = 'Páginas',
  emptyTitle = 'Sin páginas disponibles',
  subtitle,
  className,
  style,
  useDefaultStyles = true,
  density = 'default',
  showInlineAddCard = true,
  uploadLabel = 'Subir PDF',
  addPageLabel = 'Nueva página',
  pageLabelPrefix = 'Pág.',
  emptyDescription = 'Carga un PDF para empezar.',
}: DocumentsRailProps) => {
  const canDelete = typeof onDelete === 'function';
  const hasItems = items.length > 0;
  const canUpload = typeof onUploadPdf === 'function';
  const canAdd = typeof onAdd === 'function';
  const canAddPage = canAdd && hasItems;
  const resolvedSubtitle = subtitle ?? (hasItems ? 'Selecciona una página' : 'Carga un PDF para empezar.');

  return (
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-wrapper', 'min-h-0 flex-1')}
      style={style}>
      <SidebarFrame
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'documents-rail',
          'flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm',
          density === 'compact' ? DESIGNER_CLASSNAME + 'documents-rail-compact' : '',
          useDefaultStyles ? DESIGNER_CLASSNAME + 'documents-rail-default' : '',
          className,
        )}>
        <SidebarHeader>
          <SidebarSurfaceHeader
            leading={<FileText size={14} className={DESIGNER_CLASSNAME + 'filetext-auto'} />}
            title={title}
            subtitle={resolvedSubtitle}
            badges={[{ label: items.length, color: 'default' }]}
            trailing={(
              <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-header-actions', 'flex items-center gap-2')}>
                {canUpload ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<FileUp size={14} />}
                    onClick={onUploadPdf}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action ' + DESIGNER_CLASSNAME + 'button-auto', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}
                  >
                    {uploadLabel}
                  </Button>
                ) : null}
                {canAddPage ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<Plus size={14} />}
                    onClick={onAdd}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action ' + DESIGNER_CLASSNAME + 'button-auto', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}
                    title={String(addPageLabel)}
                    aria-label={String(addPageLabel)}
                  />
                ) : null}
              </div>
            )}
            compact
          />
        </SidebarHeader>
        <SidebarBody tabIndex={0} aria-label="Lista de páginas del documento">
          {hasItems ? (
            <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-items', 'space-y-2')}>
              {canAdd && showInlineAddCard ? (
                <button
                  type="button"
                  onClick={onAdd}
                  className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-item', 'flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3')}>
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-preview', 'flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white')}>
                      <Plus size={18} />
                    </div>
                  </div>
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-meta'}>
                    <Text strong className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-sm font-medium text-slate-800')}>
                      {addPageLabel}
                    </Text>
                    <Text type="secondary" className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-xs text-slate-500')}>
                      Añade una página al final del documento
                    </Text>
                  </div>
                </button>
              ) : null}
              {items.map((item, index) => {
                const isSelected = item.selected ?? item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    className={mergeClassNames(
                      DESIGNER_CLASSNAME + 'documents-rail-item-wrapper',
                      isSelected ? DESIGNER_CLASSNAME + 'documents-rail-item-wrapper-active' : '',
                    )}>
                    <button
                      type="button"
                      disabled={item.disabled}
                      onClick={() => onSelect?.(item.id)}
                      className={mergeClassNames(
                        DESIGNER_CLASSNAME + 'documents-rail-item',
                        isSelected ? DESIGNER_CLASSNAME + 'documents-rail-item-active' : '',
                      )}
                      data-active={isSelected ? 'true' : 'false'}>
                      <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                        {item.previewSrc ? (
                          <div className={DESIGNER_CLASSNAME + 'documents-rail-preview'}>
                            <img
                              src={item.previewSrc}
                              alt={item.name}
                              className={DESIGNER_CLASSNAME + 'documents-rail-preview-image'}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className={DESIGNER_CLASSNAME + 'documents-rail-preview'}>
                            <FileText size={20} />
                          </div>
                        )}
                      </div>
                      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-meta', 'min-w-0 flex-1 space-y-1')}>
                        <Text strong ellipsis={{ tooltip: item.name }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-sm font-medium text-slate-800')}>
                          {item.name}
                        </Text>
                        <div className={DESIGNER_CLASSNAME + 'documents-rail-meta-row'}>
                          <Text type="secondary" ellipsis={{ tooltip: item.pageLabel || `${index + 1}` }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-xs text-slate-500')}>
                            {pageLabelPrefix} {item.pageLabel || `${index + 1}`}
                          </Text>
                          {isSelected ? (
                            <span className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-active-badge', 'inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700')}>
                              Activo
                            </span>
                          ) : null}
                        </div>
                        {item.meta ? (
                          <Text type="secondary" ellipsis={{ tooltip: item.meta }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-xs text-slate-500')}>
                            {item.meta}
                          </Text>
                        ) : null}
                      </div>
                    </button>
                    {canDelete && items.length > 1 ? (
                      <Popconfirm
                        title="¿Eliminar documento?"
                        description={`Se eliminará "${item.name}" y sus campos del diseño.`}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          onDelete!(item.id);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<Trash2 size={13} />}
                          className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-delete-btn', 'rounded-full border-slate-200 text-rose-600')}
                          aria-label={`Eliminar ${item.name}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <SidebarSurfaceEmptyState
              icon={<FileText size={16} />}
              title={emptyTitle}
              description={emptyDescription}
              action={canUpload ? (
                <Button
                  size="small"
                  type="default"
                  htmlType="button"
                  icon={<FileUp size={13} />}
                  onClick={onUploadPdf}
                  className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-empty-upload', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}
                >
                  {uploadLabel}
                </Button>
              ) : null}
              className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-empty', 'rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4')}
            />
          )}
        </SidebarBody>
      </SidebarFrame>
    </div>
  );
};

export default DocumentsRail;
